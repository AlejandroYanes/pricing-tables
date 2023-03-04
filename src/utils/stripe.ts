import Stripe from 'stripe';

import { serverEnv } from 'env/schema.mjs';

const stripeClient = new Stripe(serverEnv.STRIPE_API_KEY!, {
  apiVersion: '2022-11-15',
});

export default stripeClient;
