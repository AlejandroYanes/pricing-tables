import { Feature } from '@prisma/client';
import type { CTACallback, FormFeature, FormProduct } from 'models';

import useDiff from './useDiff';
import { trpc } from 'utils/trpc';

interface Params {
  widgetId: string;
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
    widgetId,
    selectedProducts,
    features,
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
  useDiff({
    value: selectedProducts,
    idField: 'id',
    keysToTrack: ['name', 'description', 'prices', 'hasFreeTrial', 'freeTrialDays', 'ctaLabel', 'ctaUrl'],
    onChange: (diff) => updateProducts({ widgetId, products: diff as any }),
  });

  const { mutate: updateFeatures } = trpc.widgets.updateFeatures.useMutation();
  useDiff({
    value: features,
    idField: 'id',
    onChange: (diff) => {
      let featureUpdates;

      if ((diff as any)[0].products) {
        type FeatureUpdate = Partial<Pick<Feature, 'id' | 'name' | 'type' | 'productId'>>;
        featureUpdates = diff.reduce((list: FeatureUpdate[], feat: Partial<FormFeature>) => {
          const extended = (feat as any).products.map((prod: any) => ({
            id: feat.id, name:
            feat.name,
            type: feat.type,
            productId: prod.id,
            value: prod.value,
          }));
          list.push(...extended);
          return list;
        }, []);
      } else {
        type FeatureUpdate = Partial<Pick<Feature, 'id' | 'name' | 'type' | 'productId'>>;
        featureUpdates = diff.reduce((list: FeatureUpdate[], feat: Partial<FormFeature>) => {
          const extended = selectedProducts.map((prod) => ({ id: feat.id, name: feat.name, type: feat.type, productId: prod.id }));
          list.push(...extended);
          return list;
        }, []);
      }

      updateFeatures({ widgetId, features: featureUpdates as any });
    },
  });
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
