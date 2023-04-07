import type { ExtendedProduct, InitialProduct } from 'models';

import { createTRPCRouter, stripeProcedure } from '../trpc';

export const stripeRouter = createTRPCRouter({
  list: stripeProcedure.query(async ({ ctx }) => {

    const products: InitialProduct[] = (await ctx.stripe.products.list({ active: true })).data;

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
    const prices = (
      await ctx.stripe.prices.search({
        query: `${pricesQuery}`,
        expand: ['data.tiers', 'data.currency_options'],
        limit: 50,
      })
    ).data;

    for (const price of prices) {
      if (!price.active) continue;
      const prod = products.find((p) => p.id === price.product);

      if (!prod) continue;
      if (!(prod).prices) prod.prices = [];
      if (price.id === prod.default_price) {
        prod.prices.unshift(price);
      } else {
        prod.prices.push(price);
      }
    }

    return products as ExtendedProduct[];
  }),
});
