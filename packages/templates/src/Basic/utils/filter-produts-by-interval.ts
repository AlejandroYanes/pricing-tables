import type { FormProduct } from 'models';

import type { Interval } from '../../constants/types';

export const filterProductsByInterval = (products: FormProduct[], interval: Interval) => {
  if (!interval) return products;

  return products.filter((prod) => {
    if (prod.isCustom) return prod;

    if (interval === 'one_time') {
      return prod.prices.filter(price => price.isSelected ).some((price) => price.type === 'one_time');
    }

    if (interval.includes('_')) {
      const intervalArray = interval.split('_');
      return prod.prices.filter(price => price.isSelected ).some((price) => price.recurring?.interval === intervalArray[0] && price.recurring?.interval_count.toString() === intervalArray[1]);
    }
    
    return prod.prices.filter(price => price.isSelected ).some((price) => price.recurring?.interval === interval && price.recurring?.interval_count === 1);
  });
};
