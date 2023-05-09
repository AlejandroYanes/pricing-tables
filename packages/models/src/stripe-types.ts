import type Stripe from 'stripe';

export enum BILLING_SCHEME {
  PER_UNIT = 'per_unit',
  TIERED = 'tiered',
}

export type FormPrice = {
  id: string;
  mask: string;
  type: string;
  active: boolean;
  product: string;
  hasFreeTrial: boolean;
  freeTrialDays: number;
  unit_amount: number;
  currency: string;
  currency_options?: {
    [key: string]: {
      custom_unit_amount: string | null;
      tax_behavior: string;
      unit_amount: number;
      unit_amount_decimal: string;
    };
  };
  recurring?: { interval: Stripe.Price.Recurring.Interval; interval_count: number };
  billing_scheme?: BILLING_SCHEME;
  transform_quantity?: { divide_by: number; round: string };
};
export type FormProduct = {
  id: string;
  mask: string;
  name: string;
  active: boolean;
  description: string;
  prices: FormPrice[];
  default_price?: any;
  isCustom?: boolean;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

export type FeatureType = 'boolean' | 'string' | 'compose';
export type FormFeature = { id: string; name: string; type: FeatureType; products: { id: string; value: string }[] };

export type FormCallback = { id: string; env: string; url: string; error?: string };
