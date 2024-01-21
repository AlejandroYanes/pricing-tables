/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import type { FormCallback, FormPrice, FormProduct } from '@dealo/models';
import {
  RenderIf,
  PoweredBy,
  Tabs,
  TabsList,
  TabsTrigger,
  Button,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion
} from '@dealo/ui';
import { type Colors, formatCurrencyWithoutSymbol, generateQueryString, getCurrencySymbol } from '@dealo/helpers';

import type { Interval, TemplateProps } from '../constants/types';
import { resolveBillingIntervals } from './utils/resolve-billing-intervals';
import { filterProductsByInterval } from './utils/filter-produts-by-interval';
import { resolvePriceToShow } from './utils/resolve-price-to-show';
import { resolvePricing } from './utils/resolve-pricing';
import { resolveFeaturesForProduct } from './utils/resolve-features-for-product';
import {
  BORDER_STYLES,
  BUTTON_STYLES,
  OUTLINE_BUTTON_STYLES,
  TEXT_STYLES,
  MOBILE_FILLED_BUTTON_STYLES,
  ACCORDION_HEADER_STYLES,
  CHECK_ICON_COLORS
} from './template-colors';
import { intervalsMap } from '../constants/intervals';

type PricingProps = {
  price: FormPrice;
  unitLabel: string | null;
  currency?: string | null;
}
const resolveMobilePricing = (options: PricingProps) => {
  const { price, unitLabel, currency: selectedCurrency } = options;
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
    if (transform_quantity) {
      return (
        <div className="flex flex-col ml-auto shrink-0">
          <div className="flex items-center gap-1">
            <sup className="text text-white text-[18px] mt-[-8px] leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
              {getCurrencySymbol(currency)}
            </sup>
            <span className="text text-[48px] leading-none">{formatCurrencyWithoutSymbol(unit_amount! / 100)}</span>
          </div>
          <sub className="text text-white leading-none">
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </sub>
        </div>
      );
    }

    return (
      <div className="flex ga-1 ml-auto shrink-0">
        <span className="text text-[48px] leading-none">
          {getCurrencySymbol(currency)}
        </span>
        <span className="text text-white text-[48px]">{formatCurrencyWithoutSymbol(unit_amount! / 100)}</span>
        <RenderIf condition={!!unitLabel}>
          <sub className="text text-white leading-none">{` per ${unitLabel}`}</sub>
        </RenderIf>
      </div>
    );
  }

  const recurringLabel = intervalsMap[recurring!.interval].short;
  const intervalCount = recurring!.interval_count;

  if (billing_scheme === 'per_unit') {
    if (transform_quantity) {
      return (
        <div className="flex flex-col ml-auto shrink-0">
          <div className="flex items-center gap-1">
            <span className="text text-[48px] leading-none">
              {getCurrencySymbol(currency)}
            </span>
            <span className="text text-white text-[48px] leading-none">{formatCurrencyWithoutSymbol(unit_amount! / 100)}</span>
            <sub
              className="text text-white text-[18px] mb-[-8px] leading-none"
            >
              {`/ ${intervalCount > 1 ? intervalCount : ''}${recurringLabel}`}
            </sub>
          </div>
          <sub className="text text-white text-[18px] leading-none">
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </sub>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 ml-auto flex-nowrap shrink-0">
        <span className="text text-[48px] leading-none">
          {getCurrencySymbol(currency)}
        </span>
        <span className="text text-[48px] leading-none">
          {formatCurrencyWithoutSymbol(unit_amount! / 100)}
        </span>
        <sub className="text text-[18px] mb-[-8px]">
          {`/ ${intervalCount > 1 ? `${intervalCount} ` : ''}${recurringLabel}`}
        </sub>
      </div>
    );
  }

  return 'Unable to resolve pricing';
};

interface ButtonLabelParams { type: string; prod: FormProduct; isCustom: boolean; hasFreeTrial: boolean; freeTrialLabel: string; subscribeLabel: string }
const resolveBtnLabel = (param: ButtonLabelParams) => {
  const { type, prod, isCustom, hasFreeTrial, freeTrialLabel, subscribeLabel } = param;

  if (type === 'one_time') return 'Buy Now';
  if (isCustom) return prod.ctaLabel;
  return hasFreeTrial ? freeTrialLabel : subscribeLabel;
};

interface BtnUrlParams {
  dev: boolean;
  widgetId: string;
  callbacks: FormCallback[];
  environment: string;
  isCustom: boolean;
  prod: FormProduct;
  priceToShow: FormPrice;
  type: string;
  currency?: string | null;
  freTrialDays?: number;
  freeTrialEndAction?: string;
}
const resolveBtnUrl = (params: BtnUrlParams) => {
  const {
    widgetId,
    isCustom,
    prod,
    priceToShow,
    type,
    dev,
    environment,
    callbacks,
    currency,
    freTrialDays,
    freeTrialEndAction,
  } = params;

  if (isCustom) return prod.ctaUrl || '';

  const callbackUrl = callbacks.find((cb) => cb.env === environment)!.url;
  const hasQueryParams = callbackUrl.includes('?');

  const queryParams: Record<string, string | number | undefined> = {
    widget_id: widgetId,
    product_id: dev ? prod.mask! : prod.id,
    price_id: dev ? priceToShow.mask! : priceToShow.id,
    currency: currency || priceToShow.currency,
    payment_type: type,
    free_trial_days: freTrialDays,
    free_trial_end_action: freeTrialEndAction,
  };

  const queryString = generateQueryString(queryParams);
  return `${callbackUrl}${hasQueryParams ? '&' : '?'}${queryString}`;
};

export default function BasicTemplate(props: TemplateProps) {
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
    const items = visibleProducts.map((product) => {
      const { isCustom } = product;
      const priceToShow = !isCustom ? resolvePriceToShow(product, currentInterval) : {} as FormPrice;
      const isRecommended = product.id === recommended;

      return (
        <AccordionItem value={product.id} key={product.id}>
          <AccordionTrigger>
            <div data-recommended={isRecommended} className={`flex flex-row items-center justify-between ${ACCORDION_HEADER_STYLES[color]}`}>
              <div className="flex flex-col items-start ml-4 mr-16 gap-0.5">
                <span className="text text-[18px] font-bold">{product.name}</span>
                <span className="text m-w-[360px]">{product.description}</span>
              </div>
              {
                !isCustom
                  ? resolveMobilePricing({ price: priceToShow, unitLabel, currency })
                  : null
              }
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col">
            <ul className="flex flex-col items-stretch mt-4 mb-8">
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
                  <li key={feature.id} className="px-4 py-2">
                    <div className="flex flex-row items-center justify-between">
                      <span className="text text-sm">
                        {label}
                      </span>
                      <RenderIf condition={checked} fallback={<IconCircleX color="gray"/>}>
                        <IconCircleCheck/>
                      </RenderIf>
                    </div>
                  </li>
                );
              })}
            </ul>
            <a
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
                freTrialDays: priceToShow.hasFreeTrial ? priceToShow.freeTrialDays : undefined,
                freeTrialEndAction: priceToShow.hasFreeTrial ? priceToShow.freeTrialEndAction : undefined,
              })}
            >
              <Button
                data-spaced={priceToShow.hasFreeTrial}
                className={`w-full data-[spaced=true]:mb-4 uppercase ${isRecommended ? MOBILE_FILLED_BUTTON_STYLES[color] : OUTLINE_BUTTON_STYLES[color]}`}
                variant="undecorated"
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
            </a>
            <RenderIf condition={priceToShow.hasFreeTrial}>
              <span className="text-sm text-center">{priceToShow.freeTrialDays} days</span>
            </RenderIf>
          </AccordionContent>
        </AccordionItem>
      )
    });

    const recommendedProduct = visibleProducts.find((prod) => prod.id === recommended);

    return (
      <div className="flex flex-col items-center gap-4">
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
        <Accordion type="single" collapsible defaultValue={recommendedProduct?.id}>
          {items}
        </Accordion>
      </div>
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
      <div data-el="template__content" className="grid justify-items-center box-border gap-x-4 p-1 pl-9" style={{ gridTemplateColumns: `repeat(${visibleProducts.length}, 1fr)` }}>
        {visibleProducts.map((prod, index) => {
          const isFirst = index === 0;

          const { isCustom } = prod;
          const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
          const { hasFreeTrial, freeTrialDays } = priceToShow as FormPrice;

          const isRecommended = visibleProducts.length === 1 || prod.id === recommended;

          return (
            <div
              data-active={isRecommended}
              className={`flex flex-col items-center pt-8 px-8 pb-8 relative box-border rounded-t-md border-t border-l border-r border-slate-200 dark:border-slate-800 w-[300px] ${BORDER_STYLES[color]}`}
              key={prod.id}
            >
              <span
                data-active={isRecommended}
                className={`mb-4 text text-3xl slate-900 dark:text-slate-100 font-bold ${TEXT_STYLES[color]}`}
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
                <a
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
                    freTrialDays: priceToShow.hasFreeTrial ? priceToShow.freeTrialDays : undefined,
                    freeTrialEndAction: priceToShow.hasFreeTrial ? priceToShow.freeTrialEndAction : undefined,
                  })}
                >
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
          const isRecommended = visibleProducts.length === 1 || prod.id === recommended;
          const featureList = resolveFeaturesForProduct(features, prod.id);

          return (
            <ul
              key={`prod-${prod.id}-features`}
              data-active={isRecommended}
              className={`w-[300px] flex flex-col gap-2 p-4 pb-7 rounded-b-md border-b border-l border-r border-slate-200 dark:border-slate-800 ${BORDER_STYLES[color]}`}
            >
              {featureList.map((feat, index) => (
                <li key={index} className="flex items-center gap-2">
                  <IconCircleCheck className={CHECK_ICON_COLORS[color]} />
                  <span className="text text-left">{feat}</span>
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
}
