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
  isPerUnit?: boolean;
  unitLabel?: string;
};
export type FormProduct = Stripe.Product & {
  prices: FormPrice[];
};
