/* eslint-disable max-len */
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Accordion, Button, createStyles, Group, SegmentedControl, Stack, Table, Text, useMantineTheme } from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons';
import { PoweredBy, RenderIf } from 'ui';
import type { FormCallback, FormPrice, FormProduct } from 'models';
import { formatCurrencyWithoutSymbol, generateQueryString, getCurrencySymbol } from 'helpers';

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
      padding: '8px 14px !important',
      borderTop: 'none !important',
      textAlign: 'center',
    },
  },
  header: {
    verticalAlign: 'top',
  },
  recommended: {
    color: 'white',
    backgroundColor: theme.colors[color]![8],
  },
  itemsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing.xs,
  },
  featureBlock: {
    padding: `2px ${theme.spacing.md}`,
  },
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

const resolveBtnLabel = (param: { type: string; prod: FormProduct; isCustom: boolean; hasFreeTrial: boolean; freeTrialLabel: string; subscribeLabel: string }) => {
  const { type, prod, isCustom, hasFreeTrial, freeTrialLabel, subscribeLabel } = param;

  if (type === 'one_time') return 'Buy Now';
  if (isCustom) return prod.ctaLabel;
  return hasFreeTrial ? freeTrialLabel : subscribeLabel;
};

const resolveBtnUrl = (params: { dev: boolean; widgetId: string; callbacks: FormCallback[]; environment: string; isCustom: boolean; prod: FormProduct; priceToShow: FormPrice; type: string; currency?: string | null }) => {
  const { widgetId, isCustom, prod, priceToShow, type, dev, environment, callbacks, currency } = params;

  if (isCustom) return prod.ctaUrl || '';

  const callbackUrl = callbacks.find((cb) => cb.env === environment)!.url;
  const hasQueryParams = callbackUrl.includes('?');

  const queryParams: Record<string, string> = {
    widget_id: widgetId,
    product_id: dev ? prod.mask! : prod.id,
    price_id: dev ? priceToShow.mask! : priceToShow.id,
    currency: currency || priceToShow.currency,
    payment_type: type,
  };

  const queryString = generateQueryString(queryParams);
  return `${callbackUrl}${hasQueryParams ? '&' : '?'}${queryString}`;
};

export function SecondTemplate(props: TemplateProps) {
  const {
    dev,
    widget,
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
    isMobile = false,
  } = props;

  const [currentInterval, setCurrentInterval] = useState<Interval>(undefined);

  const billingIntervals = useMemo(() => resolveBillingIntervals(products), [products]);

  const visibleProducts = useMemo(
    () => filterProductsByInterval(products, currentInterval),
    [currentInterval, products],
  );

  const theme = useMantineTheme();
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

  if (isMobile) {
    const items = visibleProducts.map((product) => {
      const { isCustom } = product;
      const priceToShow = !isCustom ? resolvePriceToShow(product, currentInterval) : {} as FormPrice;
      const isRecommended = product.id === recommended;
      const recommendedColor = theme.colorScheme === 'light' ? theme.colors[color]![8] : theme.colors[color]![6];

      return (
        <Accordion.Item value={product.id} key={product.id}>
          <Accordion.Control>
            <Group align="center" position="apart" style={{ color: isRecommended ? recommendedColor : undefined }}>
              <Stack ml="md" mr="3rem" spacing={2}>
                <Text size={18} weight="bold">{product.name}</Text>
                <Text style={{ maxWidth: '360px' }}>{product.description}</Text>
              </Stack>
              {
                !isCustom
                  ? resolvePricing({ price: priceToShow, unitLabel, currency, isRecommended })
                  : null
              }
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <ul className={classes.itemsList}>
              {features.map((feature) => {
                const prodValue = feature.products.find((prod) => prod.id === product.id)!;
                const checked = feature.type === 'boolean' ? prodValue.value === 'true' : true;
                if (feature.type !== 'boolean' && !prodValue.value) return null;

                let label = '';

                switch (feature.type) {
                  case 'boolean':
                    label = feature.name;
                    break;
                  case 'compose':
                    label = `${prodValue.value} ${feature.name}`;
                    break;
                  case 'string':
                    label = prodValue.value;
                    break;
                  default:
                    break;
                }

                return (
                  <li key={feature.id} className={classes.featureBlock}>
                    <Group align="center" position="apart">
                      <Text size="sm">
                        {label}
                      </Text>
                      <RenderIf condition={checked} fallback={<IconCircleX color="gray"/>}>
                        <IconCircleCheck
                          fill={theme.colors[color]![8]}
                          color={theme.colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[8]}
                        />
                      </RenderIf>
                    </Group>
                  </li>
                );
              })}
            </ul>
            <Stack mt="xl">
              <Button
                uppercase
                component="a"
                href={resolveBtnUrl({
                  isCustom: !!isCustom,
                  prod: product,
                  priceToShow,
                  type: priceToShow.type,
                  dev: !!dev,
                  widgetId: widget,
                  callbacks,
                  environment,
                  currency,
                })}
                mt="xl"
                mb={priceToShow.hasFreeTrial ? 'sm' : 'xl'}
                color={color}
                variant={isRecommended ? 'filled' : 'outline'}
              >
                {resolveBtnLabel({
                  type: priceToShow.type,
                  prod: product,
                  isCustom: !!isCustom,
                  hasFreeTrial: priceToShow.hasFreeTrial,
                  freeTrialLabel,
                  subscribeLabel,
                })}
              </Button>
              <RenderIf condition={priceToShow.hasFreeTrial}>
                <Text size="sm" mb="lg">{priceToShow.freeTrialDays} days</Text>
              </RenderIf>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      )
    });

    const recommendedProduct = visibleProducts.find((prod) => prod.id === recommended);

    return (
      <Stack align="center">
        <RenderIf condition={billingIntervals.length > 1}>
          <SegmentedControl data={billingIntervals} value={currentInterval} onChange={setCurrentInterval as any} mx="auto" mb="xl" />
        </RenderIf>
        <Accordion chevronPosition="left" variant="contained" defaultValue={recommendedProduct?.id}>
          {items}
        </Accordion>
      </Stack>
    );
  }

  const rows = new Array(features.length + 2).fill(1).map((_, index) => {
    const columns = visibleProducts.map((prod) => {
      const { isCustom } = prod;
      const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
      const { hasFreeTrial, freeTrialDays, type } = priceToShow as FormPrice;
      const isRecommended = visibleProducts.length === 1 || prod.id === recommended;

      switch (index) {
        // pricing
        case 0:
          return (
            <td key={prod.id} className={cx(classes.header, { [classes.recommended]: isRecommended })}>
              <Stack align="center" py="md" h="100%">
                <Text size={32}>{prod.name}</Text>
                {isCustom ? <Text mt="auto" style={{ whiteSpace: 'break-spaces' }}>{prod.description}</Text> : null}
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
                href={resolveBtnUrl({
                  isCustom: !!isCustom,
                  prod,
                  priceToShow,
                  type: priceToShow.type,
                  dev: !!dev,
                  widgetId: widget,
                  callbacks,
                  environment,
                  currency,
                })}
                mt="xl"
                mb={hasFreeTrial ? 'sm' : 'xl'}
                color={color}
                variant={isRecommended ? 'white' : 'outline'}
              >
                {resolveBtnLabel({ type, prod, isCustom: !!isCustom, hasFreeTrial, freeTrialLabel, subscribeLabel })}
              </Button>
              <RenderIf condition={hasFreeTrial}>
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
      <div style={{ position: 'relative' }}>
        <Table
          highlightOnHover
          withBorder
          withColumnBorders
          className={classes.table}
        >
          <tbody>{rows}</tbody>
        </Table>
        <PoweredBy color={color} position="left" left={-26} top={160} />
      </div>
    </Stack>
  );
}
