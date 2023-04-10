import { Fragment, useEffect, useRef, useState } from 'react';
import type Stripe from 'stripe';
import {
  ActionIcon,
  Checkbox,
  createStyles,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  NumberInput,
  UnstyledButton,
} from '@mantine/core';
import { IconX, IconMinus } from '@tabler/icons';
import type { ExtendedProduct, FormProduct } from 'models';
import { formatCurrency } from 'helpers';
import { RenderIf } from 'ui';

interface Props {
  product: ExtendedProduct;
  value: FormProduct;
  onAddPrice: (productId: string, price: Stripe.Price) => void;
  onRemove: () => void;
  onRemovePrice: (productId: string, priceId: string) => void;
  onToggleFreeTrial: (productId: string, priceId: string) => void;
  onFreeTrialDaysChange: (productId: string, priceId: string, days: number) => void;
}

const useStyles = createStyles((theme) => ({
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
  actionButton: {
    fontWeight: 600,
    fontSize: '14px',
    ['&:hover']: {
      cursor: 'pointer',
      color: theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor]![4] : theme.colors[theme.primaryColor]![7],
    },
  },
}));

const intervalMap: Record<Stripe.Price.Recurring.Interval, string> = {
  day: 'day',
  week: 'we',
  month: 'mo',
  year: 'yr',
};

const resolvePricing = (price: Stripe.Price): string => {
  if (price.type === 'one_time') {
    return formatCurrency(price.unit_amount! / 100, price.currency);
  }

  const recurringLabel = intervalMap[price.recurring!.interval];
  const intervalCount = price.recurring!.interval_count;

  if (price.billing_scheme === 'per_unit') {
    if (price.transform_quantity) {
      const sections = [
        formatCurrency(price.unit_amount! / 100, price.currency),
        ' per every ',
        price.transform_quantity.divide_by,
        ' units /',
        intervalCount > 1 ? `${intervalCount} ` : '',
        recurringLabel
      ];
      return sections.join('');
    }

    const sections = [
      formatCurrency(price.unit_amount! / 100, price.currency),
      ' /',
      intervalCount > 1 ? `${intervalCount} ` : '',
      recurringLabel,
    ];
    return sections.join('');
  }

  return 'Unable to resolve pricing';

  // disabled for now (https://github.com/AlejandroYanes/pricing-tables/issues/22)
  // switch (price.tiers_mode) {
  //   case 'volume': {
  //     const tier = price.tiers![0]!;
  //     return `Starts at ${formatCurrency(tier.unit_amount! / 100, price.currency)} for the first ${tier.up_to} units /${recurringLabel}`;
  //   }
  //   case 'graduated': {
  //     const tier = price.tiers![0]!;
  //     return `Starts at ${formatCurrency(tier.unit_amount! / 100, price.currency)} /${recurringLabel}`;
  //   }
  //   default:
  //     return 'No price';
  // }
};

export default function ProductBlock(props: Props) {
  const {
    product,
    value,
    onAddPrice,
    onRemove,
    onRemovePrice,
    onToggleFreeTrial,
    onFreeTrialDaysChange,
  } = props;
  const { classes } = useStyles();

  const [showPriceSelect, setShowPriceSelect] = useState(false);
  const interactionTimer = useRef<any>(undefined);

  const handleSelectPrice = (priceId: string) => {
    const selectedPrice = product.prices.find((price) => price.id === priceId);

    if (!selectedPrice) return;
    onAddPrice(value.id, selectedPrice);
    setShowPriceSelect(false);

    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = undefined;
    }
  };

  const startInteractionTimer = () => {
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = undefined;
    }
    interactionTimer.current = setTimeout(() => setShowPriceSelect(false), 5000);
  }

  useEffect(() => {
    if (showPriceSelect) {
      startInteractionTimer();
    }
  }, [showPriceSelect]);

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
        <ActionIcon radius="xl" variant="filled" size="xs" onClick={onRemove}>
          <IconX size={14} />
        </ActionIcon>
      </div>
      <Text weight="bold" p={16}>{value.name}</Text>
      <Stack>
        {(value.prices || []).map((price, index, list) => (
          <Fragment key={price.id}>
            <Divider orientation="horizontal" />
            <Stack px={16} pb={!hasMorePrices ? 16 : 0} spacing="sm" style={{ position: 'relative' }}>
              <RenderIf condition={list.length > 1}>
                <div className={classes.deleteBtn}>
                  <ActionIcon radius="xl" variant="filled" size="xs" onClick={() => onRemovePrice(value.id, price.id)}>
                    <IconMinus size={14} />
                  </ActionIcon>
                </div>
              </RenderIf>
              <Text>{resolvePricing(price)}</Text>
              <Checkbox
                label="Include free trial"
                checked={price.hasFreeTrial}
                onChange={() => undefined}
                onClick={() => onToggleFreeTrial(value.id, price.id)}
              />
              <RenderIf condition={!!price.hasFreeTrial}>
                <NumberInput
                  mb="xs"
                  label="Days"
                  min={1}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  value={price.freeTrialDays}
                  onChange={(days) => onFreeTrialDaysChange(value.id, price.id, days! as number)}
                />
              </RenderIf>
            </Stack>
            <RenderIf condition={index === list.length - 1 && hasMorePrices}>
              <Divider orientation="horizontal" />
            </RenderIf>
          </Fragment>
        ))}
      </Stack>
      <RenderIf condition={hasMorePrices}>
        <RenderIf
          condition={!showPriceSelect}
          fallback={
            <Select
              radius="xs"
              styles={{ input: { border: 'none' } }}
              data={priceOptions}
              onChange={handleSelectPrice}
              onFocus={startInteractionTimer}
            />
          }
        >
          <Group px={16} py={10} align="center" position="apart">
            <Text color="dimmed" size="sm">
              {`${remainingPrices} ${remainingPrices > 1 ? 'prices' : 'price'} remaining`}
            </Text>
            <UnstyledButton
              className={classes.actionButton}
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
