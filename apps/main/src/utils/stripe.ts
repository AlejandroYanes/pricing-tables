import Stripe from 'stripe';

export default function initStripe(apiKey: string) {
  return new Stripe(apiKey, {
    apiVersion: '2022-11-15',
  });
}
