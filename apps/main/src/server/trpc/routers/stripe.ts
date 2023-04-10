import { reduceStripePrice, reduceStripeProduct } from 'utils/stripe';
import { createTRPCRouter, stripeProcedure } from '../trpc';

export const stripeRouter = createTRPCRouter({
  list: stripeProcedure.query(async ({ ctx }) => {

    const products = (await ctx.stripe.products.list({ active: true, limit: 50 })).data.map(reduceStripeProduct);

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
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

    return products;
  }),
});
