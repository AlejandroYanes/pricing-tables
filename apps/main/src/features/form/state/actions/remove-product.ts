import { remove } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function removeProduct(index: number) {
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    products: remove(prev.products, index),
    recommended: prev.products.length === 1 ? null : prev.recommended,
  }));
}
