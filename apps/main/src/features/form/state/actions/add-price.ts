import type { FormPrice } from 'models';
import { createId } from '@paralleldrive/cuid2';
import { applyWhere } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function handleAddPrice(productId: string, price: FormPrice) {
  const { selectedProducts } = useWidgetFormStore.getState();
  const productIndex = selectedProducts!.findIndex((prod) => prod.id === productId);
  const selectedProduct = selectedProducts[productIndex];

  if (!selectedProduct) return;

  const copy = { ...selectedProduct, prices: selectedProduct.prices.concat([{ ...price, mask: createId() }]) };
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    selectedProducts: applyWhere(prev.selectedProducts, (_, index) => index === productIndex, () => copy),
  }));
}
