import { useWidgetFormStore } from '../widget-state';

export function changeCustomCTADescription(index: number, nextDescription: string) {
  const { selectedProducts } = useWidgetFormStore.getState();
  const selectedProduct = selectedProducts[index];

  if (!selectedProduct) return;

  selectedProduct.description = nextDescription;
  selectedProducts[index] = selectedProduct;
  useWidgetFormStore.setState({ selectedProducts: [...selectedProducts] });
}
