/* eslint-disable max-len */
import { Button, createStyles, Group, Stack, Text } from '@mantine/core';
import type Stripe from 'stripe';

import type { FormProduct } from 'models/stripe';
import { formatCurrency } from 'utils/numbers';
import RenderIf from 'components/RenderIf';

interface Props {
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

export default function BasicTemplate(props: Props) {
  const { products } = props;
  const { classes, cx } = useStyles();

  return (
    <Group align="stretch" position="center" spacing="xl">
      {products.map((prod, index) => {
        const { hasFreeTrial, freeTrialDays } = prod.prices[0]!;
        return (
          <Stack
            key={prod.id}
            align="center"
            className={cx(classes.productCard, { [classes.activeProductCard]: index === products.length - 1 })}
          >
            <Text weight="bold" color={index === products.length - 1 ? 'blue' : undefined}>{prod.name}</Text>
            <Text
              style={{ fontSize: '32px', fontWeight: 'bold' }}
              color={index === products.length - 1 ? 'blue' : undefined}
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
  );
}
