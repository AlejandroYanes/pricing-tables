import { useEffect, useMemo, useState } from 'react';
import { Button, createStyles, SegmentedControl, SimpleGrid, Stack, Text } from '@mantine/core';
import type { FormCallback, FormFeature, FormPrice, FormProduct } from 'models';
import { RenderIf } from 'ui';

import type { Interval } from './types';
import { resolveBillingIntervals } from './utils/resolve-billing-intervals';
import { filterProductsByInterval } from './utils/filter-produts-by-interval';
import { resolvePriceToShow } from './utils/resolve-price-to-show';
import { resolvePricing } from './utils/resolve-pricing';
import { resolveFeaturesForProduct } from './utils/resolve-features-for-product';

interface Props {
  features: FormFeature[];
  products: FormProduct[];
  recommended: string | null;
  unitLabel: string | null;
  color: string;
  subscribeLabel: string;
  freeTrialLabel: string;
  callbacks: FormCallback[];
  environment?: string;
  currency?: string | null;
}

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
    width: '300px',
  },
  wideCard: {
    width: 'auto',
  },
}));

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
            if (isCustom) return prod.ctaUrl || '';

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