import type { Feature } from '@prisma/client';
import type { FormCallback, FormFeature, FormProduct } from 'models';

import { trpc } from 'utils/trpc';
import useDiff from './useDiff';

interface Params {
  widgetId: string;
  selectedProducts: FormProduct[];
  features: FormFeature[];
  callbacks: FormCallback[];
  color: string;
  name: string;
  recommended: string | null;
  usesUnitLabel: boolean;
  unitLabel: string | null;
  subscribeLabel: string;
  freeTrialLabel: string;
}

export default function useTrackAndSave(params: Params) {
  const {
    widgetId,
    selectedProducts,
    features,
    callbacks,
    color,
    name,
    recommended,
    usesUnitLabel,
    unitLabel,
    subscribeLabel,
    freeTrialLabel,
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

  const { mutate: updateCallbacks } = trpc.widgets.updateCallbacks.useMutation();
  useDiff({
    value: callbacks,
    idField: 'id',
    keysToTrack: ['env', 'url'],
    onChange: (diff) => {
      const updates = diff
        .filter((cb: FormCallback) => callbacks.some((c) => c.id === cb.id && !c.error ))
        .map((cb: FormCallback) => ({ id: cb.id, env: cb.env, url: cb.url }));
      if (updates.length) {
        updateCallbacks(updates as any);
      }
    },
  });

  const { mutate: mutateGValues } = trpc.widgets.updateGeneralValues.useMutation();
  useDiff({
    value: { name, color, recommended, usesUnitLabel, unitLabel, subscribeLabel, freeTrialLabel },
    onChange: (diff) => mutateGValues({ widgetId, ...diff }),
  });
}
