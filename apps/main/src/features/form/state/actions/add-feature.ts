import type { FormFeature } from 'models';

import { useWidgetFormStore } from '../widget-state';

export function addNewFeature() {
  const { products } = useWidgetFormStore.getState();
  const nextFeature: FormFeature = {
    id: `${Date.now()}`,
    name: 'test',
    type: 'boolean',
    products: products.map((prod) => ({ id: prod.id, value: 'false' })),
  };
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    features: prev.features.concat(nextFeature),
  }));
}
