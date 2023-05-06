import { useWidgetFormStore } from '../widget-state';

export const changeFreeTrialDays = (productId: string, priceId: string, days: number) => {
  const { selectedProducts } = useWidgetFormStore.getState();
  const productIndex = selectedProducts!.findIndex((prod) => prod.id === productId);
  const selectedProduct = selectedProducts[productIndex];
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  selectedPrice.freeTrialDays = days ?? 1;
  selectedProducts[productIndex] = selectedProduct;
  useWidgetFormStore.setState((prev) => ({ ...prev, selectedProducts }));
};
