import { useWidgetFormStore } from '../widget-state';

export const changeFreeTrialEndAction = (productId: string, priceId: string, action: string) => {
  const { products } = useWidgetFormStore.getState();
  const productIndex = products!.findIndex((prod) => prod.id === productId);
  const selectedProduct = products[productIndex];
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  selectedPrice.freeTrialEndAction = action as 'pause' | 'cancel';
  useWidgetFormStore.setState({ products });
};
