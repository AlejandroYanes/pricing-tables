import type { FormPrice } from 'models';
import { formatCurrency } from 'helpers';

import { intervalsMap } from '../../constants/intervals';

export const resolvePricing = (options: { price: FormPrice; unitLabel: string | null; currency?: string | null }): string => {
  const { price, unitLabel, currency: selectedCurrency } = options;
  const {
    type,
    currency: baseCurrency,
    currency_options,
    billing_scheme,
    transform_quantity,
    recurring,
    unit_amount: baseAmount,
  } = price;

  const { currency, unit_amount } = selectedCurrency && currency_options![selectedCurrency]
    ? {
      currency: selectedCurrency,
      unit_amount: currency_options![selectedCurrency]!.unit_amount,
    } : {
      currency: baseCurrency,
      unit_amount: baseAmount,
    };

  if (type === 'one_time') {
    return `${formatCurrency(unit_amount! / 100, currency)}${!!unitLabel ? ` per ${unitLabel}` : ''}`;
  }

  const recurringLabel = intervalsMap[recurring!.interval].short;
  const intervalCount = recurring!.interval_count;

  if (billing_scheme === 'per_unit') {
    if (transform_quantity) {
      const sections = [
        formatCurrency(unit_amount! / 100, currency),
        ' per every ',
        transform_quantity.divide_by,
        ` ${!!unitLabel ? unitLabel : 'units'} /`,
        intervalCount == 1 ? '' : `${intervalCount}`,
        ' ',
        recurringLabel
      ];
      return sections.join('');
    }

    const sections = [
      formatCurrency(unit_amount! / 100, currency),
      ` ${!!unitLabel ? ` per ${unitLabel}` : ''}`,
      `/`,
      intervalCount == 1 ? '' : `${intervalCount} `,
      recurringLabel,
    ];

    return sections.join('');
  }

  return 'Unable to resolve pricing';

  // disabled for now (https://github.com/AlejandroYanes/pricing-tables/issues/22)
  // switch (tiers_mode) {
  //   case 'volume': {
  //     const tier = tiers![0]!;
  // eslint-disable-next-line max-len
  //     return `Starts at ${formatCurrency(tier.unit_amount! / 100, currency)} for the first ${tier.up_to} ${!!unitLabel ? unitLabel : 'units'}`;
  //   }
  //   case 'graduated': {
  //     const tier = tiers![0]!;
  //     return `Starts at ${formatCurrency(tier.unit_amount! / 100, currency)} ${!!unitLabel ? ` per ${unitLabel}` : ''} a month`;
  //   }
  //   default:
  //     return 'No price';
  // }
};
