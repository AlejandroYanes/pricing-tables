import { useWidgetFormStore } from '../widget-state';

export function changeFeatureValue(featureIndex: number, productId: string, value: string) {
  const { features } = useWidgetFormStore.getState();
  const feature = features[featureIndex];

  if (!feature) return;

  const product = feature.products.find((prod) => prod.id === productId);

  if (product) {
    product.value = value;
  } else {
    feature.products.push({ id: productId, value });
  }

  features[featureIndex] = { ...feature, products: [...feature.products] };
  useWidgetFormStore.setState((prev) => ({ ...prev, features }));
}
