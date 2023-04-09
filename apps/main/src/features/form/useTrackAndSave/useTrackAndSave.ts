import { useEffect } from 'react';
import type { CTACallback, FormFeature, FormProduct } from 'models';

import useDiff from './useDiff';
import { trpc } from 'utils/trpc';

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
    // features,
    // callbacks,
    // color,
    // recommended,
    // usesUnitLabel,
    // unitLabel,
    // subscribeLabel,
    // freeTrialLabel,
    // currency,
  } = params;

  const { mutate: updateProducts } = trpc.widgets.updateProducts.useMutation();
  const { isDiff: productsChanged, diff: productsDiff } = useDiff(
    selectedProducts,
    'id',
    ['name', 'description', 'prices', 'hasFreeTrial', 'freeTrialDays', 'ctaLabel', 'ctaUrl'],
  );

  useEffect(() => {
    if (productsChanged) {
      updateProducts(productsDiff as any);
    }
  }, [productsChanged]);

  // const { mutate: updateFeatures } = api.widgets.updateFeatures.useMutation();
  // const { isDiff: featuresChanged, diff: featuresDiff } = useDiff(features, 'id');
  //
  // useEffect(() => {
  //   if (featuresChanged) {
  //     console.log(featuresDiff);
  //     updateFeatures(featuresDiff as any);
  //   }
  // }, [featuresChanged]);
  //
  // const { mutate: updateCallbacks } = api.widgets.updateCallbacks.useMutation();
  // const { isDiff: callbacksChanged, diff: callbacksDiff } = useDiff(callbacks, 'env');
  //
  // useEffect(() => {
  //   if (callbacksChanged) {
  //     console.log(callbacksDiff);
  //     updateCallbacks(callbacksDiff as any);
  //   }
  // }, [callbacksChanged]);
  //
  // const { mutate: mutateGValues } = api.widgets.updateGeneralValues.useMutation();
  // const { isDiff: gValuesChanged, diff: gValuesDiff } = useDiff({
  //   color,
  //   recommended,
  //   usesUnitLabel,
  //   unitLabel,
  //   subscribeLabel,
  //   freeTrialLabel,
  //   currency,
  // });
  //
  // useEffect(() => {
  //   if (gValuesChanged) {
  //     console.log(gValuesDiff);
  //     mutateGValues(gValuesDiff as any);
  //   }
  // }, [gValuesChanged]);
}
