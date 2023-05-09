import { useWidgetFormStore } from '../widget-state';

export function changeCustomCTADescription(index: number, nextDescription: string) {
  const { products } = useWidgetFormStore.getState();
  const selectedProduct = products[index];

  if (!selectedProduct) return;

  selectedProduct.description = nextDescription;
  products[index] = selectedProduct;
  useWidgetFormStore.setState({ products: [...products] });
}
