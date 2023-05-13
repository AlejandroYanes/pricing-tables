import { useWidgetFormStore } from '../widget-state';

export const changeFreeTrialDays = (productId: string, priceId: string, days: number) => {
  const { products } = useWidgetFormStore.getState();
  const productIndex = products!.findIndex((prod) => prod.id === productId);
  const selectedProduct = products[productIndex];
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  selectedPrice.freeTrialDays = days ?? 1;
  useWidgetFormStore.setState({ products });
};
