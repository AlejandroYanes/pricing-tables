import type Stripe from 'stripe';
import type { FormCallback, FormFeature, FormProduct } from '@dealo/models';
import { type Colors } from '@dealo/helpers';

export interface TemplateProps {
  dev?: boolean;
  widget: string;
  features: FormFeature[];
  products: FormProduct[];
  recommended: string | null;
  unitLabel: string | null;
  color: Colors;
  subscribeLabel: string;
  freeTrialLabel: string;
  callbacks: FormCallback[];
  environment?: string;
  currency?: string | null;
  isMobile?: boolean;
}

export interface SkeletonProps {
  scale?: number;
  color?: string;
}

export type Interval = undefined | 'one_time' | Stripe.Price.Recurring.Interval | `month_${number}`;
