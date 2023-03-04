import stripeClient from 'utils/stripe';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const productsRouter = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    return stripeClient.products.list({ expand: ['data.default_price'] });
  }),
});
