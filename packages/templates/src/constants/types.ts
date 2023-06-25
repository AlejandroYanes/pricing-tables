import type { FormCallback, FormFeature, FormProduct } from '@dealo/models';
import type Stripe from 'stripe';

export interface TemplateProps {
  dev?: boolean;
  widget: string;
  features: FormFeature[];
  products: FormProduct[];
  recommended: string | null;
  unitLabel: string | null;
  color: string;
  subscribeLabel: string;
  freeTrialLabel: string;
  callbacks: FormCallback[];
  environment?: string;
  currency?: string | null;
}

export interface SkeletonProps {
  scale?: number;
}

export type Interval = undefined | 'one_time' | Stripe.Price.Recurring.Interval | `month_${number}`;
