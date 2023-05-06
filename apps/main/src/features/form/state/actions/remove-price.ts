import { useWidgetFormStore } from '../widget-state';

export function removePrice(productId: string, priceId: string) {
  const { selectedProducts } = useWidgetFormStore.getState();
  const productIndex = selectedProducts!.findIndex((prod) => prod.id === productId);
  const selectedProduct = selectedProducts[productIndex];
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  selectedProducts[productIndex] = { ...selectedProduct!, prices: selectedProduct.prices.filter((price) => price.id !== priceId) };
  useWidgetFormStore.setState((prev) => ({ ...prev, selectedProducts }));
}
