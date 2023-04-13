import { useEffect, useMemo, useState } from 'react';
import { Button, createStyles, Group, SegmentedControl, Stack, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { IconCircleCheck, IconCircleX, IconCircle } from '@tabler/icons';
import type { FormCallback, FormPrice, FormProduct } from 'models';
import { formatCurrencyWithoutSymbol, getCurrencySymbol } from 'helpers';
import { RenderIf } from 'ui';

import type { TemplateProps, Interval } from '../constants/types';
import { intervalsMap } from '../constants/intervals';
import { resolveBillingIntervals } from '../Basic/utils/resolve-billing-intervals';
import { filterProductsByInterval } from '../Basic/utils/filter-produts-by-interval';
import { resolvePriceToShow } from '../Basic/utils/resolve-price-to-show';

const useStyles = createStyles((theme, color: string) => ({
  itemsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing.md,
  },
  productBlock: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[4]}`,
  },
  selected: {
    color: 'white',
    borderColor: theme.colorScheme === 'light' ? theme.colors[color]![8] : theme.colors[color]![9],
    backgroundColor: theme.colorScheme === 'light' ? theme.colors[color]![8] : theme.colors[color]![9],
  },
  recommended: {
    color: theme.colorScheme === 'light' ? theme.colors[color]![8] : theme.colors[color]![6],
    borderColor: theme.colorScheme === 'light' ? theme.colors[color]![8] : theme.colors[color]![6],
  },
  whiteBadge: {
    color: 'white',
    borderColor: 'white',
  },
  featuresBox: {
    minWidth: '360px',
    boxSizing: 'border-box',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[8],
    padding: `${theme.spacing.lg} 0`,
  },
  featureBlock: {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
  },
}));

type PricingProps = {
  price: FormPrice;
  isSelected: boolean;
  unitLabel: string | null;
  currency?: string | null;
}
const resolvePricing = (options: PricingProps) => {
  const { price, unitLabel, currency: selectedCurrency, isSelected } = options;
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
            <Text component="sup" size={18} mt={-8} color={isSelected ? undefined : 'dimmed'}>
              {getCurrencySymbol(currency)}
            </Text>
            <Text size={48} style={{ lineHeight: 1 }}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
            <Text component="sub" color={isSelected ? undefined : 'dimmed'} size={18} mb={-8}>
              {`/ ${intervalCount > 1 ? intervalCount : ''}${recurringLabel}`}
            </Text>
          </Group>
          <Text component="sub" color={isSelected ? undefined : 'dimmed'}>
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </Text>
        </Stack>
      );
    }

    return (
      <Group spacing={4} ml="auto">
        <Text size={48} style={{ lineHeight: 1 }}>
          {getCurrencySymbol(currency)}
        </Text>
        <Text size={48} style={{ lineHeight: 1 }}>
          {formatCurrencyWithoutSymbol(unit_amount! / 100)}
        </Text>
        <Text component="sub" size={18} mb={-8}>
          {`/ ${intervalCount > 1 ? `${intervalCount} ` : ''}${recurringLabel}`}
        </Text>
      </Group>
    );
  }

  return 'Unable to resolve pricing';
};

const resolveCTA = (
  product: FormProduct,
  interval: Interval,
  callbacks: FormCallback[],
  env: string,
  subscribeLabel: string,
  freeTrialLabel: string,
) => {
  const { isCustom } = product;
  const priceToShow = !isCustom ? resolvePriceToShow(product, interval) : {} as FormPrice;
  const { hasFreeTrial, freeTrialDays, type } = priceToShow as FormPrice;

  const resolveBtnLabel = () => {
    if (type === 'one_time') return 'Buy Now';
    if (isCustom) return product.ctaLabel;
    return hasFreeTrial ? freeTrialLabel : subscribeLabel;
  };

  const resolveBtnUrl = () => {
    if (isCustom) return product.ctaUrl || '';

    const callbackUrl = callbacks.find((cb) => cb.env === env)!.url;
    return `${callbackUrl}?product_id=${product.id}&price_id=${priceToShow.id}`;
  };

  if (hasFreeTrial) {
    return (
      <>
        <Button mx="xl" component="a" href={resolveBtnUrl()}>{resolveBtnLabel()}</Button>
        <Text align="center">{freeTrialDays} days</Text>
      </>
    );
  }

  return <Button mx="xl" component="a" href={resolveBtnUrl()}>{resolveBtnLabel()}</Button>;
};

export function ThirdTemplate(props: TemplateProps) {
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
  const theme = useMantineTheme();
  const { classes, cx } = useStyles(color);

  const [selectedProduct, setSelectedProduct] = useState<number>(() => {
    return products.findIndex((product) => product.id === recommended);
  });
  const [currentInterval, setCurrentInterval] = useState<Interval>(undefined);

  const billingIntervals = useMemo(() => resolveBillingIntervals(products), [products]);

  const visibleProducts = useMemo(
    () => filterProductsByInterval(products, currentInterval),
    [currentInterval, products],
  );

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

  return (
    <Stack align="center">
      <RenderIf condition={billingIntervals.length > 1}>
        <SegmentedControl data={billingIntervals} value={currentInterval} onChange={setCurrentInterval as any} mx="auto" mb="xl" />
      </RenderIf>
      <Group align="start" spacing={32}>
        <ul className={classes.itemsList}>
          {visibleProducts.map((prod, index) => {
            const { isCustom } = prod;
            const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
            const isRecommended = prod.id === recommended;
            const isSelected = selectedProduct === index;

            return (
              <li key={prod.id}>
                <UnstyledButton
                  className={cx(classes.productBlock, { [classes.recommended]: isRecommended, [classes.selected]: isSelected })}
                  onClick={() => setSelectedProduct(index)}
                >
                  <RenderIf condition={isSelected} fallback={<IconCircle style={{ flexShrink: 0 }} />}>
                    <IconCircleCheck color="white" style={{ flexShrink: 0 }} />
                  </RenderIf>
                  <Stack ml="md" mr="3rem" spacing={2}>
                    <Text size={18}>{prod.name}</Text>
                    <Text style={{ maxWidth: '360px' }}>{prod.description}</Text>
                  </Stack>
                  {
                    !isCustom
                      ? resolvePricing({ price: priceToShow, unitLabel, currency, isSelected })
                      : null
                  }
                </UnstyledButton>
              </li>
            );
          })}
        </ul>
        <Stack className={classes.featuresBox}>
          <ul className={classes.itemsList}>
            {features.map((feature) => {
              const product = visibleProducts[selectedProduct]!;
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
          {resolveCTA(
            visibleProducts[selectedProduct]!,
            currentInterval,
            callbacks,
            environment,
            subscribeLabel,
            freeTrialLabel,
          )}
        </Stack>
      </Group>
    </Stack>
  );
}
