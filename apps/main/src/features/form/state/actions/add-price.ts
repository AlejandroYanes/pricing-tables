import { createId } from '@paralleldrive/cuid2';
import type { FormPrice } from '@dealo/models';
import { applyWhere } from '@dealo/helpers';

import { useWidgetFormStore } from '../widget-state';

export function handleAddPrice(productId: string, price: FormPrice) {
  const { products } = useWidgetFormStore.getState();
  const productIndex = products!.findIndex((prod) => prod.id === productId);
  const selectedProduct = products[productIndex];

  if (!selectedProduct) return;

  const lastOrder = selectedProduct.prices.filter(p => p.isSelected).at(-1)?.order ?? 0;
  const updatedPrices: FormPrice[] = selectedProduct.prices.map(p => {
    if (p.id === price.id) {
      return {
        ...p,
        isSelected: true,
        order: lastOrder + 1,
        mask: createId(),
      }
    }
    return  p;
  });

  updatedPrices.sort((a, b) => a.order - b.order);

  const copy = {
    ...selectedProduct,
    prices: updatedPrices,
  };
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    products: applyWhere(prev.products, (_, index) => index === productIndex, () => copy),
  }));
}
