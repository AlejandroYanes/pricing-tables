import type Stripe from 'stripe';

export enum BILLING_SCHEME {
  PER_UNIT = 'per_unit',
  TIERED = 'tiered',
}

export enum TIER_MODE {
  GRADUATED = 'graduated',
  VOLUME = 'volume',
}

export type InitialProduct = Stripe.Product & { prices?: Stripe.Price[] };
export type ExtendedProduct = Stripe.Product & { prices: Stripe.Price[] };

export type FormPrice = Stripe.Price & {
  hasFreeTrial?: boolean;
  freeTrialDays?: number;
};
export type FormProduct = Stripe.Product & {
  prices: FormPrice[];
  isCustom?: boolean;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

export type FeatureType = 'boolean' | 'string' | 'compose';
export type FormFeature = { id: string; name: string; type: FeatureType; products: { id: string; value: string }[] };

export type CTACallback = { env: string; url: string };
