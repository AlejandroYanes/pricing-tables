import type { FormProduct } from 'models';

import type { Interval } from '../types';

export const resolvePriceToShow = (prod: FormProduct, interval: Interval) => {
  if (!interval) return prod.prices[0]!;

  if (interval === 'one_time') return prod.prices.find((price) => price.type === 'one_time')!;

  return prod.prices.find((price) => {
    if (interval === 'month_3') return price.recurring?.interval_count === 3;
    if (interval === 'month_6') return price.recurring?.interval_count === 6;

    return price.recurring?.interval === interval;
  })!;
}
