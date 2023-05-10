import { createId } from '@paralleldrive/cuid2';
import type { FormPrice } from 'models';
import { applyWhere } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function handleAddPrice(productId: string, price: FormPrice) {
  const { products } = useWidgetFormStore.getState();
  const productIndex = products!.findIndex((prod) => prod.id === productId);
  const selectedProduct = products[productIndex];

  if (!selectedProduct) return;

  const lastOrder = selectedProduct.prices[selectedProduct.prices.length - 1]?.order ?? 0;

  const copy = {
    ...selectedProduct,
    prices: selectedProduct.prices.concat([{
      ...price,
      order: lastOrder + 1,
      mask: createId(),
      hasFreeTrial: false,
      freeTrialDays: 0,
    }]),
  };
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    products: applyWhere(prev.products, (_, index) => index === productIndex, () => copy),
  }));
}
