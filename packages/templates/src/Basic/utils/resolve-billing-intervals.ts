import type Stripe from 'stripe';
import type { FormProduct } from 'models';

import { intervalsMap } from '../../constants/intervals';

export const resolveBillingIntervals = (products: FormProduct[]) => {
  return products
    .reduce((list, prod) => {
      if (prod.isCustom) return list;

      const intervals = prod.prices
        .filter(price => price.isSelected)
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
    .sort((a, b) => {
      const first = a.split('_')[0] as Stripe.Price.Recurring.Interval;
      const second = b.split('_')[0] as Stripe.Price.Recurring.Interval;
      let sortedValues = intervalsMap[first].index - intervalsMap[second].index;
      if (sortedValues === 0) {
        const firstCount = a.includes('_') ? a.split('_')[1]! : '1';
        const secondCount = b.includes('_') ? b.split('_')[1]! : '1';
        sortedValues = parseInt(firstCount) - parseInt(secondCount);
      }

      return sortedValues;
    })
    .map((interval) => {
      let intervalLabel = '';
      if (!intervalsMap[interval]) {
        const intervalArray = interval.split('_');
        const intervalFormat = intervalArray[0] as Stripe.Price.Recurring.Interval;
        if (intervalFormat === 'day' || intervalFormat === 'week' || intervalFormat === 'month') {
          intervalLabel = `${intervalArray[1]} ${intervalsMap[intervalFormat].plurals}`;
        }
      }
      else {
        intervalLabel = intervalsMap[interval].label;
      }

      return ({ value: interval, label: intervalLabel });
    })
}
