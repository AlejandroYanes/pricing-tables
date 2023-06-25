import { createId } from '@paralleldrive/cuid2';
import type { FormProduct } from '@dealo/models';
import { apply } from '@dealo/helpers';

import { useWidgetFormStore } from '../widget-state';

export function addProduct(productList: FormProduct[], selectedId: string) {
  const [productId, priceId] = selectedId.split('-');
  const selectedProduct = productList!.find((prod) => prod.id === productId);
  const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

  if (!selectedProduct || !selectedPrice) return;

  const { products: prevProducts, features } = useWidgetFormStore.getState();
  const lastOrder = prevProducts[prevProducts.length - 1]?.order ?? 0;

  const copy: FormProduct = {
    ...selectedProduct,
    mask: createId(),
    order: lastOrder + 1,
    prices: [
      {
        ...selectedPrice,
        mask: createId(),
        hasFreeTrial: false,
        freeTrialDays: 0,
        order: 1,
      },
    ],
  };

  useWidgetFormStore.setState({
    products: prevProducts.concat(copy),
    features: apply(features, (feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id: copy.id, value }) };
    })
  });
}
