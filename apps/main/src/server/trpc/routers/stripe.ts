import { z } from 'zod';

import { reduceStripePrice, reduceStripeProduct } from 'utils/stripe';
import { createTRPCRouter, stripeProcedure } from '../trpc';

export const stripeRouter = createTRPCRouter({
  list: stripeProcedure.input(z.string().nullish()).query(async ({ ctx, input }) => {

    console.log('-----------------');
    console.log('query', { input, type: typeof input, query: `active:"true" AND name~"${input}"` });
    console.log('-----------------');

    const promise = !!input
      ? ctx.stripe.products.search({ limit: 10, query: `active:"true" AND name~"${input}"` })
      : ctx.stripe.products.list({ active: true, limit: 10 });

    const products = (await promise).data.map(reduceStripeProduct);

    console.log('-----------------');
    console.log('list products and prices', { products: products.map((p) => ({ id: p.id })) });
    console.log('-----------------');

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
    if (!!pricesQuery) {
      const prices = (
        await ctx.stripe.prices.search({
          query: `${pricesQuery}`,
          expand: ['data.currency_options'],
          limit: 50,
        })
      ).data.map(reduceStripePrice);
  
      for (const price of prices) {
        if (!price.active) continue;
        if (price.billing_scheme === 'tiered') continue;
  
        const prod = products.find((p) => p.id === price.product);
  
        if (!prod) continue;
        if (!(prod).prices) prod.prices = [];
        if (price.id === prod.default_price) {
          prod.prices.unshift(price);
        } else {
          prod.prices.push(price);
        }
      }
    }

    return products;
  }),
});
