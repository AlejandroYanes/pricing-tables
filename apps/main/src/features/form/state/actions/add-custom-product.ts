import { showNotification } from '@mantine/notifications';
import { createId } from '@paralleldrive/cuid2';
import dayjs from 'dayjs';
import type { FormProduct } from 'models';
import { apply } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function addCustomProduct() {
  const { products } = useWidgetFormStore.getState();
  const hasCustomProductLimit = products.filter((prod) => prod.isCustom).length === 2;

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
    createdAt: dayjs().format(),
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
    products: prev.products.concat(customProduct as FormProduct),
    features: apply(prev.features, (feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id, value }) };
    }),
  }));
}
