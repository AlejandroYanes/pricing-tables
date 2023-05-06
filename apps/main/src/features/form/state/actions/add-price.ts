import type { FormPrice } from 'models';

import { useWidgetFormStore } from '../widget-state';

export function handleAddPrice(productId: string, price: FormPrice) {
  const { selectedProducts } = useWidgetFormStore.getState();
  const productIndex = selectedProducts!.findIndex((prod) => prod.id === productId);
  const selectedProduct = selectedProducts[productIndex];

  if (!selectedProduct) return;

  selectedProducts[productIndex] = { ...selectedProduct!, prices: selectedProduct.prices.concat([{ ...price }]) };
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    selectedProducts,
  }));
}
