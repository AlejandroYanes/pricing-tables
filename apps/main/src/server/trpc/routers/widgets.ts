import type { Feature } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const widgetsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ name: z.string(), template: z.string() })).mutation(async ({ ctx, input }) => {
    const widget = await ctx.prisma.priceWidget.create({
      data: {
        userId: ctx.session.user.id,
        name: input.name,
        template: input.template,
        subscribeLabel: 'Subscribe',
        freeTrialLabel: 'Start free trial',
        color: 'teal',
      },
    });
    await ctx.prisma.callback.createMany({
      data: [
        {
          id: `${Date.now()}`,
          widgetId: widget.id,
          env: 'production',
          url: 'https://example.com',
        },
        {
          id: `${Date.now() + 1}`,
          widgetId: widget.id,
          env: 'development',
          url: 'http://example.com',
        }
      ],
    });
    return widget.id;
  }),

  deleteWidget: protectedProcedure.input(z.string()).mutation(async ({ ctx, input: widgetId }) => {
    return ctx.prisma.priceWidget.delete({
      where: { id: widgetId },
    });
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.priceWidget.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        template: true,
      },
    });
  }),

  updateWidget: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        template: z.string(),
        color: z.string(),
        recommended: z.string().nullish(),
        subscribeLabel: z.string(),
        freeTrialLabel: z.string(),
        usesUnitLabel: z.boolean(),
        unitLabel: z.string().nullish(),
        successUrl: z.string().nullish(),
        cancelUrl: z.string().nullish(),
        products: z.array(
          z.object({
            id: z.string(),
            mask: z.string().cuid2(),
            createdAt: z.string(),
            name: z.string().nullish(),
            description: z.string().nullish(),
            isCustom: z.boolean().nullish(),
            ctaLabel: z.string().nullish(),
            ctaUrl: z.string().nullish(),
            prices: z.array(
              z.object({
                id: z.string(),
                createdAt: z.string(),
                mask: z.string().cuid2(),
                hasFreeTrial: z.boolean(),
                freeTrialDays: z.number(),
              }),
            ),
          })
        ),
        features: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
            products: z.array(z.object({
              id: z.string(),
              value: z.string(),
            })),
          })
        ),
        callbacks: z.array(
          z.object({
            id: z.string(),
            env: z.string(),
            url: z.string(),
          })
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: widgetId, products, features, callbacks, ...generalValues } = input;

      await ctx.prisma.priceWidget.update({
        where: { id: widgetId },
        data: {
          ...(hasStrictUpdate(generalValues.name, 'name')),
          ...(hasStrictUpdate(generalValues.template, 'template')),
          ...(hasFlakyUpdate(generalValues.color, 'color')),
          ...(hasFlakyUpdate(generalValues.recommended, 'recommended')),
          ...(hasStrictUpdate(generalValues.usesUnitLabel, 'usesUnitLabel')),
          ...(hasFlakyUpdate(generalValues.unitLabel, 'unitLabel')),
          ...(hasFlakyUpdate(generalValues.subscribeLabel, 'subscribeLabel')),
          ...(hasFlakyUpdate(generalValues.freeTrialLabel, 'freeTrialLabel')),
          ...(hasFlakyUpdate(generalValues.successUrl, 'checkoutSuccessUrl')),
          ...(hasFlakyUpdate(generalValues.cancelUrl, 'checkoutCancelUrl')),
        },
      });

      const storedProducts = await ctx.prisma.product.findMany({
        where: { widgetId },
        select: {
          id: true,
        },
      });

      const newProducts = products.filter((product) => !storedProducts.find((storedProduct) => storedProduct.id === product.id));
      const productsToUpdate = products.filter((product) => storedProducts.find((storedProduct) => storedProduct.id === product.id));

      await ctx.prisma.product.createMany({
        data: newProducts.map((product) => ({
          widgetId,
          id: product.id,
          mask: product.mask,
          createdAt: product.createdAt,
          name: product.name || null,
          isCustom: product.isCustom || false,
          description: product.description || null,
          ctaLabel: product.ctaLabel || null,
          ctaUrl: product.ctaUrl || null,
        })),
      });

      for (let pIndex = 0; pIndex < productsToUpdate.length; pIndex++) {
        const product = productsToUpdate[pIndex]!;
        await ctx.prisma.product.update({
          where: { id_widgetId: { id: product.id, widgetId } },
          data: {
            ...(hasFlakyUpdate(product.isCustom, 'isCustom')),
            ...(hasFlakyUpdate(product.name, 'name')),
            ...(hasFlakyUpdate(product.description, 'description')),
            ...(hasFlakyUpdate(product.ctaLabel, 'ctaLabel')),
            ...(hasFlakyUpdate(product.ctaUrl, 'ctaUrl')),
            ...(hasFlakyUpdate(product.createdAt, 'createdAt')),
          },
        });
      }

      const newPrices = newProducts.flatMap((product) => product.prices.map((price) => ({ ...price, productId: product.id })));
      const pricesToUpdate = productsToUpdate.flatMap((product) => product.prices);

      await ctx.prisma.price.createMany({
        data: newPrices.map((price) => ({
          widgetId,
          id: price.id,
          productId: price.productId,
          mask: price.mask,
          hasFreeTrial: price.hasFreeTrial,
          freeTrialDays: price.freeTrialDays,
          createdAt: price.createdAt,
        })),
      });

      for (let pIndex = 0; pIndex < pricesToUpdate.length; pIndex++) {
        const price = pricesToUpdate[pIndex]!;
        await ctx.prisma.price.update({
          where: { id_widgetId: { id: price.id, widgetId } },
          data: {
            ...(hasFlakyUpdate(price.hasFreeTrial, 'hasFreeTrial')),
            ...(hasFlakyUpdate(price.freeTrialDays, 'freeTrialDays')),
            ...(hasFlakyUpdate(price.createdAt, 'createdAt')),
          },
        });
      }

      const flattenFeatures = Object.values(features).reduce((list, feature) => {
        const flattened = feature.products.map((prod) => ({
          id: feature.id,
          name: feature.name,
          type: feature.type,
          value: prod.value,
          productId: prod.id,
        }));
        return list.concat(flattened as Feature[]);
      }, [] as Feature[]);

      const storedFeatures = await ctx.prisma.feature.findMany({
        where: { widgetId, productId: { in: flattenFeatures.map((feat) => feat.productId) } },
        select: {
          id: true,
        },
      });
      const newFeatures = flattenFeatures.filter((feature) => !storedFeatures.find((storedFeature) => storedFeature.id === feature.id));
      const featuresToUpdate = flattenFeatures.filter((feature) => storedFeatures.find((storedFeature) => storedFeature.id === feature.id));

      await ctx.prisma.feature.createMany({
        data: newFeatures.map((feature) => ({
          widgetId,
          productId: feature.productId,
          id: feature.id,
          name: feature.name,
          type: feature.type,
          value: feature.value,
        })),
      });

      for (let fIndex = 0; fIndex < featuresToUpdate.length; fIndex++) {
        const feature = featuresToUpdate[fIndex]!;
        await ctx.prisma.feature.update({
          where: { id_productId_widgetId: { id: feature.id, productId: feature.productId, widgetId } },
          data: {
            ...(hasFlakyUpdate(feature.name, 'name')),
            ...(hasFlakyUpdate(feature.type, 'type')),
            ...(hasFlakyUpdate(feature.value, 'value')),
          },
        });
      }

      const storedCallbacks = await ctx.prisma.callback.findMany({
        where: { widgetId },
        select: {
          id: true,
        }
      });

      const newCallbacks = callbacks.filter((callback) => !storedCallbacks.find((storedCallback) => storedCallback.id === callback.id));
      const callbacksToUpdate = callbacks.filter((callback) => storedCallbacks.find((storedCallback) => storedCallback.id === callback.id));

      await ctx.prisma.callback.createMany({
        data: newCallbacks.map((callback) => ({
          widgetId,
          id: callback.id,
          env: callback.env,
          url: callback.url,
        }))
      });

      for (let cIndex = 0; cIndex < callbacksToUpdate.length; cIndex++) {
        const callback = callbacksToUpdate[cIndex]!;
        await ctx.prisma.callback.update({
          where: { id: callback.id },
          data: {
            ...(hasFlakyUpdate(callback.env, 'env')),
            ...(hasFlakyUpdate(callback.url, 'url')),
          }
        });
      }
    }),
});

const hasFlakyUpdate = (value: any, key: string) => value !== undefined ? { [key]: value } : {};
const hasStrictUpdate = (value: any, key: string) => value !== undefined && value !== null ? { [key]: value } : {};
