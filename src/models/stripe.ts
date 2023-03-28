import type Stripe from 'stripe';

export enum BILLING_SCHEME {
  PER_UNIT = 'per_unit',
  TIERED = 'tiered',
}

export enum TIER_MODE {
  GRADUATED = 'graduated',
  VOLUME = 'volume',
}

export type ExtendedProduct = Stripe.Product & { prices: Stripe.Price[] };

export type FormPrice = Stripe.Price & {
  hasFreeTrial?: boolean;
  freeTrialDays?: number;
};
export type FormProduct = Stripe.Product & {
  prices: FormPrice[];
};

export type FeatureType = 'boolean' | 'string' | 'currency';
export type FeatureValue = boolean | string | number;
export type Feature = { name: string; type: FeatureType; products: { id: string; value: FeatureValue }[] };
