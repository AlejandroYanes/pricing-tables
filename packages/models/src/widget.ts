import type { FormCallback, FormFeature, FormProduct } from './stripe-types';

export type WidgetInfo = {
  id: string;
  name: string;
  template: string;
  color: string;
  subscribeLabel: string;
  freeTrialLabel: string;
  recommended: string | null;
  unitLabel: string | null;
  successUrl: string | null;
  cancelUrl: string | null;
  products: FormProduct[];
  features: FormFeature[];
  callbacks: FormCallback[];
}

export type WidgetFormState = {
  products: FormProduct[];
  features: FormFeature[];
  callbacks: FormCallback[];
  id: string;
  name: string;
  template: string;
  color: string;
  recommended: string | null;
  subscribeLabel: string;
  freeTrialLabel: string;
  usesUnitLabel: boolean;
  unitLabel: string | null;
  successUrl: string | null;
  cancelUrl: string | null;
}
