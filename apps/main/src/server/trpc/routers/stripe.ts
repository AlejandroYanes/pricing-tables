import { z } from 'zod';
import { log } from 'next-axiom';

import { reduceStripePrice, reduceStripeProduct } from 'utils/stripe';
import { createTRPCRouter, stripeProcedure } from '../trpc';

export const stripeRouter = createTRPCRouter({
  list: stripeProcedure.input(z.string().nullish()).query(async ({ ctx, input }) => {

    log.info('stripeAccount:', { stripeAccount: ctx.stripeAccount });

    const promise = !!input
      ? ctx.stripe.products.search({ limit: 10, query: `active:"true" AND name~"${input}"` }, { stripeAccount: ctx.stripeAccount })
      : ctx.stripe.products.list({ active: true, limit: 10 }, { stripeAccount: ctx.stripeAccount });

    const products = (await promise).data.map(reduceStripeProduct);

    log.info('stripe_products:', { products });

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
    if (!!pricesQuery) {
      const prices = (
        await ctx.stripe.prices.search({
          query: `${pricesQuery}`,
          expand: ['data.currency_options'],
          limit: 50,
        }, { stripeAccount: ctx.stripeAccount })
      ).data.map(reduceStripePrice);

      console.log('----------------prices:', prices);

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
