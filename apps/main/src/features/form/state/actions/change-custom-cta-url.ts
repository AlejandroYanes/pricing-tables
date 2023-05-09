import { useWidgetFormStore } from '../widget-state';

export function changeCustomCTAUrl(index: number, nextUrl: string) {
  const { products } = useWidgetFormStore.getState();
  const selectedProduct = products[index];

  if (!selectedProduct) return;

  selectedProduct.ctaUrl = nextUrl;
  useWidgetFormStore.setState({ products });
}
