import { pick } from 'radash';
import Stripe from 'stripe';
import type { FormPrice, FormProduct } from 'models';

import { env } from 'env/server.mjs';

export const STRIPE_API_VERSION = '2023-10-16';
export default function initStripe() {
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });
}

export function reduceStripeProduct(product: Stripe.Product) {
  return pick(product, ['id', 'name', 'description', 'default_price', 'active']) as FormProduct;
}

export function reduceStripePrice(price: Stripe.Price) {
  return pick(price, [
    'id',
    'active',
    'product',
    'currency',
    'currency_options',
    'unit_amount',
    'recurring',
    'billing_scheme',
    'type',
    'transform_quantity',
  ]) as unknown as FormPrice;
}
