import { useWidgetFormStore } from '../widget-state';

export function changeCustomCtaName(index: number, nextName: string) {
  const { products } = useWidgetFormStore.getState();
  const selectedProduct = products[index];

  if (!selectedProduct) return;

  selectedProduct.name = nextName;
  useWidgetFormStore.setState({ products });
}
