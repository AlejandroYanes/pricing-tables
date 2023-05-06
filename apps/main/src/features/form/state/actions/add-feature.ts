import type { FormFeature } from 'models';

import { useWidgetFormStore } from '../widget-state';

export function addNewFeature() {
  const { selectedProducts } = useWidgetFormStore.getState();
  const nextFeature: FormFeature = {
    id: `${Date.now()}`,
    name: 'test',
    type: 'boolean',
    products: selectedProducts.map((prod) => ({ id: prod.id, value: 'false' })),
  };
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    features: prev.features.concat(nextFeature),
  }));
}
