import type Stripe from 'stripe';
import type { FormProduct } from 'models';

import { intervalsMap } from '../../constants/intervals';

export const resolveBillingIntervals = (products: FormProduct[]) => {
  return products
    .reduce((list, prod) => {
      if (prod.isCustom) return list;

      const intervals = prod.prices
        .map((price) => {
          if (price.type === 'one_time') {
            return 'one_time';
          }

          if (price.recurring!.interval_count !== 1) {
            return `${price.recurring!.interval}_${price.recurring!.interval_count}`;
          }
          return price.recurring!.interval;
        })
        .filter((int) => !!int) as Stripe.Price.Recurring.Interval[];

      return Array.from(new Set([...list, ...intervals]));
    }, [] as Stripe.Price.Recurring.Interval[])
    .sort((a, b) => intervalsMap[a].index - intervalsMap[b].index)
    .map((interval) => ({ value: interval, label: intervalsMap[interval].label }))
}
