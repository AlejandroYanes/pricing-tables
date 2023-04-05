/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import type Stripe from 'stripe';
import { Button, createStyles, SegmentedControl, SimpleGrid, Stack, Text } from '@mantine/core';
import type { CTACallback, Feature, FormPrice, FormProduct } from 'models';
import { formatCurrency } from 'helpers';
import { RenderIf } from 'ui';

interface Props {
  features: Feature[];
  products: FormProduct[];
  recommended: string | undefined;
  unitLabel?: string;
  color: string;
  subscribeLabel: string;
  freeTrialLabel: string;
  callbacks: CTACallback[];
  environment?: string;
  currency?: string | null;
}

type Interval = undefined | 'one_time' | Stripe.Price.Recurring.Interval;

const useStyles = createStyles((theme, color: string) => ({
  productCard: {
    boxSizing: 'border-box',
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

const intervalsMap = {
  day: { label: 'Daily', short: 'day', index: 0 },
  week: { label: 'Weekly', short: 'we', index: 1 },
  month: { label: 'Monthly', short: 'mo', index: 2 },
  year: { label: 'Yearly', short: 'yr', index: 3 },
  one_time: { label: 'One Time', index: 4 },
};

const resolvePricing = (options: { price: FormPrice; unitLabel?: string; currency?: string | null }): string => {
  const { price, unitLabel, currency: selectedCurrency } = options;
  const {
    type,
    tiers_mode,
    currency: baseCurrency,
    currency_options,
    billing_scheme,
    transform_quantity,
    recurring,
    unit_amount: baseAmount,
    tiers,
  } = price;

  const currency = selectedCurrency || baseCurrency;
  const unit_amount = selectedCurrency ? currency_options![selectedCurrency]!.unit_amount : baseAmount;

  if (type === 'one_time') {
    return `${formatCurrency(unit_amount! / 100, currency)}${!!unitLabel ? ` per ${unitLabel}` : ''}`;
  }

  const recurringLabel = intervalsMap[recurring!.interval].short;

  if (billing_scheme === 'per_unit') {
    if (transform_quantity) {
      return `${formatCurrency(unit_amount! / 100, currency)} per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}/${recurringLabel}`;
    }

    return `${formatCurrency(unit_amount! / 100, currency)} ${!!unitLabel ? ` per ${unitLabel}` : ''}/${recurringLabel}`;
  }

  switch (tiers_mode) {
    case 'volume': {
      const tier = tiers![0]!;
      return `Starts at ${formatCurrency(tier.unit_amount! / 100, currency)} for the first ${tier.up_to} ${!!unitLabel ? unitLabel : 'units'}`;
    }
    case 'graduated': {
      const tier = tiers![0]!;
      return `Starts at ${formatCurrency(tier.unit_amount! / 100, currency)} ${!!unitLabel ? ` per ${unitLabel}` : ''} a month`;
    }
    default:
      return 'No price';
  }
};

const resolveBillingIntervals = (products: FormProduct[]) => {
  return products
    .reduce((list, prod) => {
      if (prod.isCustom) return list;

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
    if (prod.isCustom) return prod;

    if (interval === 'one_time') {
      return prod.prices.some((price) => price.type === 'one_time');
    }

    return prod.prices.some((price) => price.recurring?.interval === interval);
  });
};

const resolvePriceToShow = (prod: FormProduct, interval: Interval) => {
  if (!interval) return prod.prices[0]!;

  if (interval === 'one_time') return prod.prices.find((price) => price.type === 'one_time')!;

  return prod.prices.find((price) => price.recurring?.interval === interval)!;
}

const resolveFeaturesForProduct = (features: Feature[], productId: string) => {
  return features.reduce((acc, feat) => {
    const targetProduct = feat.products.find((prod) => {
      return prod.id === productId;
    });

    if (targetProduct) {
      let featureLabel: string | undefined;
      switch (feat.type) {
        case 'boolean':
          featureLabel = targetProduct.value ? feat.name : undefined;
          break;
        case 'compose':
          featureLabel = `${targetProduct.value} ${feat.name}`;
          break;
        case 'string':
          featureLabel = targetProduct.value as string;
          break;
        default:
          featureLabel = '';
      }

      if (!featureLabel) return acc;

      return acc.concat(featureLabel);
    }

    return acc;
  }, [] as string[]);
};

export function BasicTemplate(props: Props) {
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
  const { classes, cx } = useStyles(color);

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

  return (
    <Stack align="center">
      <RenderIf condition={billingIntervals.length > 1}>
        <SegmentedControl data={billingIntervals} value={currentInterval} onChange={setCurrentInterval as any} mx="auto" mb="xl" />
      </RenderIf>
      <SimpleGrid style={{ justifyItems: 'center', boxSizing: 'border-box' }} cols={visibleProducts.length} spacing="sm">
        {visibleProducts.map((prod) => {
          const { isCustom } = prod;
          const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
          const { hasFreeTrial, freeTrialDays, type } = priceToShow as FormPrice;

          const isRecommended = visibleProducts.length === 1 || prod.id === recommended;

          const resolveBtnLabel = () => {
            if (type === 'one_time') return 'Buy Now';
            if (isCustom) return prod.ctaLabel;
            return hasFreeTrial ? freeTrialLabel : subscribeLabel;
          };

          const resolveBtnUrl = () => {
            if (isCustom) return prod.ctaUrl;

            const callbackUrl = callbacks.find((cb) => cb.env === environment)!.url;
            return `${callbackUrl}?product_id=${prod.id}&price_id=${priceToShow.id}`;
          };

          return (
            <Stack
              key={prod.id}
              align="center"
              className={cx(classes.productCard, { [classes.activeProductCard]: isRecommended, [classes.wideCard]: !!unitLabel })}
            >
              <Text
                style={{ fontSize: '18px' }}
                weight="bold"
                color={isRecommended ? color : undefined}
              >
                {prod.name}
              </Text>
              <RenderIf condition={!isCustom}>
                <Text
                  weight="bold"
                  align="center"
                  style={{ fontSize: '32px' }}
                  color={isRecommended ? color : undefined}
                >
                  {!isCustom ? resolvePricing({ price: priceToShow, unitLabel, currency }) : null}
                </Text>
              </RenderIf>
              <Text align="center">{prod.description}</Text>
              <Stack mt="auto" align="center">
                <RenderIf condition={!!hasFreeTrial}>
                  <Text color="dimmed">With a {freeTrialDays} {freeTrialDays! > 1 ? 'days' : 'day'} free trial</Text>
                </RenderIf>
                <Button component="a" href={resolveBtnUrl()} color={color} variant={isRecommended ? 'filled' : 'outline'}>
                  {resolveBtnLabel()}
                </Button>
              </Stack>
            </Stack>
          )
        })}
        {visibleProducts.map((prod) => {
          const featureList = resolveFeaturesForProduct(features, prod.id);

          return (
            <ul key={`prod-${prod.id}-features`} style={{ marginRight: 'auto' }}>
              {featureList.map((feat, index) => (
                <li key={index}><Text align="left">{feat}</Text></li>
              ))}
            </ul>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
