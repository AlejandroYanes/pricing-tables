import { pick } from 'radash';
import Stripe from 'stripe';
import type { FormPrice, FormProduct } from 'models';

export default function initStripe(apiKey: string) {
  return new Stripe(apiKey, {
    apiVersion: '2022-11-15',
  });
}

export function reduceStripeProduct(product: Stripe.Product) {
  return pick(product, ['id', 'name', 'description', 'default_price']) as FormProduct;
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
  ]) as FormPrice;
}
