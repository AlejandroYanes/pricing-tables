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

  // addProduct: protectedProcedure.input(
  //   z.object({
  //     widgetId: z.string(),
  //     productId: z.string(),
  //     priceId: z.string(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.product.create({
  //     data: {
  //       id: input.productId,
  //       widgetId: input.widgetId,
  //       prices: {
  //         create: {
  //           id: input.priceId,
  //         },
  //       },
  //     },
  //   });
  // }),

  // addCustomProduct: protectedProcedure.input(
  //   z.object({
  //     widgetId: z.string(),
  //     productId: z.string(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.product.create({
  //     data: {
  //       isCustom: true,
  //       id: input.productId,
  //       widgetId: input.widgetId,
  //       name: 'Custom Product',
  //       description: 'Custom product are used to present an extra option for users to contact the sales team',
  //       ctaLabel: 'Contact Us',
  //       ctaUrl: '',
  //     },
  //   });
  // }),

  // removeProduct: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.product.delete({ where: { id: input } });
  // }),

  // addPrice: protectedProcedure.input(
  //   z.object({
  //     productId: z.string(),
  //     priceId: z.string(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.price.create({
  //     data: {
  //       stripeId: input.priceId,
  //       productId: input.productId,
  //     },
  //   });
  // }),

  // removePrice: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.price.delete({ where: { id: input } });
  // }),

  // toggleFreeTrial: protectedProcedure.input(
  //   z.object({
  //     priceId: z.string(),
  //     value: z.boolean(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.price.update({
  //     where: { id: input.priceId },
  //     data: {
  //       hasFreeTrial: input.value,
  //     },
  //   });
  // }),

  // setFreeTrialDays: protectedProcedure.input(
  //   z.object({
  //     priceId: z.string(),
  //     value: z.number(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.price.update({
  //     where: { id: input.priceId },
  //     data: {
  //       freeTrialDays: input.value,
  //     },
  //   });
  // }),

  // updateCustomCtaLabel: protectedProcedure.input(
  //   z.object({
  //     productId: z.string(),
  //     value: z.string(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.product.update({
  //     where: { id: input.productId },
  //     data: {
  //       ctaLabel: input.value,
  //     },
  //   });
  // }),

  // updateCustomCtaUrl: protectedProcedure.input(
  //   z.object({
  //     productId: z.string(),
  //     value: z.string(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.product.update({
  //     where: { id: input.productId },
  //     data: {
  //       ctaUrl: input.value,
  //     },
  //   });
  // }),

  // updateCustomName: protectedProcedure.input(
  //   z.object({
  //     productId: z.string(),
  //     value: z.string(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.product.update({
  //     where: { id: input.productId },
  //     data: {
  //       name: input.value,
  //     },
  //   });
  // }),

  // updateCustomDescription: protectedProcedure.input(
  //   z.object({
  //     productId: z.string(),
  //     value: z.string(),
  //   })
  // ).mutation(async ({ ctx, input }) => {
  //   return ctx.prisma.product.update({
  //     where: { id: input.productId },
  //     data: {
  //       description: input.value,
  //     },
  //   });
  // }),

  toggleUnitLabel: protectedProcedure.input(
    z.object({
      widgetId: z.string(),
      value: z.boolean(),
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.priceWidget.update({
      where: { id: input.widgetId },
      data: {
        usesUnitLabel: input.value,
      },
    });
  }),

  updateUnitLabel: protectedProcedure.input(
    z.object({
      widgetId: z.string(),
      value: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.priceWidget.update({
      where: { id: input.widgetId },
      data: {
        unitLabel: input.value,
      },
    });
  }),

  updateProducts: protectedProcedure
    .input(z.array(
      z.object({
        widgetId: z.string(),
        id: z.string(),
        isCustom: z.boolean().nullish(),
        ctaLabel: z.string().nullish(),
        ctaUrl: z.string().nullish(),
        prices: z.array(
          z.object({
            id: z.string(),
            hasFreeTrial: z.boolean().nullish(),
            freeTrialDays: z.number().nullish(),
          }),
        ),
      }),
    ))
    .mutation(async ({ ctx, input: products }) => {
      const hasFlakyValue = (value: any) => value !== undefined;
      const hasStrictValue = (value: any) => value !== undefined && value !== null;

      for (let pIndex = 0; pIndex < products.length; pIndex++) {
        const product = products[pIndex]!;
        await ctx.prisma.product.update({
          where: { id_widgetId: { id: product.id, widgetId: product.widgetId } },
          data: {
            ...(hasStrictValue(product.isCustom) ? { isCustom: product.isCustom as boolean } : {}),
            ...(hasFlakyValue(product.ctaLabel) ? { ctaLabel: product.ctaLabel as string } : {}),
            ...(hasFlakyValue(product.ctaUrl) ? { ctaUrl: product.ctaUrl as string } : {}),
            ...(product.prices.length > 0 ? {
              prices: {
                updateMany: product.prices.map((price) => ({
                  where: { id: price.id },
                  data: {
                    ...(hasStrictValue(price.hasFreeTrial) ? { hasFreeTrial: price.hasFreeTrial as boolean } : {}),
                    ...(hasStrictValue(price.freeTrialDays) ? { freeTrialDays: price.freeTrialDays as number } : {}),
                  },
                })),
              }
            } : {})
          },
        });
      }
    }),

  updateFeatures: protectedProcedure.input(
    z.array(
      z.object({
        id: z.string(),
        name: z.string().nullish(),
        type: z.string().nullish(),
        value: z.string().nullish(),
        productId: z.string().nullish(),
      }),
    )
  ).mutation(async ({ ctx, input: features }) => {
    for (let fIndex = 0; fIndex < features.length; fIndex++) {
      const feature = features[fIndex]!;
      await ctx.prisma.feature.update({
        where: { id: feature.id },
        data: {
          ...(feature.name !== undefined ? { name: feature.name as string } : {}),
          ...(feature.type !== undefined ? { type: feature.type as string } : {}),
          ...(feature.value !== undefined ? { value: feature.value as string } : {}),
          ...(feature.productId !== undefined ? { productId: feature.productId as string } : {}),
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
          ...(callback.env !== undefined ? { env: callback.env as string } : {}),
          ...(callback.url !== undefined ? { url: callback.url as string } : {}),
        },
      });
    }
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

    const prices = products!.flatMap((prod) => prod.prices);
    const pricesQuery = prices.map((price) => `id: "${price.id}"`).join(' OR ');
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
