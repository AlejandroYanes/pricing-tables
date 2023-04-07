import type { CTACallback, FormFeature, FormProduct } from 'models';

import useDiff from './useDiff';

interface Params {
  selectedProducts: FormProduct[];
  features: FormFeature[];
  callbacks: CTACallback[];
  color: string;
  recommended: string | null;
  usesUnitLabel: boolean;
  unitLabel: string | null;
  subscribeLabel: string;
  freeTrialLabel: string;
  currency: string | null;
}

export default function useTrackAndSave(params: Params) {
  const {
    selectedProducts,
    features,
    callbacks,
    color,
    recommended,
    usesUnitLabel,
    unitLabel,
    subscribeLabel,
    freeTrialLabel,
    currency,
  } = params;

  const { isDiff: productsChanged, diff } = useDiff(selectedProducts)
}
