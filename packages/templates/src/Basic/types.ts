import type Stripe from 'stripe';

export type Interval = undefined | 'one_time' | Stripe.Price.Recurring.Interval | `month_${number}`;
