import type { FormProduct } from 'models';

import type { Interval } from '../types';

export const resolvePriceToShow = (prod: FormProduct, interval: Interval) => {
  if (!interval) return prod.prices[0]!;

  if (interval === 'one_time') return prod.prices.find((price) => price.type === 'one_time')!;

  return prod.prices.find((price) => price.recurring?.interval === interval)!;
}
