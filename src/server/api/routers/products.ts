import type Stripe from 'stripe';

import type { ExtendedProduct } from 'models/stripe';
import stripeClient from 'utils/stripe';
import { createTRPCRouter, protectedProcedure } from '../trpc';

type InitialProduct = Stripe.Product & { prices?: Stripe.Price[] };

export const productsRouter = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const products: InitialProduct[] = (await stripeClient.products.list({ active: true })).data;

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
    const prices = (
      await stripeClient.prices.search({
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
