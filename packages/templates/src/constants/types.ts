import type { FormCallback, FormFeature, FormProduct } from 'models';

export interface TemplateProps {
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
