import { useWidgetFormStore } from '../widget-state';

export function removePrice(productId: string, priceId: string) {
  const { products } = useWidgetFormStore.getState();
  const productIndex = products!.findIndex((prod) => prod.id === productId);
  const selectedProduct = products[productIndex];
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  products[productIndex] = { ...selectedProduct!, prices: selectedProduct.prices.filter((price) => price.id !== priceId) };
  useWidgetFormStore.setState({ products: [...products] });
}
