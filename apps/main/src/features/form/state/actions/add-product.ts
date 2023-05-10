import dayjs from 'dayjs';
import { createId } from '@paralleldrive/cuid2';
import type { FormProduct } from 'models';
import { apply } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function addProduct(products: FormProduct[], selectedId: string) {
  const [productId, priceId] = selectedId.split('-');
  const selectedProduct = products!.find((prod) => prod.id === productId);
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  const copy = {
    ...selectedProduct,
    mask: createId(),
    createdAt: dayjs().format(),
    prices: [
      {
        ...selectedPrice,
        mask: createId(),
        hasFreeTrial: false,
        freeTrialDays: 0,
        createdAt: dayjs().format(),
      },
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
