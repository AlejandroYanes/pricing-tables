import { remove } from '@dealo/helpers';

import { useWidgetFormStore } from '../widget-state';

export function removeFeature(featureIndex: number) {
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    features: remove(prev.features, featureIndex),
  }));
}
