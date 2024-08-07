import { createId } from '@paralleldrive/cuid2';
import type { FormProduct } from '@dealo/models';
import { apply } from '@dealo/helpers';

import { useWidgetFormStore } from '../widget-state';

export function addCustomProduct() {
  const { products, features } = useWidgetFormStore.getState();
  const hasCustomProductLimit = products.filter((prod) => prod.isCustom).length === 2;

  if (hasCustomProductLimit) {
    return false;
  }

  const id = `custom_${createId()}`;
  const lastOrder = products[products.length - 1]?.order ?? 0;
  const customProduct: Partial<FormProduct> = {
    id,
    mask: createId(),
    order: lastOrder + 1,
    isCustom: true,
    active: true,
    name: 'Custom Product',
    description: 'Custom products can be used to present an extra option, whether a free tier or for users to contact your sales team',
    ctaLabel: 'Label',
    ctaUrl: '',
    prices: []
  };

  useWidgetFormStore.setState({
    products: products.concat(customProduct as FormProduct),
    features: apply(features, (feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id, value }) };
    })
  });
  return true;
}
