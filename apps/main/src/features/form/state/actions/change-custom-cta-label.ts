import { useWidgetFormStore } from '../widget-state';

export function changeCustomCtaLabel(index: number, nextLabel: string) {
  const { products } = useWidgetFormStore.getState();
  const selectedProduct = products[index];

  if (!selectedProduct) return;

  selectedProduct.ctaLabel = nextLabel;
  useWidgetFormStore.setState({ products });
}
