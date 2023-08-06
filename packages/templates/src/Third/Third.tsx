/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import { IconCircleCheck, IconCircleX, IconCircle } from '@tabler/icons-react';
import type { FormCallback, FormPrice, FormProduct } from '@dealo/models';
import type { Colors} from '@dealo/helpers';
import { formatCurrencyWithoutSymbol, generateQueryString, getCurrencySymbol } from '@dealo/helpers';
import { Button, PoweredBy, RenderIf, Tabs, TabsList, TabsTrigger } from '@dealo/ui';

import type { TemplateProps, Interval } from '../constants/types';
import { intervalsMap } from '../constants/intervals';
import { resolveBillingIntervals } from '../Basic/utils/resolve-billing-intervals';
import { filterProductsByInterval } from '../Basic/utils/filter-produts-by-interval';
import { resolvePriceToShow } from '../Basic/utils/resolve-price-to-show';
import { BUTTON_STYLES, CHECK_ICON_COLORS, PRODUCT_BUTTON_COLORS } from './template-colors';

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
    if (transform_quantity) {
      return (
        <div className="flex flex-col ml-auto shrink-0">
          <div className="flex items-center gap-1">
            <sup data-active={isSelected} className="text text-white text-[18px] mt-[-8px] leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
              {getCurrencySymbol(currency)}
            </sup>
            <span className="text text-[48px] leading-none">{formatCurrencyWithoutSymbol(unit_amount! / 100)}</span>
          </div>
          <sub data-active={isSelected} className="text text-white leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </sub>
        </div>
      );
    }

    return (
      <div className="flex ga-1 ml-auto shrink-0">
        <sup data-active={isSelected} className="text text-white text-[18px] mt-[-8px] leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
          {getCurrencySymbol(currency)}
        </sup>
        <span className="text text-white text-[48px]">{formatCurrencyWithoutSymbol(unit_amount! / 100)}</span>
        <RenderIf condition={!!unitLabel}>
          <sub data-active={isSelected} className="text text-white leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">{` per ${unitLabel}`}</sub>
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
            <sup data-active={isSelected} className="text text-white text-[18px] mt-[-8px] leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
              {getCurrencySymbol(currency)}
            </sup>
            <span className="text text-white text-[48px] leading-none">{formatCurrencyWithoutSymbol(unit_amount! / 100)}</span>
            <sub data-active={isSelected} className="text text-white text-[18px] mb-[-8px] leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
              {`/ ${intervalCount > 1 ? intervalCount : ''}${recurringLabel}`}
            </sub>
          </div>
          <sub data-active={isSelected} className="text text-white text-[18px] leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
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

interface CTAParams {
  product: FormProduct;
  interval: Interval;
  callbacks: FormCallback[];
  env: string;
  subscribeLabel: string;
  freeTrialLabel: string;
  widget: string;
  currency: string | null | undefined;
  dev: boolean;
  color: Colors;
}

const resolveCTA = (options: CTAParams) => {
  const {
    product,
    interval,
    callbacks,
    env,
    subscribeLabel,
    freeTrialLabel,
    widget,
    currency,
    dev,
    color,
  } = options;
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
    const queryParams: Record<string, string> = {
      widget_id: widget,
      product_id: dev ? product.mask! : product.id,
      price_id: dev ? priceToShow.mask! : priceToShow.id,
      currency: currency || priceToShow.currency,
      payment_type: type,
    };
    const queryString = generateQueryString(queryParams);
    return `${callbackUrl}?${queryString}`;
  };

  if (hasFreeTrial) {
    return (
      <>
        <a href={resolveBtnUrl()} className="w-full px-8">
          <Button variant="undecorated" className={`w-full ${BUTTON_STYLES[color]}`}>{resolveBtnLabel()}</Button>
        </a>
        <span className="text text-center text-slate-500 mt-2">With a {freeTrialDays} days free trial</span>
      </>
    );
  }

  return (
    <a href={resolveBtnUrl()} className="w-full px-8">
      <Button variant="undecorated" className={`w-full ${BUTTON_STYLES[color]}`}>{resolveBtnLabel()}</Button>
    </a>
  );
};

export function ThirdTemplate(props: TemplateProps) {
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
  } = props;

  const [selectedProduct, setSelectedProduct] = useState<number>(() => {
    const index = products.findIndex((product) => product.id === recommended);
    return index === -1 ? 0 : index;
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

  const productToHighlight = !!visibleProducts[selectedProduct] ? selectedProduct : 0;

  return (
    <div className="flex flex-col items-center">
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
      <div className="flex gap-8">
        <ul className="flex flex-col gap-4">
          {visibleProducts.map((prod, index) => {
            const { isCustom } = prod;
            const priceToShow = !isCustom ? resolvePriceToShow(prod, currentInterval) : {} as FormPrice;
            const isRecommended = prod.id === recommended;
            const isSelected = productToHighlight === index;

            return (
              <li key={prod.id}>
                <Button
                  data-active={isRecommended}
                  data-selected={isSelected}
                  variant="undecorated"
                  className={`group relative h-auto min-w-[480px] w-full flex items-center p-8 rounded-md border ${PRODUCT_BUTTON_COLORS[color]}`}
                  onClick={() => setSelectedProduct(index)}
                >
                  <RenderIf condition={isSelected} fallback={<IconCircle style={{ flexShrink: 0 }} />}>
                    <IconCircleCheck color="white" style={{ flexShrink: 0 }} />
                  </RenderIf>
                  <div className="flex flex-col ml-4 mr-16 gap-0.5">
                    <span className="text text-left text-[18px]">{prod.name}</span>
                    <span className="max-w-[360px]">{prod.description}</span>
                  </div>
                  {
                    !isCustom
                      ? resolvePricing({ price: priceToShow, unitLabel, currency, isSelected })
                      : null
                  }
                </Button>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col relative min-w-[360px] box-border py-8 rounded-md bg-slate-50 dark:bg-gray-900">
          <ul className="flex flex-col gap-4 mb-4">
            {features.map((feature) => {
              const product = visibleProducts[selectedProduct] || visibleProducts[0]!;
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
                <li key={feature.id} className="py-4 px-8">
                  <div className="flex items-center justify-between">
                    <span className="text text-sm">
                      {label}
                    </span>
                    <RenderIf condition={checked} fallback={<IconCircleX color="gray"/>}>
                      <IconCircleCheck
                        className={CHECK_ICON_COLORS[color]}
                      />
                    </RenderIf>
                  </div>
                </li>
              );
            })}
          </ul>
          {resolveCTA({
            product: visibleProducts[selectedProduct] || visibleProducts[0]!,
            interval: currentInterval,
            callbacks,
            env: environment,
            subscribeLabel,
            freeTrialLabel,
            widget,
            currency,
            dev: !!dev,
            color,
          })}
          <PoweredBy color={color}  position="bottom" style={{ bottom: -32, left: '50%', transform: 'translateX(-50%)' }} />
        </div>
      </div>
    </div>
  );
}
