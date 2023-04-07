import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import type Stripe from 'stripe';
import type { Prisma } from '@prisma/client';
import type { FormFeature, FormProduct, InitialProduct } from 'models';

import { createTRPCRouter, protectedProcedure, stripeProcedure } from '../trpc';

export const widgetsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ template: z.string() })).mutation(async ({ ctx, input }) => {
    const widget = await ctx.prisma.priceWidget.create({
      data: {
        userId: ctx.session.user.id,
        template: input.template,
        subscribeLabel: 'Subscribe',
        freeTrialLabel: 'Free trial',
        color: 'teal',
      },
    });
    await ctx.prisma.callback.createMany({
      data: [
        {
          widgetId: widget.id,
          env: 'production',
          url: 'https://example.com',
        },
        {
          widgetId: widget.id,
          env: 'development',
          url: 'http://example.com',
        }
      ],
    });
    return widget.id;
  }),

  fetchInfo: stripeProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const widget = await ctx.prisma.priceWidget.findUnique({
      where: { id: input },
      select: {
        id: true,
        template: true,
        recommended: true,
        color: true,
        usesUnitLabel: true,
        unitLabel: true,
        subscribeLabel: true,
        freeTrialLabel: true,
        callbacks: true,
        currency: true,
        products: {
          select: {
            id: true,
            isCustom: true,
            ctaLabel: true,
            ctaUrl: true,
            prices: {
              select: {
                id: true,
                hasFreeTrial: true,
                freeTrialDays: true,
              },
            },
            features: {
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
      color: widget.color,
      callbacks: widget.callbacks,
      recommended: widget.recommended,
      subscribeLabel: widget.subscribeLabel,
      freeTrialLabel: widget.freeTrialLabel,
      usesUnitLabel: widget.usesUnitLabel,
      unitLabel: widget.unitLabel,
      currency: widget.currency,
      products: await normaliseProducts(ctx.stripe, widget.products),
      features: normaliseFeatures(widget.products.flatMap((prod) => prod.features)),
    };
  }),
});

type ProductsList = Prisma.ProductGetPayload<{
  select: {
    id: true;
    isCustom: true;
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
    const stripeProducts: InitialProduct[] = (
      await stripe.products.search({
        query: products!.filter((prod) => !prod.isCustom).map((prod) => `id: "${prod.id}"`).join(' OR '),
      })
    ).data;

    const pricesQuery = stripeProducts.map((prod) => `product: "${prod.id}"`).join(' OR ');
    const stripePrices = (
      await stripe.prices.search({
        query: `${pricesQuery}`,
        expand: ['data.tiers', 'data.currency_options'],
        limit: 50,
      })
    ).data;

    const finalProducts: FormProduct[] = [];

    for (let pIndex = 0; pIndex < finalProducts.length; pIndex++) {
      let widgetProd = finalProducts[pIndex]!;
      const stripeProd = stripeProducts.find((p) => p.id === widgetProd.id)!;

      if (!widgetProd.isCustom) {
        widgetProd = { ...widgetProd, ...stripeProd, prices: widgetProd.prices };

        for (let priceIndex = 0; priceIndex < widgetProd.prices.length; priceIndex++) {
          let widgetPrice = widgetProd.prices[priceIndex]!;
          const stripePrice = stripePrices.find((p) => p.id === widgetPrice.id);
          widgetPrice = { ...widgetPrice, ...stripePrice };
        }
      }

      finalProducts.push(widgetProd as FormProduct);
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
