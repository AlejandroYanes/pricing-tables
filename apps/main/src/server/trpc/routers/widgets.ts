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
        name: z.string(),
        template: z.string(),
        color: z.string(),
        recommended: z.string(),
        subscribeLabel: z.string(),
        freeTrialLabel: z.string(),
        usesUnitLabel: z.boolean(),
        unitLabel: z.string(),
        successUrl: z.string(),
        cancelUrl: z.string(),
        products: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            isCustom: z.boolean(),
            ctaLabel: z.string(),
            ctaUrl: z.string(),
            prices: z.array(
              z.object({
                id: z.string(),
                hasFreeTrial: z.boolean(),
                freeTrialDays: z.number(),
              }),
            ),
          })
        ),
        features: z.array(
          z.object({
            id: z.string(),
            productId: z.string(),
            name: z.string(),
            type: z.string(),
            value: z.string(),
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
          callbacks: {
            updateMany: callbacks.map((callback) => ({
              where: { id: callback.id },
              data: {
                ...(hasFlakyUpdate(callback.env, 'env')),
                ...(hasFlakyUpdate(callback.url, 'url')),
              }
            }))
          },
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

// type ProductsList = Prisma.ProductGetPayload<{
//   select: {
//     id: true;
//     isCustom: true;
//     name: true;
//     description: true;
//     ctaLabel: true;
//     ctaUrl: true;
//     prices: {
//       select: {
//         id: true;
//         hasFreeTrial: true;
//         freeTrialDays: true;
//       };
//     };
//   };
// }>[];
//
// type FeaturesList = Prisma.FeatureGetPayload<{
//   select: {
//     id: true;
//     name: true;
//     type: true;
//     value: true;
//     productId: true;
//   };
// }>[];
//
// async function normaliseProducts(stripe: Stripe, products: ProductsList) {
//   if (products!.length > 0) {
//     const stripeProducts: FormProduct[] = (
//       await stripe.products.list({
//         ids: products!.filter((prod) => !prod.isCustom).map((prod) => prod.id),
//       })
//     ).data.map(reduceStripeProduct);
//
//     const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
//     const stripePrices = (
//       await stripe.prices.search({
//         query: `${pricesQuery}`,
//         expand: ['data.currency_options'],
//         limit: 50,
//       })
//     ).data.map(reduceStripePrice);
//
//     const finalProducts: FormProduct[] = [];
//
//     for (let pIndex = 0; pIndex < products.length; pIndex++) {
//       let widgetProd = products[pIndex]!;
//       const stripeProd = stripeProducts.find((p) => p.id === widgetProd.id)!;
//
//       if (!widgetProd.isCustom) {
//         widgetProd = Object.assign(widgetProd, stripeProd, { prices: widgetProd.prices });
//
//         for (let priceIndex = 0; priceIndex < widgetProd.prices.length; priceIndex++) {
//           let widgetPrice = widgetProd.prices[priceIndex]!;
//           const stripePrice = stripePrices.find((p) => p.id === widgetPrice.id);
//           widgetPrice = Object.assign(widgetPrice, stripePrice);
//         }
//       }
//
//       finalProducts.push(widgetProd as any);
//     }
//
//     return finalProducts;
//   }
//
//   return [] as FormProduct[];
// }
//
// function normaliseFeatures(features: FeaturesList) {
//   return features.reduce((acc: FormFeature[], feature) => {
//     const existing = acc.find((f) => f.id === feature.id);
//     if (existing) {
//       existing.products.push({ id: feature.productId, value: feature.value });
//     } else {
//       acc.push({
//         id: feature.id,
//         name: feature.name,
//         type: feature.type as any,
//         products: [{ id: feature.productId, value: feature.value }],
//       });
//     }
//     return acc;
//   }, [] as FormFeature[]);
// }
