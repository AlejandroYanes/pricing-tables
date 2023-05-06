import { useWidgetFormStore } from '../widget-state';

export function changeCustomCTAUrl(index: number, nextUrl: string) {
  const { selectedProducts } = useWidgetFormStore.getState();
  const selectedProduct = selectedProducts[index];

  if (!selectedProduct) return;

  selectedProduct.ctaUrl = nextUrl;
  selectedProducts[index] = selectedProduct;
  useWidgetFormStore.setState((prev) => ({ ...prev, selectedProducts }));
}
