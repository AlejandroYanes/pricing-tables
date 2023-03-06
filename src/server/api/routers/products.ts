import type Stripe from 'stripe';

import stripeClient from 'utils/stripe';
import { createTRPCRouter, protectedProcedure } from '../trpc';

type ExtendedProduct = Stripe.Product & { prices?: Stripe.Price[] };

export const productsRouter = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const products: ExtendedProduct[] = (await stripeClient.products.list()).data;

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
    const prices = (await stripeClient.prices.search({ query: `${pricesQuery}`, expand: ['data.tiers'] })).data;

    for (const price of prices) {
      if (!price.active) continue;
      const prod = products.find((p) => p.id === price.product);

      if (!prod) continue;
      if (!prod.prices) prod.prices = [];
      prod.prices.unshift(price);
    }

    return products;
  }),
});
