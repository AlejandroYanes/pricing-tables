import { useWidgetFormStore } from '../widget-state';

export function toggleFreeTrial(productId: string, priceId: string) {
  const { selectedProducts } = useWidgetFormStore.getState();
  const productIndex = selectedProducts!.findIndex((prod) => prod.id === productId);
  const selectedProduct = selectedProducts[productIndex];
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  selectedPrice.hasFreeTrial = !selectedPrice.hasFreeTrial;

  if (!selectedPrice.freeTrialDays) selectedPrice.freeTrialDays = 7;

  selectedProducts[productIndex] = selectedProduct;
  useWidgetFormStore.setState((prev) => ({ ...prev, selectedProducts }));
}
