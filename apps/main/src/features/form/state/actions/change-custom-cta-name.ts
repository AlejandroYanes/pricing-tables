import { useWidgetFormStore } from '../widget-state';

export function changeCustomCtaName(index: number, nextName: string) {
  const { selectedProducts } = useWidgetFormStore.getState();
  const selectedProduct = selectedProducts[index];

  if (!selectedProduct) return;

  selectedProduct.name = nextName;
  selectedProducts[index] = selectedProduct;
  useWidgetFormStore.setState((prev) => ({ ...prev, selectedProducts }));
}
