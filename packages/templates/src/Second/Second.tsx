/* eslint-disable max-len */
import type { ReactNode} from 'react';
import { useEffect, useMemo, useState } from 'react';
import { PoweredBy, RenderIf, Button, TabsList, TabsTrigger, Tabs } from '@dealo/ui';
import type { FormPrice } from '@dealo/models';
import { formatCurrencyWithoutSymbol, generateQueryString, getCurrencySymbol } from '@dealo/helpers';

import type { TemplateProps, Interval } from '../constants/types';
import { intervalsMap } from '../constants/intervals';
import { resolveBillingIntervals } from '../Basic/utils/resolve-billing-intervals';
import { filterProductsByInterval } from '../Basic/utils/filter-produts-by-interval';
import { resolvePriceToShow } from '../Basic/utils/resolve-price-to-show';
import { ACTIVE_CELL_STYLES, BUTTON_STYLES, CELL_STYLES, OUTLINE_BUTTON_STYLES } from './template-colors';

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
      <div className="flex">
        <sup className="text">{getCurrencySymbol(currency)}</sup>
        <span className="text text-[48px]">{formatCurrencyWithoutSymbol(unit_amount! / 100)}</span>
        <RenderIf condition={!!unitLabel}>
          <sub className="text">{` per ${unitLabel}`}</sub>
        </RenderIf>
      </div>
    );
  }

  const recurringLabel = intervalsMap[recurring!.interval].short;
  const intervalCount = recurring!.interval_count;

  if (billing_scheme === 'per_unit') {
    if (transform_quantity) {
      return (
        <div className="flex flex-col">
          <div className="flex ga-1">
            <sup className="text text-[18px] mt-[-18px] leading-tight" color={isRecommended ? undefined : 'dimmed'}>
              {getCurrencySymbol(currency)}
            </sup>
            <span className="text text-[48px]" style={{ lineHeight: 1 }}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</span>
            <sub className="text text-[18px] mb-[-8px]" color={isRecommended ? undefined : 'dimmed'}>
              {`/ ${intervalCount > 1 ? intervalCount : ''}${recurringLabel}`}
            </sub>
          </div>
          <sub className="text leading-tight" color={isRecommended ? undefined : 'dimmed'}>
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </sub>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <sup data-active={isRecommended} className="text text-[18px] mt-[-8px] leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
          {getCurrencySymbol(currency)}
        </sup>
        <span className="text text-[48px] leading-none" style={{ lineHeight: 1 }}>
          {formatCurrencyWithoutSymbol(unit_amount! / 100)}
        </span>
        <sub data-active={isRecommended} className="text text-[18px] mb-[-8px] leading-none data-[active=false]:text-neutral-400 dark:data-[active=false]:text-neutral-400">
          {`/ ${intervalCount > 1 ? `${intervalCount} ` : ''}${recurringLabel}`}
        </sub>
      </div>
    );
  }

  return 'Unable to resolve pricing';
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

  const rows = new Array(features.length + 2).fill(1).map((_, index) => {
    const columns = visibleProducts.map((prod) => {
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
        const queryParams: Record<string, string> = {
          widget_id: widget,
          product_id: dev ? prod.mask! : prod.id,
          price_id: dev ? priceToShow.mask! : priceToShow.id,
          currency: currency || priceToShow.currency,
          payment_type: type,
        };
        const queryString = generateQueryString(queryParams);
        return `${callbackUrl}?${queryString}`;
      };

      switch (index) {
        // pricing
        case 0:
          return (
            <td key={prod.id} data-active={isRecommended} className={`align-top py-2 px-4 ${CELL_STYLES[color]}`}>
              <div className="flex flex-col items-center gap-4 py-4 h-full">
                <span className="text text-[32px]">{prod.name}</span>
                {isCustom ? <span className="text mt-auto whitespace-break-spaces">{prod.description}</span> : null}
                {
                  !isCustom
                    ? resolvePricing({ price: priceToShow, unitLabel, currency, isRecommended })
                    : null
                }
              </div>
            </td>
          );
        // CTA
        case features.length + 1: {
          return (
            <td key={prod.id} data-active={isRecommended} className={`text-center py-2 px-4 ${CELL_STYLES[color]}`}>
              <a href={resolveBtnUrl()} className="block">
                <Button
                  data-spaced={hasFreeTrial}
                  className={`mt-8 mb-8 data-[spaced=true]:mb-4 uppercase ${isRecommended ? BUTTON_STYLES[color] : OUTLINE_BUTTON_STYLES[color]}`}
                  variant="undecorated"
                >
                  {resolveBtnLabel()}
                </Button>
              </a>
              <RenderIf condition={hasFreeTrial}>
                <div className="mb-6">
                  <span className="text text-sm">{freeTrialDays} days</span>
                </div>
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
                label = <span className="text"><span className="text font-bold">{value}</span>{` ${feature.name}`}</span>;
                break;
              default:
                break;
            }
          }

          return (
            <td
              key={`prod-${prod.id}-feature-${4}`}
              data-active={isRecommended}
              className={`py-2 px-4 text-center ${ACTIVE_CELL_STYLES[color]}`}
            >
              {label}
            </td>
          );
        }
      }
    });

    return (
      <tr key={index} className="group">{columns}</tr>
    );
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <RenderIf condition={billingIntervals.length > 1}>
        <Tabs
          value={currentInterval}
          onValueChange={setCurrentInterval as any}
          className="mx-auto mb-8"
        >
          <TabsList>
            {billingIntervals.map((interval) => (
              <TabsTrigger key={interval.value} value={interval.value}>{interval.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </RenderIf>
      <div className="relative mt-2 ml-9">
        <table
          className="table-fixed border-collapse border border-slate-200 dark:border-slate-700"
          style={{ width: `${visibleProducts.length * 300}px` }}
        >
          <tbody>{rows}</tbody>
        </table>
        <PoweredBy color={color} position="left" style={{ left: -31, top: 153 }} />
      </div>
    </div>
  );
}
