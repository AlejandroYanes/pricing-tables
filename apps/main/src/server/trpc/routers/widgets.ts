import { z } from 'zod';

import initDb from 'utils/planet-scale';
import { adminProcedure, createTRPCRouter, protectedProcedure } from '../trpc';

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
          id: `cb_${Date.now()}`,
          widgetId: widget.id,
          env: 'production',
          url: 'https://example.com',
          order: 0,
        },
        {
          id: `cb_${Date.now() + 1}`,
          widgetId: widget.id,
          env: 'development',
          url: 'http://example.com',
          order: 1,
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
            order: z.number(),
            name: z.string().nullish(),
            description: z.string().nullish(),
            isCustom: z.boolean().nullish(),
            ctaLabel: z.string().nullish(),
            ctaUrl: z.string().nullish(),
            prices: z.array(
              z.discriminatedUnion('isSelected', [
                z.object({
                  isSelected: z.literal(true),
                  mask: z.string().cuid2(),
                }),
                z.object({
                  isSelected: z.literal(false),
                  mask: z.string().nullish(),
                }),
              ]).and(
                z.object({
                  id: z.string(),
                  order: z.number(),
                  hasFreeTrial: z.boolean(),
                  freeTrialDays: z.number(),
                })
              ),
            ),
          })
        ),
        features: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
            order: z.number(),
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

      // managing the widget
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

      // managing the products
      const storedProducts = await ctx.prisma.product.findMany({
        where: { widgetId },
        select: {
          id: true,
        },
      });

      const newProducts = products.filter((product) => !storedProducts.find((storedProduct) => storedProduct.id === product.id));
      const productsToUpdate = products.filter((product) => storedProducts.find((storedProduct) => storedProduct.id === product.id));
      const productsToDelete = storedProducts.filter((storedProduct) => !products.find((product) => product.id === storedProduct.id));

      if (newProducts.length > 0) {
        await ctx.prisma.product.createMany({
          data: newProducts.map((product) => ({
            widgetId,
            id: product.id,
            mask: product.mask,
            order: product.order,
            name: product.name || null,
            isCustom: product.isCustom || false,
            description: product.description || null,
            ctaLabel: product.ctaLabel || null,
            ctaUrl: product.ctaUrl || null,
          })),
        });
      }

      if (productsToUpdate.length > 0) {
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
              ...(hasFlakyUpdate(product.order, 'order')),
            },
          });
        }
      }

      if (productsToDelete.length > 0) {
        await ctx.prisma.product.deleteMany({
          where: {
            id: {
              in: productsToDelete.map((product) => product.id),
            }
          }
        });
      }

      // managing prices
      const widgetPrices = products.flatMap((product) => product.prices
        .filter(price => price.isSelected)
        .map((price) => ({ ...price, productId: product.id })));
      const storedPrices = await ctx.prisma.price.findMany({
        where: { widgetId },
        select: {
          id: true,
        },
      });

      const newPrices = widgetPrices.filter((price) => !storedPrices.find((storedPrice) => storedPrice.id === price.id));
      const pricesToUpdate = widgetPrices.filter((price) => storedPrices.find((storedPrice) => storedPrice.id === price.id));
      const pricesToDelete = storedPrices.filter((storedPrice) => !widgetPrices.find((price) => price.id === storedPrice.id));

      if (newPrices.length > 0) {
        await ctx.prisma.price.createMany({
          data: newPrices.map((price) => ({
            widgetId,
            id: price.id,
            productId: price.productId,
            mask: price.mask!,
            hasFreeTrial: price.hasFreeTrial,
            freeTrialDays: price.freeTrialDays,
            order: price.order,
          })),
        });
      }

      if (pricesToUpdate.length > 0) {
        for (let pIndex = 0; pIndex < pricesToUpdate.length; pIndex++) {
          const price = pricesToUpdate[pIndex]!;
          await ctx.prisma.price.update({
            where: { id_widgetId: { id: price.id, widgetId } },
            data: {
              ...(hasFlakyUpdate(price.hasFreeTrial, 'hasFreeTrial')),
              ...(hasFlakyUpdate(price.freeTrialDays, 'freeTrialDays')),
              ...(hasFlakyUpdate(price.order, 'order')),
            },
          });
        }
      }

      if (pricesToDelete.length > 0) {
        await ctx.prisma.price.deleteMany({
          where: {
            id: {
              in: pricesToDelete.map((price) => price.id),
            }
          }
        });
      }

      // managing features
      type FlattenedFeature = { id: string; name: string; type: string; order: number; value: string; productId: string };
      const flattenFeatures: FlattenedFeature[] = Object.values(features).reduce((list, feature) => {
        const flattened = feature.products.map((prod) => ({
          id: feature.id,
          name: feature.name,
          type: feature.type,
          order: feature.order,
          value: prod.value,
          productId: prod.id,
          widgetId,
        }));
        return list.concat(flattened);
      }, [] as FlattenedFeature[]);

      const storedFeatures = await ctx.prisma.feature.findMany({
        where: { widgetId },
        select: {
          id: true,
          productId: true,
        },
      });
      const newFeatures = flattenFeatures.filter((feature) => !storedFeatures.find((storedFeature) => (
        storedFeature.id === feature.id && storedFeature.productId === feature.productId
      )));
      const featuresToUpdate = flattenFeatures.filter((feature) => storedFeatures.find((storedFeature) => (
        storedFeature.id === feature.id && storedFeature.productId === feature.productId
      )));
      // eslint-disable-next-line max-len
      const featuresToDelete = storedFeatures.filter((storedFeature) => !flattenFeatures.find((feature) => (
        storedFeature.id === feature.id && storedFeature.productId === feature.productId
      )));

      if (newFeatures.length > 0) {
        await ctx.prisma.feature.createMany({
          data: newFeatures.map((feature) => ({
            widgetId,
            productId: feature.productId,
            id: feature.id,
            name: feature.name,
            type: feature.type,
            value: feature.value,
            order: feature.order,
          })),
        });
      }

      if (featuresToUpdate.length > 0) {
        for (let fIndex = 0; fIndex < featuresToUpdate.length; fIndex++) {
          const feature = featuresToUpdate[fIndex]!;
          await ctx.prisma.feature.update({
            where: { id_productId_widgetId: { id: feature.id, productId: feature.productId, widgetId } },
            data: {
              ...(hasFlakyUpdate(feature.name, 'name')),
              ...(hasFlakyUpdate(feature.type, 'type')),
              ...(hasFlakyUpdate(feature.value, 'value')),
              ...(hasFlakyUpdate(feature.order, 'order')),
            },
          });
        }
      }

      if (featuresToDelete.length > 0) {
        await ctx.prisma.feature.deleteMany({
          where: {
            id: {
              in: featuresToDelete.map((feature) => feature.id),
            }
          }
        });
      }

      // managing callbacks
      const storedCallbacks = await ctx.prisma.callback.findMany({
        where: { widgetId },
        select: {
          id: true,
        }
      });

      const newCallbacks = callbacks.filter((callback) => !storedCallbacks.find((storedCallback) => storedCallback.id === callback.id));
      const callbacksToUpdate = callbacks.filter((callback) => storedCallbacks.find((storedCallback) => storedCallback.id === callback.id));
      // eslint-disable-next-line max-len
      const callbacksToDelete = storedCallbacks.filter((storedCallback) => !callbacks.find((callback) => callback.id === storedCallback.id));

      if (newCallbacks.length > 0) {
        await ctx.prisma.callback.createMany({
          data: newCallbacks.map((callback) => ({
            widgetId,
            id: callback.id,
            env: callback.env,
            url: callback.url,
          }))
        });
      }

      if (callbacksToUpdate.length > 0) {
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
      }

      if (callbacksToDelete.length > 0) {
        await ctx.prisma.callback.deleteMany({
          where: {
            id: {
              in: callbacksToDelete.map((callback) => callback.id),
            }
          }
        });
      }
    }),

  listGuestWidgets: adminProcedure
    .input(
      z.object({
        page: z.number().min(1),
        pageSize: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const results = await ctx.prisma.priceWidget.findMany({
        take: pageSize,
        skip: page === 1 ? 0 : pageSize * (page - 1),
        where: {
          userId: {
            startsWith: 'guest_',
          }
        },
        select: {
          id: true,
          name: true,
          userId: true,
          createdAt: true,
        },
      });
      const count = await ctx.prisma.priceWidget.count({
        where: {
          userId: {
            startsWith: 'guest_',
          }
        }
      });
      return { results, count };
    }),

  deleteGuestWidgets: adminProcedure.mutation(async () => {
    const db = initDb();

    const guestWidgets = (
      // eslint-disable-next-line max-len
      await db.execute('SELECT id FROM PriceWidget WHERE userId LIKE \'guest_%\'')
    ).rows as { id: string }[];

    const ids = guestWidgets.map((w) => w.id);

    await db.transaction(async (tx) => {
      await tx.execute('DELETE FROM `pricing-tables`.Product WHERE Product.widgetId IN (?)', [ids]);
      await tx.execute('DELETE FROM `pricing-tables`.Price WHERE Price.widgetId IN (?)', [ids]);
      await tx.execute('DELETE FROM `pricing-tables`.Feature WHERE Feature.widgetId IN (?)', [ids]);
      await tx.execute('DELETE FROM `pricing-tables`.Callback WHERE Callback.widgetId IN (?)', [ids]);
      await tx.execute('DELETE FROM `pricing-tables`.PriceWidget WHERE PriceWidget.id IN (?)', [ids]);
    });
  }),
});

const hasFlakyUpdate = (value: any, key: string) => value !== undefined ? { [key]: value } : {};
const hasStrictUpdate = (value: any, key: string) => value !== undefined && value !== null ? { [key]: value } : {};
