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
        widgetId: z.string(),
        name: z.string().nullish(),
        template: z.string().nullish(),
        color: z.string().nullish(),
        recommended: z.string().nullish(),
        subscribeLabel: z.string().nullish(),
        freeTrialLabel: z.string().nullish(),
        usesUnitLabel: z.boolean().nullish(),
        unitLabel: z.string().nullish(),
        successUrl: z.string().nullish(),
        cancelUrl: z.string().nullish(),
        products: z.array(
          z.object({
            id: z.string(),
            name: z.string().nullish(),
            mask: z.string().cuid2().nullish(),
            description: z.string().nullish(),
            isCustom: z.boolean().nullish(),
            ctaLabel: z.string().nullish(),
            ctaUrl: z.string().nullish(),
            prices: z.array(
              z.object({
                id: z.string(),
                mask: z.string().cuid2().nullish(),
                hasFreeTrial: z.boolean().nullish(),
                freeTrialDays: z.number().nullish(),
              }),
            ).nullish(),
          })
        ).nullish(),
        features: z.array(
          z.object({
            id: z.string(),
            productId: z.string(),
            name: z.string().nullish(),
            type: z.string().nullish(),
            value: z.string().nullish(),
          })
        ).nullish(),
        callbacks: z.array(
          z.object({
            id: z.string(),
            env: z.string().nullish(),
            url: z.string().nullish(),
          })
        ).nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { widgetId, products, features, callbacks, ...generalValues } = input;
      //
      // for (let pIndex = 0; pIndex < products.length; pIndex++) {
      //   const product = products[pIndex]!;
      //   await ctx.prisma.product.update({
      //     where: { id_widgetId: { id: product.id, widgetId } },
      //     data: {
      //       ...(hasFlakyUpdate(product.isCustom, 'isCustom')),
      //       ...(hasFlakyUpdate(product.name, 'name')),
      //       ...(hasFlakyUpdate(product.description, 'description')),
      //       ...(hasFlakyUpdate(product.ctaLabel, 'ctaLabel')),
      //       ...(hasFlakyUpdate(product.ctaUrl, 'ctaUrl')),
      //       ...(product.prices ? {
      //         prices: {
      //           updateMany: product.prices.map((price) => ({
      //             where: { id: price.id },
      //             data: {
      //               ...(hasStrictUpdate(price.hasFreeTrial, 'hasFreeTrial')),
      //               ...(hasStrictUpdate(price.freeTrialDays, 'freeTrialDays')),
      //             },
      //           })),
      //         }
      //       } : {})
      //     },
      //   });
      // }
      //
      // for (let fIndex = 0; fIndex < features.length; fIndex++) {
      //   const feature = features[fIndex]!;
      //   await ctx.prisma.feature.update({
      //     where: { id_productId_widgetId: { id: feature.id, productId: feature.productId, widgetId } },
      //     data: {
      //       ...(hasFlakyUpdate(feature.name, 'name')),
      //       ...(hasFlakyUpdate(feature.type, 'type')),
      //       ...(hasFlakyUpdate(feature.value, 'value')),
      //       ...(hasFlakyUpdate(feature.productId, 'productId')),
      //     },
      //   });
      // }
      //
      // for (let cIndex = 0; cIndex < callbacks.length; cIndex++) {
      //   const callback = callbacks[cIndex]!;
      //   await ctx.prisma.callback.update({
      //     where: { id: callback.id },
      //     data: {
      //       ...(hasFlakyUpdate(callback.env, 'env')),
      //       ...(hasFlakyUpdate(callback.url, 'url')),
      //     },
      //   });
      // }

      ctx.prisma.priceWidget.update({
        where: { id: widgetId },
        data: {
          ...(hasStrictUpdate(generalValues.name, 'name')),
          ...(hasStrictUpdate(generalValues.template, 'template')),
          ...(hasStrictUpdate(generalValues.usesUnitLabel, 'usesUnitLabel')),
          ...(hasFlakyUpdate(generalValues.color, 'color')),
          ...(hasFlakyUpdate(generalValues.recommended, 'recommended')),
          ...(hasFlakyUpdate(generalValues.unitLabel, 'unitLabel')),
          ...(hasFlakyUpdate(generalValues.subscribeLabel, 'subscribeLabel')),
          ...(hasFlakyUpdate(generalValues.freeTrialLabel, 'freeTrialLabel')),
          ...(hasFlakyUpdate(generalValues.successUrl, 'checkoutSuccessUrl')),
          ...(hasFlakyUpdate(generalValues.cancelUrl, 'checkoutCancelUrl')),
          ...(products ? {
            products: {
              updateMany: products.map((product) => ({
                where: { id: product.id },
                data: {
                  ...(hasFlakyUpdate(product.isCustom, 'isCustom')),
                  ...(hasFlakyUpdate(product.name, 'name')),
                  ...(hasFlakyUpdate(product.description, 'description')),
                  ...(hasFlakyUpdate(product.ctaLabel, 'ctaLabel')),
                  ...(hasFlakyUpdate(product.ctaUrl, 'ctaUrl')),
                  ...(product.prices ? {
                    prices: {
                      updateMany: product.prices.map((price) => ({
                        where: { id: price.id },
                        data: {
                          ...(hasStrictUpdate(price.hasFreeTrial, 'hasFreeTrial')),
                          ...(hasStrictUpdate(price.freeTrialDays, 'freeTrialDays')),
                        }
                      }))
                    }
                  } : {}),
                  ...(features ? {
                    features: {
                      updateMany: features.map((feature) => ({
                        where: { id: feature.id },
                        data: {
                          ...(hasFlakyUpdate(feature.name, 'name')),
                          ...(hasFlakyUpdate(feature.type, 'type')),
                          ...(hasFlakyUpdate(feature.value, 'value')),
                          ...(hasFlakyUpdate(feature.productId, 'productId')),
                        }
                      }))
                    },
                  } : {}),
                }
              }))
            },
          } : {}),
          ...(callbacks ? {
            callbacks: {
              updateMany: callbacks.map((callback) => ({
                where: { id: callback.id },
                data: {
                  ...(hasFlakyUpdate(callback.env, 'env')),
                  ...(hasFlakyUpdate(callback.url, 'url')),
                }
              }))
            },
          } : {}),
        },
      });
    }),

  deleteWidget: protectedProcedure.input(z.string()).mutation(async ({ ctx, input: widgetId }) => {
    return ctx.prisma.priceWidget.delete({
      where: { id: widgetId },
    });
  }),
});

const hasFlakyUpdate = (value: any, key: string) => value !== undefined ? { [key]: value } : {};
const hasStrictUpdate = (value: any, key: string) => value !== undefined && value !== null ? { [key]: value } : {};
