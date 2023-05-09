import { showNotification } from '@mantine/notifications';
import { createId } from '@paralleldrive/cuid2';
import type { FormProduct } from 'models';
import { apply } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function addCustomProduct() {
  const { selectedProducts } = useWidgetFormStore.getState();
  const hasCustomProductLimit = selectedProducts.filter((prod) => prod.isCustom).length === 2;

  if (hasCustomProductLimit) {
    showNotification({
      color: 'orange',
      message: 'You can only have 2 custom products',
    });
    return;
  }

  const id = `custom_${Date.now()}`;
  const customProduct: Partial<FormProduct> = {
    id,
    mask: createId(),
    isCustom: true,
    active: true,
    name: 'Custom Product',
    description: 'Custom products can be used to present an extra option, whether a free tier or for users to contact your sales team',
    ctaLabel: 'Label',
    ctaUrl: '',
    prices: []
  };

  useWidgetFormStore.setState((prev) => ({
    ...prev,
    selectedProducts: prev.selectedProducts.concat(customProduct as FormProduct),
    features: apply(prev.features, (feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id, value }) };
    }),
  }));
}
