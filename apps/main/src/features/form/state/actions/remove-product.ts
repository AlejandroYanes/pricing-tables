import { remove } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function removeProduct(index: number) {
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    selectedProducts: remove(prev.selectedProducts, index),
    recommended: prev.selectedProducts.length === 1 ? null : prev.recommended,
  }));
}
