import type { FormFeature } from 'models';

import { useWidgetFormStore } from '../widget-state';

export function addNewFeature() {
  const { products, features: prevFeatures } = useWidgetFormStore.getState();
  const lastOrder = prevFeatures[prevFeatures.length - 1]?.order ?? 0;
  const nextFeature: FormFeature = {
    id: `${Date.now()}`,
    name: 'test',
    type: 'boolean',
    order: lastOrder + 1,
    products: products.map((prod) => ({ id: prod.id, value: 'false' })),
  };
  useWidgetFormStore.setState({ features: prevFeatures.concat(nextFeature) });
}
