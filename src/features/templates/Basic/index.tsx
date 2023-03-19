/* eslint-disable max-len */
import { Button, createStyles, Group, SegmentedControl, Stack, Text } from '@mantine/core';
import type Stripe from 'stripe';
import { useState } from 'react';

import type { FormProduct } from 'models/stripe';
import { formatCurrency } from 'utils/numbers';
import RenderIf from 'components/RenderIf';

interface Props {
  recommended: number;
  products: FormProduct[];
}

const useStyles = createStyles((theme, ) => ({
  productBlock: {
    position: 'relative',
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[4]}`,
    borderRadius: '4px',
    marginBottom: '16px',
  },
  deleteBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px'
  },
  addPriceButton: {
    padding: '8px 0px',
    fontWeight: 600,
    fontSize: '14px',
    ['&:hover']: {
      cursor: 'pointer',
      color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[7],
    },
  },
  productCard: {
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[4]}`,
    padding: '48px 32px 24px',
    borderRadius: '4px',
    width: '280px',
  },
  activeProductCard: {
    border: `1px solid ${theme.colors.blue[5]}`,
  },
}));

const resolvePricing = (price: Stripe.Price): string => {
  if (price.type === 'one_time') {
    return formatCurrency(price.unit_amount! / 100, price.currency);
  }

  if (price.billing_scheme === 'per_unit') {
    const recurringLabel = price.recurring?.interval === 'month' ? 'mo' : 'yr';
    if (price.transform_quantity) {
      return `${formatCurrency(price.unit_amount! / 100, price.currency)} per every ${price.transform_quantity.divide_by} units /${recurringLabel}`;
    }

    return `${formatCurrency(price.unit_amount! / 100, price.currency)} /${recurringLabel}`;
  }

  switch (price.tiers_mode) {
    case 'volume': {
      const tier = price.tiers![0]!;
      return `Starts at ${formatCurrency(tier.unit_amount! / 100, price.currency)} for the first ${tier.up_to} users`;
    }
    case 'graduated': {
      const tier = price.tiers![0]!;
      return `Starts at ${formatCurrency(tier.unit_amount! / 100, price.currency)} a month`;
    }
    default:
      return 'No price';
  }
};

const resolvePriceToShow = (prod: FormProduct, interval: string | undefined) => {
  if (!interval) return prod.prices[0]!;

  return prod.prices.find((price) => price.recurring?.interval === interval)!;
}

const intervalsMap = {
  day: { label: 'Daily', index: 0 },
  week: { label: 'Weekly', index: 1 },
  month: { label: 'Monthly', index: 2 },
  year: { label: 'Yearly', index: 3 },
  onTime: { label: 'One Time', index: 4 },
};

export default function BasicTemplate(props: Props) {
  const { classes, cx } = useStyles();
  const { products, recommended } = props;

  const [currentInterval, setCurrentInterval] = useState<string | undefined>(undefined);

  const billingPeriods = products
    .reduce((list, prod) => {
      const intervals = prod.prices
        .map((price) => price.recurring?.interval)
        .filter((int) => !!int) as Stripe.Price.Recurring.Interval[];

      return Array.from(new Set([...list, ...intervals]));
    }, [] as Stripe.Price.Recurring.Interval[])
    .sort((a, b) => intervalsMap[a].index - intervalsMap[b].index)
    .map((interval) => ({ value: interval, label: intervalsMap[interval].label }));

  return (
    <Stack>
      <RenderIf condition={billingPeriods.length > 1}>
        <SegmentedControl data={billingPeriods} value={currentInterval} onChange={setCurrentInterval} mx="auto" mb="xl" />
      </RenderIf>
      <Group align="stretch" position="center" spacing="xl">
        {products.map((prod, index) => {
          const { hasFreeTrial, freeTrialDays } = resolvePriceToShow(prod, currentInterval);
          return (
            <Stack
              key={prod.id}
              align="center"
              className={cx(classes.productCard, { [classes.activeProductCard]: index === recommended })}
            >
              <Text weight="bold" color={index === recommended ? 'blue' : undefined}>{prod.name}</Text>
              <Text
                style={{ fontSize: '32px', fontWeight: 'bold' }}
                color={index === recommended ? 'blue' : undefined}
              >
                {resolvePricing(prod.prices[0]!)}
              </Text>
              <Text align="center">{prod.description}</Text>
              <RenderIf condition={!!hasFreeTrial}>
                <Text color="dimmed">With a {freeTrialDays} days free trial</Text>
              </RenderIf>
              <Button mt="auto" variant={index === products.length - 1 ? 'filled' : 'outline'}>
                {hasFreeTrial ? 'Start free trial' : 'Subscribe'}
              </Button>
            </Stack>
          )
        })}
      </Group>
    </Stack>
  );
}
