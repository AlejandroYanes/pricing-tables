import { createId } from '@paralleldrive/cuid2';
import type { FormProduct , FormPrice } from 'models';
import { apply } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function addProduct(productList: FormProduct[], productId: string, priceId: string) {
  const selectedProduct = productList!.find((prod) => prod.id === productId);
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  const { products: prevProducts, features } = useWidgetFormStore.getState();
  const lastOrder = prevProducts[prevProducts.length - 1]?.order ?? 0;
  const updatedPrices: FormPrice[] = selectedProduct.prices.map((price) => {
    if (price.id === selectedPrice.id) {
      return {
        ...price,
        isSelected: true,
        order: 0,
        mask: createId(),
        hasFreeTrial: false,
        freeTrialDays: 0,
      }
    }
    return {
      ...price,
      mask: createId(),
      order: Number.MAX_VALUE,
      isSelected: false,
      hasFreeTrial: false,
      freeTrialDays: 0,
    };
  });

  const copy: FormProduct = {
    ...selectedProduct,
    mask: createId(),
    order: lastOrder + 1,
    prices: updatedPrices,
  };

  useWidgetFormStore.setState({
    products: prevProducts.concat(copy),
    features: apply(features, (feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id: copy.id, value }) };
    })
  });
}
