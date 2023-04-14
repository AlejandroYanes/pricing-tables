/* eslint-disable max-len */
import type { ReactNode} from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button, createStyles, Group, SegmentedControl, Stack, Table, Text } from '@mantine/core';
import { RenderIf } from 'ui';
import type { FormPrice } from 'models';
import { formatCurrencyWithoutSymbol, getCurrencySymbol } from 'helpers';

import type { TemplateProps, Interval } from '../constants/types';
import { intervalsMap } from '../constants/intervals';
import { resolveBillingIntervals } from '../Basic/utils/resolve-billing-intervals';
import { filterProductsByInterval } from '../Basic/utils/filter-produts-by-interval';
import { resolvePriceToShow } from '../Basic/utils/resolve-price-to-show';

const useStyles = createStyles((theme, { count, color }: { color: string; count: number }) => ({
  table: {
    width: `${count * 300}px`,
    tableLayout: 'fixed',
    ['& tr:first-child:hover, & tr:last-child:hover']: {
      backgroundColor: 'transparent !important',
    },
    ['& tr:hover td[data-recommended="true"]']: {
      backgroundColor: theme.colors[color]![7],
    },
    ['& td']: {
      borderTop: 'none !important',
      textAlign: 'center',
    },
  },
  recommended: {
    color: 'white',
    backgroundColor: theme.colors[color]![8],
  }
}));

type PricingProps = {
  price: FormPrice;
  isRecommended: boolean;
  unitLabel: string | null;
  currency?: string | null;
}

const resolvePricing = (options: PricingProps) => {
  const { price, unitLabel, currency: selectedCurrency, isRecommended } = options;
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
    return (
      <Group>
        <Text component="sup">{getCurrencySymbol(currency)}</Text>
        <Text size={48}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
        <RenderIf condition={!!unitLabel}>
          <Text component="sub">{` per ${unitLabel}`}</Text>
        </RenderIf>
      </Group>
    );
  }

  const recurringLabel = intervalsMap[recurring!.interval].short;
  const intervalCount = recurring!.interval_count;

  if (billing_scheme === 'per_unit') {
    if (transform_quantity) {
      return (
        <Stack spacing={0}>
          <Group spacing={4}>
            <Text component="sup" size={18} mt={-8} color={isRecommended ? undefined : 'dimmed'}>
              {getCurrencySymbol(currency)}
            </Text>
            <Text size={48} style={{ lineHeight: 1 }}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
            <Text component="sub" color={isRecommended ? undefined : 'dimmed'} size={18} mb={-8}>
              {`/ ${intervalCount > 1 ? intervalCount : ''}${recurringLabel}`}
            </Text>
          </Group>
          <Text component="sub" color={isRecommended ? undefined : 'dimmed'}>
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </Text>
        </Stack>
      );
    }

    return (
      <Group spacing={4}>
        <Text component="sup" color={isRecommended ? undefined : 'dimmed'} size={18} mt={-8}>
          {getCurrencySymbol(currency)}
        </Text>
        <Text size={48} style={{ lineHeight: 1 }}>
          {formatCurrencyWithoutSymbol(unit_amount! / 100)}
        </Text>
        <Text component="sub" color={isRecommended ? undefined : 'dimmed'} size={18} mb={-8}>
          {`/ ${intervalCount > 1 ? `${intervalCount} ` : ''}${recurringLabel}`}
        </Text>
      </Group>
    );
  }

  return 'Unable to resolve pricing';
};

export function SecondTemplate(props: TemplateProps) {
  const {
    features,
    products,
    recommended,
    unitLabel,
    color,
    subscribeLabel,
    freeTrialLabel,
    callbacks,
    environment = 'production',
    currency,
  } = props;

  const [currentInterval, setCurrentInterval] = useState<Interval>(undefined);

  const billingIntervals = useMemo(() => resolveBillingIntervals(products), [products]);

  const visibleProducts = useMemo(
    () => filterProductsByInterval(products, currentInterval),
    [currentInterval, products],
  );

  const { classes, cx } = useStyles({ color, count: visibleProducts.length });

  useEffect(() => {
    if (billingIntervals.length === 0) {
      setCurrentInterval(undefined);
    } else {
      const currentIntervalExists = billingIntervals.find((interval) => interval.value === currentInterval);

      if (!currentIntervalExists) {
        setCurrentInterval(billingIntervals[0]!.value);
      }
    }
  }, [products]);

  if (visibleProducts.length === 0) return null;

  const rows = new Array(features.length + 2).fill(1).map((_, index) => {
    const columns = visibleProducts.map((prod) => {
      const { isCustom } = prod;
      const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
      const { hasFreeTrial, freeTrialDays, type } = priceToShow as FormPrice;
      const isRecommended = prod.id === recommended;

      const resolveBtnLabel = () => {
        if (type === 'one_time') return 'Buy Now';
        if (isCustom) return prod.ctaLabel;
        return hasFreeTrial ? freeTrialLabel : subscribeLabel;
      };

      const resolveBtnUrl = () => {
        if (isCustom) return prod.ctaUrl || '';

        const callbackUrl = callbacks.find((cb) => cb.env === environment)!.url;
        return `${callbackUrl}?product_id=${prod.id}&price_id=${priceToShow.id}`;
      };

      switch (index) {
        // pricing
        case 0:
          return (
            <td key={prod.id} className={cx({ [classes.recommended]: isRecommended })}>
              <Stack align="center" py="md" h="100%">
                <Text size={32}>{prod.name}</Text>
                {isCustom ? <Text mt="auto">{prod.description}</Text> : null}
                {
                  !isCustom
                    ? resolvePricing({ price: priceToShow, unitLabel, currency, isRecommended })
                    : null
                }
              </Stack>
            </td>
          );
        // CTA
        case features.length + 1: {
          return (
            <td key={prod.id} className={cx({ [classes.recommended]: isRecommended })}>
              <Button
                uppercase
                component="a"
                href={resolveBtnUrl()}
                mt="xl"
                mb={hasFreeTrial ? 'sm' : 'xl'}
                color={color}
                variant={isRecommended ? 'white' : 'outline'}
              >
                {resolveBtnLabel()}
              </Button>
              <RenderIf condition={!!hasFreeTrial}>
                <Text size="sm" mb="lg">{freeTrialDays} days</Text>
              </RenderIf>
            </td>
          );
        }
        // Feature w/ index - 1
        default: {
          const feature = features[index - 1]!;
          const value = feature.products.find(({ id }) => id === prod.id)?.value;
          let label: ReactNode = '-';

          if (!!value) {
            switch (feature.type) {
              case 'boolean':
                label = value === 'true' ? feature.name : '-';
                break;
              case 'string':
                label = value;
                break;
              case 'compose':
                label = <Text><Text component="span" weight="bold">{value}</Text>{` ${feature.name}`}</Text>;
                break;
              default:
                break;
            }
          }

          return (
            <td
              key={`prod-${prod.id}-feature-${4}`}
              data-recommended={isRecommended}
              style={{ marginRight: 'auto' }}
              className={cx({ [classes.recommended]: isRecommended })}
            >
              {label}
            </td>
          );
        }
      }
    });

    return (
      <tr key={index}>{columns}</tr>
    );
  });

  return (
    <Stack align="center">
      <RenderIf condition={billingIntervals.length > 1}>
        <SegmentedControl data={billingIntervals} value={currentInterval} onChange={setCurrentInterval as any} mx="auto" mb="xl" />
      </RenderIf>
      <Table
        highlightOnHover
        withBorder
        withColumnBorders
        className={classes.table}
      >
        <tbody>{rows}</tbody>
      </Table>
    </Stack>
  );
}
