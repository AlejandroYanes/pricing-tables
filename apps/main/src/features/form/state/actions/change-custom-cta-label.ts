import { useWidgetFormStore } from '../widget-state';

export function changeCustomCtaLabel(index: number, nextLabel: string) {
  const { selectedProducts } = useWidgetFormStore.getState();
  const selectedProduct = selectedProducts[index];

  if (!selectedProduct) return;

  selectedProduct.ctaLabel = nextLabel;
  useWidgetFormStore.setState({ selectedProducts });
}
