import { useWidgetFormStore } from '../widget-state';

export function toggleFreeTrial(productId: string, priceId: string) {
  const { products } = useWidgetFormStore.getState();
  const productIndex = products!.findIndex((prod) => prod.id === productId);
  const selectedProduct = products[productIndex];
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  selectedPrice.hasFreeTrial = !selectedPrice.hasFreeTrial;

  if (!selectedPrice.freeTrialDays) selectedPrice.freeTrialDays = 7;

  useWidgetFormStore.setState({ products: [...products] });
}
