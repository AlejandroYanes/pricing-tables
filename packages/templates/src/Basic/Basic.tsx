import { useEffect, useMemo, useState } from 'react';
import { Button, createStyles, SegmentedControl, SimpleGrid, Stack, Text } from '@mantine/core';
import type { FormCallback, FormPrice, FormProduct } from 'models';
import { PoweredBy, RenderIf } from 'ui';
import { generateQueryString } from 'helpers';

import type { Interval, TemplateProps } from '../constants/types';
import { resolveBillingIntervals } from './utils/resolve-billing-intervals';
import { filterProductsByInterval } from './utils/filter-produts-by-interval';
import { resolvePriceToShow } from './utils/resolve-price-to-show';
import { resolvePricing } from './utils/resolve-pricing';
import { resolveFeaturesForProduct } from './utils/resolve-features-for-product';

const useStyles = createStyles((theme, color: string) => ({
  productCard: {
    position: 'relative',
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

// eslint-disable-next-line max-len
const resolveBtnLabel = (param: { type: string; prod: FormProduct; isCustom: boolean; hasFreeTrial: boolean; freeTrialLabel: string; subscribeLabel: string }) => {
  const { type, prod, isCustom, hasFreeTrial, freeTrialLabel, subscribeLabel } = param;

  if (type === 'one_time') return 'Buy Now';
  if (isCustom) return prod.ctaLabel;
  return hasFreeTrial ? freeTrialLabel : subscribeLabel;
};

// eslint-disable-next-line max-len
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

export function BasicTemplate(props: TemplateProps) {
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
    currency,
    environment = 'production',
    isMobile = false,
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

  if (visibleProducts.length === 0) return null;

  if (isMobile) {
    return (
      <Stack align="center">
        <RenderIf condition={billingIntervals.length > 1}>
          <SegmentedControl data={billingIntervals} value={currentInterval} onChange={setCurrentInterval as any} mx="auto" mb="xl" />
        </RenderIf>
        {visibleProducts.map((prod, index) => {
          const isFirst = index === 0;

          const { isCustom } = prod;
          const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
          const { hasFreeTrial, freeTrialDays } = priceToShow as FormPrice;

          const isRecommended = visibleProducts.length === 1 || prod.id === recommended;
          const featureList = resolveFeaturesForProduct(features, prod.id);

          return (
            <Stack key={prod.id} align="center" mb="lg">
              <Stack
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
                  <RenderIf condition={hasFreeTrial}>
                    <Text color="dimmed">With a {freeTrialDays} {freeTrialDays! > 1 ? 'days' : 'day'} free trial</Text>
                  </RenderIf>
                  <Button
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
                    color={color}
                    variant={isRecommended ? 'filled' : 'outline'}
                  >
                    {resolveBtnLabel({
                      type: priceToShow.type,
                      prod,
                      isCustom: !!isCustom,
                      hasFreeTrial: priceToShow.hasFreeTrial,
                      freeTrialLabel,
                      subscribeLabel,
                    })}
                  </Button>
                </Stack>
                <RenderIf condition={isFirst}>
                  <PoweredBy top={170} left={-27} color={color} position="left"/>
                </RenderIf>
              </Stack>
              <ul key={`prod-${prod.id}-features`} style={{ marginRight: 'auto' }}>
                {featureList.map((feat, index) => (
                  <li key={index}><Text align="left">{feat}</Text></li>
                ))}
              </ul>
            </Stack>
          )
        })}
      </Stack>
    );
  }

  return (
    <Stack align="center">
      <RenderIf condition={billingIntervals.length > 1}>
        <SegmentedControl data={billingIntervals} value={currentInterval} onChange={setCurrentInterval as any} mx="auto" mb="xl" />
      </RenderIf>
      <SimpleGrid style={{ justifyItems: 'center', boxSizing: 'border-box' }} cols={isMobile ? 1 : visibleProducts.length} spacing="sm">
        {visibleProducts.map((prod, index) => {
          const isFirst = index === 0;

          const { isCustom } = prod;
          const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
          const { hasFreeTrial, freeTrialDays } = priceToShow as FormPrice;

          const isRecommended = visibleProducts.length === 1 || prod.id === recommended;

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
                <RenderIf condition={hasFreeTrial}>
                  <Text color="dimmed">With a {freeTrialDays} {freeTrialDays! > 1 ? 'days' : 'day'} free trial</Text>
                </RenderIf>
                <Button
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
                  color={color}
                  variant={isRecommended ? 'filled' : 'outline'}
                >
                  {resolveBtnLabel({
                    type: priceToShow.type,
                    prod,
                    isCustom: !!isCustom,
                    hasFreeTrial: priceToShow.hasFreeTrial,
                    freeTrialLabel,
                    subscribeLabel,
                  })}
                </Button>
              </Stack>
              <RenderIf condition={isFirst}>
                <PoweredBy top={170} left={-27} color={color} position="left" />
              </RenderIf>
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
