import { apply } from 'helpers';
import type { FormProduct } from 'models';

import { useWidgetFormStore } from '../widget-state';

export function addProduct(products: FormProduct[], selectedId: string) {
  const [productId, priceId] = selectedId.split('-');
  const selectedProduct = products!.find((prod) => prod.id === productId);
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  const copy = { ...selectedProduct, prices: [{ ...selectedPrice, hasFreeTrial: false, freeTrialDays: 0 }], features: [] };

  useWidgetFormStore.setState((prev) => ({
    ...prev,
    selectedProducts: prev.selectedProducts.concat(copy),
    features: apply(prev.features, (feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id: copy.id, value }) };
    })
  }));
}
