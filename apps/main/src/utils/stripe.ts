import { pick } from 'radash';
import Stripe from 'stripe';
import type { FormPrice, FormProduct } from '@dealo/models';

export default function initStripe(apiKey: string) {
  return new Stripe(apiKey, {
    apiVersion: '2022-11-15',
  });
}

export const guestStripeKey = 'sk_test_51MgxvIJIZhxRN8vV5sWzNgHYLINskNmKeKzzhROJScoVBeuiRmovr14TjysgTfIrOOqhK1c2anQBjtkkZIsuj3qu00hyBA6DUu'

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
