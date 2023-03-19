/* eslint-disable max-len */
import { Fragment, useState } from 'react';
import type Stripe from 'stripe';
import { ActionIcon, Checkbox, createStyles, Divider, Group, Select, Stack, Text, TextInput, UnstyledButton } from '@mantine/core';
import { IconX } from '@tabler/icons';

import type { ExtendedProduct, FormProduct } from 'models/stripe';
import { formatCurrency } from 'utils/numbers';
import RenderIf from 'components/RenderIf';

interface Props {
  product: ExtendedProduct;
  value: FormProduct;
  onAddPrice: (productId: string, price: Stripe.Price) => void;
  onRemove: (productId: string) => void;
  onToggleFreeTrial: (productId: string, priceId: string) => void;
  onFreeTrialDaysChange: (productId: string, priceId: string, value: string) => void;
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
}));

export default function ProductBlock(props: Props) {
  const { product, value, onAddPrice, onRemove, onToggleFreeTrial, onFreeTrialDaysChange } = props;
  const { classes } = useStyles();

  const [showPriceSelect, setShowPriceSelect] = useState(false);

  const handleSelectPrice = (priceId: string) => {
    const selectedPrice = product.prices.find((price) => price.id === priceId);

    if (!selectedPrice) return;
    onAddPrice(value.id, selectedPrice);
    setShowPriceSelect(false);
  };

  const showingMultiplePrices = value.prices.length > 1;
  const hasMorePrices = product.prices.length - value.prices.length > 0;
  const remainingPrices = product.prices.length - value.prices.length;

  const priceOptions = product.prices
    .filter((price) => !value.prices.some((sp) => sp.id === price.id))
    .map((price) => ({
      label: resolvePricing(price),
      value: price.id,
    }));

  return (
    <div className={classes.productBlock}>
      <div className={classes.deleteBtn}>
        <ActionIcon radius="xl" variant="filled" size="xs" onClick={() => onRemove(value.id)}>
          <IconX size={14} />
        </ActionIcon>
      </div>
      <Text weight="bold" p={16}>{value.name}</Text>
      <Stack>
        {(value.prices || []).map((price) => (
          <Fragment key={price.id}>
            <Stack px={16} pb={!hasMorePrices ? 16 : 0} spacing="xs">
              <Text>{`${resolvePricing(price)}`}</Text>
              <Checkbox
                label="Include free trial"
                checked={price.hasFreeTrial}
                onClick={() => onToggleFreeTrial(value.id, price.id)}
              />
              <RenderIf condition={!!price.hasFreeTrial}>
                <TextInput
                  value={price.freeTrialDays}
                  onChange={(e) => onFreeTrialDaysChange(value.id, price.id, e.target.value)}
                  rightSection={<span style={{ paddingRight: '24px' }}>days</span>}
                />
              </RenderIf>
            </Stack>
            <RenderIf condition={hasMorePrices || showingMultiplePrices}>
              <Divider orientation="horizontal" />
            </RenderIf>
          </Fragment>
        ))}
      </Stack>
      <RenderIf condition={hasMorePrices}>
        <RenderIf
          condition={!showPriceSelect}
          fallback={
            <Select radius="xs" styles={{ input: { border: 'none' } }} data={priceOptions} onChange={handleSelectPrice} />
          }
        >
          <Group px={16} py={2} align="center" position="apart">
            <Text color="dimmed" size="sm">
              {`${remainingPrices} ${remainingPrices > 1 ? 'prices' : 'price'} remaining`}
            </Text>
            <UnstyledButton
              className={classes.addPriceButton}
              onClick={() => setShowPriceSelect(true)}
            >
              Add another price
            </UnstyledButton>
          </Group>
        </RenderIf>
      </RenderIf>
    </div>
  );
}

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
