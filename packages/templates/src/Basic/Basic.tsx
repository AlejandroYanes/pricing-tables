/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import type { FormPrice } from '@dealo/models';
import { RenderIf, PoweredBy, Tabs, TabsList, TabsTrigger, Button } from '@dealo/ui';
import { type Colors, generateQueryString } from '@dealo/helpers';

import type { Interval, TemplateProps } from '../constants/types';
import { resolveBillingIntervals } from './utils/resolve-billing-intervals';
import { filterProductsByInterval } from './utils/filter-produts-by-interval';
import { resolvePriceToShow } from './utils/resolve-price-to-show';
import { resolvePricing } from './utils/resolve-pricing';
import { resolveFeaturesForProduct } from './utils/resolve-features-for-product';
import { BORDER_STYLES, BUTTON_STYLES, OUTLINE_BUTTON_STYLES, TEXT_STYLES } from './template-colors';

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
    <div data-el="template__root" className="flex flex-col items-center">
      <RenderIf condition={billingIntervals.length > 1}>
        <Tabs
          value={currentInterval}
          onValueChange={setCurrentInterval as any}
          className="mx-auto mb-8 rounded-md border border-neutral-200 dark:border-slate-800"
        >
          <TabsList>
            {billingIntervals.map((interval) => (
              <TabsTrigger key={interval.value} value={interval.value}>{interval.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </RenderIf>
      <div data-el="template__content" className="grid justify-items-center box-border gap-4 p-1 pl-9" style={{ gridTemplateColumns: `repeat(${visibleProducts.length}, 1fr)` }}>
        {visibleProducts.map((prod, index) => {
          const isFirst = index === 0;

          const { isCustom } = prod;
          const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
          const { hasFreeTrial, freeTrialDays } = priceToShow as FormPrice;

          const isRecommended = visibleProducts.length === 1 || prod.id === recommended;
          const featureList = resolveFeaturesForProduct(features, prod.id);


          const { isCustom } = prod;
          const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
          const { hasFreeTrial, freeTrialDays } = priceToShow as FormPrice;

          const isRecommended = visibleProducts.length === 1 || prod.id === recommended;

          return (
            <div
              data-active={isRecommended}
              data-wide={!!unitLabel}
              className={`flex flex-col items-center relative box-border border border-slate-200 dark:border-slate-800 pt-16 px-8 pb-8 rounded-md w-[300px] data-[wide=true]:w-auto ${BORDER_STYLES[color]}`}
              key={prod.id}
            >
              <span
                data-active={isRecommended}
                className={`mb-4 text text-xl slate-900 dark:text-slate-100 font-bold ${TEXT_STYLES[color]}`}
              >
                {prod.name}
              </span>
              <RenderIf condition={!isCustom}>
                <span
                  data-active={isRecommended}
                  className={`mb-4 text text-center slate-900 dark:text-slate-100 font-bold text-3xl ${TEXT_STYLES[color]}`}
                >
                  {!isCustom ? resolvePricing({ price: priceToShow, unitLabel, currency }) : null}
                </span>
              </RenderIf>
              <span className="text text-center mb-4">{prod.description}</span>
              <div className="flex flex-col items-center mt-auto">
                <RenderIf condition={hasFreeTrial}>
                  <span className="text text-slate-500 mb-4">With a {freeTrialDays} {freeTrialDays! > 1 ? 'days' : 'day'} free trial</span>
                </RenderIf>
                <a href={resolveBtnUrl({
                  isCustom: !!isCustom,
                  prod,
                  priceToShow,
                  type: priceToShow.type,
                  dev: !!dev,
                  widgetId: widget,
                  callbacks,
                  environment,
                  currency,
                })}>
                  <Button variant="undecorated" className={isRecommended ? BUTTON_STYLES[color] : OUTLINE_BUTTON_STYLES[color]}>
                    {resolveBtnLabel({
                      type: priceToShow.type,
                      prod,
                      isCustom: !!isCustom,
                      hasFreeTrial: priceToShow.hasFreeTrial,
                      freeTrialLabel,
                      subscribeLabel,
                    })}
                  </Button>
                </a>
              </div>
              <RenderIf condition={isFirst}>
                <PoweredBy color={color as Colors} position="left" style={{ top: 170, left: -32 }} />
              </RenderIf>
            </div>
          )
        })}
        {visibleProducts.map((prod) => {
          const featureList = resolveFeaturesForProduct(features, prod.id);

          return (
            <ul key={`prod-${prod.id}-features`} className="list-disc ml-8 mr-auto">
              {featureList.map((feat, index) => (
                <li key={index}><span className="text text-left">{feat}</span></li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
}
