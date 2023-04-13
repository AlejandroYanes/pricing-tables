import type { FormProduct } from 'models';

import type { Interval } from '../../constants/types';

export const filterProductsByInterval = (products: FormProduct[], interval: Interval) => {
  if (!interval) return products;

  return products.filter((prod) => {
    if (prod.isCustom) return prod;

    if (interval === 'one_time') {
      return prod.prices.some((price) => price.type === 'one_time');
    }

    if (interval === 'month_3') {
      return prod.prices.some((price) => price.recurring?.interval === 'month' && price.recurring?.interval_count === 3);
    }
    if (interval === 'month_6') {
      return prod.prices.some((price) => price.recurring?.interval === 'month' && price.recurring?.interval_count === 6);
    }

    return prod.prices.some((price) => price.recurring?.interval === interval && price.recurring?.interval_count === 1);
  });
};
