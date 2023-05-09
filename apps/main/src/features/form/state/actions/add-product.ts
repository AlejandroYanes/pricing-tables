import { apply } from 'helpers';
import type { FormProduct } from 'models';
import { createId } from '@paralleldrive/cuid2';

import { useWidgetFormStore } from '../widget-state';
import dayjs from 'dayjs';

export function addProduct(products: FormProduct[], selectedId: string) {
  const [productId, priceId] = selectedId.split('-');
  const selectedProduct = products!.find((prod) => prod.id === productId);
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  const copy = {
    ...selectedProduct,
    mask: createId(),
    createdAt: dayjs().toJSON(),
    prices: [
      { ...selectedPrice, mask: createId(), hasFreeTrial: false, freeTrialDays: 0 },
    ],
    features: [],
  };

  useWidgetFormStore.setState((prev) => ({
    ...prev,
    products: prev.products.concat(copy),
    features: apply(prev.features, (feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id: copy.id, value }) };
    })
  }));
}
