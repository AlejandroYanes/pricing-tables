/* eslint-disable max-len */
import { Button, createStyles, Group, SegmentedControl, Stack, Text } from '@mantine/core';
import type Stripe from 'stripe';
import { useEffect, useMemo, useState } from 'react';

import type { FormProduct , FormPrice } from 'models/stripe';
import { formatCurrency } from 'utils/numbers';
import RenderIf from 'components/RenderIf';

interface Props {
  recommended: string | undefined;
  color: string;
  products: FormProduct[];
}

type Interval = undefined | 'one_time' | Stripe.Price.Recurring.Interval;

const useStyles = createStyles((theme, color: string) => ({
  productCard: {
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[4]}`,
    padding: '48px 32px 24px',
    borderRadius: '4px',
    width: '300px',
  },
  activeProductCard: {
    border: `1px solid ${theme.colors![color]![5]}`,
    width: '320px',
  },
  wideCard: {
    width: 'auto',
  },
}));

const resolvePricing = (price: FormPrice): string => {
  const { type, tiers_mode, currency, billing_scheme, transform_quantity, recurring, unit_amount, tiers, isPerUnit, unitLabel } = price;

  if (type === 'one_time') {
    return `${formatCurrency(unit_amount! / 100, currency)}${isPerUnit ? ` per ${unitLabel}` : ''}`;
  }

  if (billing_scheme === 'per_unit') {
    const recurringLabel = recurring?.interval === 'month' ? 'mo' : 'yr';
    if (transform_quantity) {
      return `${formatCurrency(unit_amount! / 100, currency)} per every ${transform_quantity.divide_by} ${isPerUnit ? unitLabel : 'units'}/${recurringLabel}`;
    }

    return `${formatCurrency(unit_amount! / 100, currency)} ${isPerUnit ? ` per ${unitLabel}` : ''}/${recurringLabel}`;
  }

  switch (tiers_mode) {
    case 'volume': {
      const tier = tiers![0]!;
      return `Starts at ${formatCurrency(tier.unit_amount! / 100, currency)} for the first ${tier.up_to} ${isPerUnit ? unitLabel : 'units'}`;
    }
    case 'graduated': {
      const tier = tiers![0]!;
      return `Starts at ${formatCurrency(tier.unit_amount! / 100, currency)} ${isPerUnit ? ` per ${unitLabel}` : ''} a month`;
    }
    default:
      return 'No price';
  }
};

const resolveBillingIntervals = (products: FormProduct[]) => {
  return products
    .reduce((list, prod) => {
      const intervals = prod.prices
        .map((price) => {
          if (price.type === 'one_time') {
            return 'one_time';
          }
          return  price.recurring?.interval;
        })
        .filter((int) => !!int) as Stripe.Price.Recurring.Interval[];

      return Array.from(new Set([...list, ...intervals]));
    }, [] as Stripe.Price.Recurring.Interval[])
    .sort((a, b) => intervalsMap[a].index - intervalsMap[b].index)
    .map((interval) => ({ value: interval, label: intervalsMap[interval].label }))
}

const filterProductsByInterval = (products: FormProduct[], interval: Interval) => {
  if (!interval) return products;

  return products.filter((prod) => {
    if (interval === 'one_time') {
      return prod.prices.some((price) => price.type === 'one_time');
    }

    return prod.prices.some((price) => price.recurring?.interval === interval);
  });
};

const resolvePriceToShow = (prod: FormProduct, interval: Interval) => {
  // console.log(prod, interval);
  if (!interval) return prod.prices[0]!;

  if (interval === 'one_time') return prod.prices.find((price) => price.type === 'one_time')!;

  return prod.prices.find((price) => price.recurring?.interval === interval)!;
}

const intervalsMap = {
  day: { label: 'Daily', index: 0 },
  week: { label: 'Weekly', index: 1 },
  month: { label: 'Monthly', index: 2 },
  year: { label: 'Yearly', index: 3 },
  one_time: { label: 'One Time', index: 4 },
};

export default function BasicTemplate(props: Props) {
  const { products, recommended, color } = props;
  const { classes, cx } = useStyles(color);

  const [currentInterval, setCurrentInterval] = useState<Interval>(undefined);

  const visibleProducts = useMemo(() => filterProductsByInterval(products, currentInterval), [currentInterval, products]);
  const billingIntervals = useMemo(() => resolveBillingIntervals(products), [products]);

  useEffect(() => {
    if (billingIntervals.length === 0) {
      setCurrentInterval(undefined);
    } else {
      const currentIntervalExists = billingIntervals.find((interval) => interval.value === currentInterval);

      if (!currentIntervalExists) {
        setCurrentInterval(billingIntervals[0]!.value);
      }
    }
  }, [billingIntervals]);

  console.log('currentInterval', currentInterval);

  return (
    <Stack>
      <RenderIf condition={billingIntervals.length > 1}>
        <SegmentedControl data={billingIntervals} value={currentInterval} onChange={setCurrentInterval as any} mx="auto" mb="xl" />
      </RenderIf>
      <Group align="stretch" position="center" spacing="xl">
        {visibleProducts.map((prod) => {
          const priceToShow = resolvePriceToShow(prod, currentInterval);
          const { hasFreeTrial, freeTrialDays, isPerUnit } = priceToShow;

          const isRecommended = visibleProducts.length === 1 || prod.id === recommended;

          return (
            <Stack
              key={prod.id}
              align="center"
              className={cx(classes.productCard, { [classes.wideCard]: isPerUnit, [classes.activeProductCard]: isRecommended })}
            >
              <Text weight="bold" color={isRecommended ? color : undefined}>{prod.name}</Text>
              <Text
                style={{ fontSize: '32px', fontWeight: 'bold' }}
                color={isRecommended ? color : undefined}
              >
                {resolvePricing(priceToShow)}
              </Text>
              <Text align="center">{prod.description}</Text>
              <Stack mt="auto" align="center">
                <RenderIf condition={!!hasFreeTrial}>
                  <Text color="dimmed">With a {freeTrialDays} {freeTrialDays! > 1 ? 'days' : 'day'} free trial</Text>
                </RenderIf>
                <Button color={color} variant="filled">
                  {hasFreeTrial ? 'Start free trial' : 'Subscribe'}
                </Button>
              </Stack>
            </Stack>
          )
        })}
      </Group>
    </Stack>
  );
}
