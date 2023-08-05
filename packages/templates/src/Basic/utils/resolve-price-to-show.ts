import type { FormProduct } from '@dealo/models';

import type { Interval } from '../../constants/types';

export const resolvePriceToShow = (prod: FormProduct, interval: Interval) => {
  if (!interval) return prod.prices.filter((price) => price.isSelected)[0]!;

  if (interval === 'one_time') return prod.prices.find((price) => price.isSelected && price.type === 'one_time')!;

  return prod.prices.find((price) => {
    if (interval.includes('_')) {
      const intervalArray = interval.split('_');
      return price.isSelected && price.recurring?.interval_count.toString() === intervalArray[1];
    }

    return price.isSelected && price.recurring?.interval === interval;
  })!;
}
