import type { FormProduct } from 'models';

import type { Interval } from '../types';

export const filterProductsByInterval = (products: FormProduct[], interval: Interval) => {
  if (!interval) return products;

  return products.filter((prod) => {
    if (prod.isCustom) return prod;

    if (interval === 'one_time') {
      return prod.prices.some((price) => price.type === 'one_time');
    }

    return prod.prices.some((price) => price.recurring?.interval === interval);
  });
};
