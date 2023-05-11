import { apply, remove } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function removeProduct(index: number) {
  const { products, recommended, features } = useWidgetFormStore.getState();
  const product = products[index];

  if (!product) return;

  useWidgetFormStore.setState({
    products: remove(products, index),
    recommended: products.length === 1 ? null : recommended,
    features: apply(features, (feature) => {
      return { ...feature, products: feature.products.filter((prod) => prod.id !== product.id) };
    })
  });
}
