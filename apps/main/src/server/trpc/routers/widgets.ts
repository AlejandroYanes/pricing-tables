import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import type Stripe from 'stripe';
import type { Prisma } from '@prisma/client';
import type { FormFeature, FormProduct } from 'models';

import { reduceStripePrice, reduceStripeProduct } from 'utils/stripe';
import { createTRPCRouter, protectedProcedure, stripeProcedure } from '../trpc';

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

  fetchInfo: stripeProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const widget = await ctx.prisma.priceWidget.findUnique({
      where: { id: input },
      select: {
        id: true,
        name: true,
        template: true,
        recommended: true,
        color: true,
        usesUnitLabel: true,
        unitLabel: true,
        subscribeLabel: true,
        freeTrialLabel: true,
        callbacks: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            env: true,
            url: true,
          },
        },
        products: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            isCustom: true,
            name: true,
            description: true,
            ctaLabel: true,
            ctaUrl: true,
            prices: {
              orderBy: { createdAt: 'asc' },
              select: {
                id: true,
                hasFreeTrial: true,
                freeTrialDays: true,
              },
            },
            features: {
              orderBy: { createdAt: 'asc' },
              select: {
                id: true,
                name: true,
                type: true,
                value: true,
                productId: true,
              },
            },
          },
        },
      },
    });

    if (!widget) throw new TRPCError({ code: 'NOT_FOUND' });

    return {
      name: widget.name,
      color: widget.color,
      callbacks: widget.callbacks,
      recommended: widget.recommended,
      subscribeLabel: widget.subscribeLabel,
      freeTrialLabel: widget.freeTrialLabel,
      usesUnitLabel: widget.usesUnitLabel,
      unitLabel: widget.unitLabel,
      products: await normaliseProducts(ctx.stripe, widget.products),
      features: normaliseFeatures(widget.products.flatMap((prod) => prod.features)),
    };
  }),

  updateProducts: protectedProcedure
    .input(
      z.object({
        widgetId: z.string(),
        products: z.array(
          z.object({
            id: z.string(),
            name: z.string().nullish(),
            description: z.string().nullish(),
            isCustom: z.boolean().nullish(),
            ctaLabel: z.string().nullish(),
            ctaUrl: z.string().nullish(),
            prices: z.array(
              z.object({
                id: z.string(),
                hasFreeTrial: z.boolean().nullish(),
                freeTrialDays: z.number().nullish(),
              }),
            ).nullish(),
          }),
        )
      })
    )
    .mutation(async ({ ctx, input: { products, widgetId } }) => {
      for (let pIndex = 0; pIndex < products.length; pIndex++) {
        const product = products[pIndex]!;
        await ctx.prisma.product.update({
          where: { id_widgetId: { id: product.id, widgetId } },
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
                  },
                })),
              }
            } : {})
          },
        });
      }
    }),

  updateFeatures: protectedProcedure.input(
    z.object({
      widgetId: z.string(),
      features: z.array(
        z.object({
          id: z.string(),
          productId: z.string(),
          name: z.string().nullish(),
          type: z.string().nullish(),
          value: z.string().nullish(),
        }),
      )
    }),
  ).mutation(async ({ ctx, input: { widgetId, features } }) => {
    for (let fIndex = 0; fIndex < features.length; fIndex++) {
      const feature = features[fIndex]!;
      await ctx.prisma.feature.update({
        where: { id_productId_widgetId: { id: feature.id, productId: feature.productId, widgetId } },
        data: {
          ...(hasFlakyUpdate(feature.name, 'name')),
          ...(hasFlakyUpdate(feature.type, 'type')),
          ...(hasFlakyUpdate(feature.value, 'value')),
          ...(hasFlakyUpdate(feature.productId, 'productId')),
        },
      });
    }
  }),

  updateCallbacks: protectedProcedure.input(
    z.array(
      z.object({
        id: z.string(),
        env: z.string().nullish(),
        url: z.string().nullish(),
      })
    )
  ).mutation(async ({ ctx, input: callbacks }) => {
    for (let cIndex = 0; cIndex < callbacks.length; cIndex++) {
      const callback = callbacks[cIndex]!;
      await ctx.prisma.callback.update({
        where: { id: callback.id },
        data: {
          ...(hasFlakyUpdate(callback.env, 'env')),
          ...(hasFlakyUpdate(callback.url, 'url')),
        },
      });
    }
  }),

  updateGeneralValues: protectedProcedure.input(
    z.object({
      widgetId: z.string(),
      name: z.string().nullish(),
      color: z.string().nullish(),
      recommended: z.string().nullish(),
      usesUnitLabel: z.boolean().nullish(),
      unitLabel: z.string().nullish(),
      subscribeLabel: z.string().nullish(),
      freeTrialLabel: z.string().nullish(),
    })
  ).mutation(({ ctx, input }) => {
    return ctx.prisma.priceWidget.update({
      where: { id: input.widgetId },
      data: {
        ...(hasStrictUpdate(input.name, 'name')),
        ...(hasStrictUpdate(input.usesUnitLabel, 'usesUnitLabel')),
        ...(hasFlakyUpdate(input.color, 'color')),
        ...(hasFlakyUpdate(input.recommended, 'recommended')),
        ...(hasFlakyUpdate(input.unitLabel, 'unitLabel')),
        ...(hasFlakyUpdate(input.subscribeLabel, 'subscribeLabel')),
        ...(hasFlakyUpdate(input.freeTrialLabel, 'freeTrialLabel')),
      },
    });
  }),
});

const hasFlakyUpdate = (value: any, key: string) => value !== undefined ? { [key]: value } : {};
const hasStrictUpdate = (value: any, key: string) => value !== undefined && value !== null ? { [key]: value } : {};

type ProductsList = Prisma.ProductGetPayload<{
  select: {
    id: true;
    isCustom: true;
    name: true;
    description: true;
    ctaLabel: true;
    ctaUrl: true;
    prices: {
      select: {
        id: true;
        hasFreeTrial: true;
        freeTrialDays: true;
      };
    };
    features: {
      select: {
        id: true;
        name: true;
        type: true;
        value: true;
        productId: true;
      };
    };
  };
}>[];

async function normaliseProducts(stripe: Stripe, products: ProductsList) {
  if (products!.length > 0) {
    const stripeProducts: FormProduct[] = (
      await stripe.products.list({
        ids: products!.filter((prod) => !prod.isCustom).map((prod) => prod.id),
      })
    ).data.map(reduceStripeProduct);

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
    const stripePrices = (
      await stripe.prices.search({
        query: `${pricesQuery}`,
        expand: ['data.tiers', 'data.currency_options'],
        limit: 50,
      })
    ).data.map(reduceStripePrice);

    const finalProducts: FormProduct[] = [];

    for (let pIndex = 0; pIndex < products.length; pIndex++) {
      let widgetProd = products[pIndex]!;
      const stripeProd = stripeProducts.find((p) => p.id === widgetProd.id)!;

      if (!widgetProd.isCustom) {
        widgetProd = Object.assign(widgetProd, stripeProd, { prices: widgetProd.prices });

        for (let priceIndex = 0; priceIndex < widgetProd.prices.length; priceIndex++) {
          let widgetPrice = widgetProd.prices[priceIndex]!;
          const stripePrice = stripePrices.find((p) => p.id === widgetPrice.id);
          widgetPrice = Object.assign(widgetPrice, stripePrice);
        }
      }

      finalProducts.push(widgetProd as any);
    }

    return finalProducts;
  }

  return [] as FormProduct[];
}

function normaliseFeatures(features: ProductsList[0]['features']) {
  return features.reduce((acc: FormFeature[], feature) => {
    const existing = acc.find((f) => f.id === feature.id);
    if (existing) {
      existing.products.push({ id: feature.productId, value: feature.value });
    } else {
      acc.push({
        id: feature.id,
        name: feature.name,
        type: feature.type as any,
        products: [{ id: feature.productId, value: feature.value }],
      });
    }
    return acc;
  }, [] as FormFeature[]);
}
