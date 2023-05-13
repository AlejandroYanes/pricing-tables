import type { FeatureType } from 'models';

import { useWidgetFormStore } from '../widget-state';

const initialValue: Record<FeatureType, string> = { string: '', compose: '', boolean: 'false' };

export function changeFeatureType(featureIndex: number, nextType: FeatureType) {
  const { features } = useWidgetFormStore.getState();
  const feature = features[featureIndex];

  if (!feature) return;

  feature.type = nextType;
  feature.products = feature.products.map((prod) => ({ ...prod, value: initialValue[nextType] }))
  useWidgetFormStore.setState({ features });
}
