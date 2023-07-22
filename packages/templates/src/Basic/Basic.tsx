/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { FormPrice } from '@dealo/models';
import { RenderIf, PoweredBy, Tabs, TabsList, TabsTrigger, Button } from '@dealo/ui';
import { generateQueryString } from '@dealo/helpers';

import type { TemplateProps, Interval } from '../constants/types';
import { resolveBillingIntervals } from './utils/resolve-billing-intervals';
import { filterProductsByInterval } from './utils/filter-produts-by-interval';
import { resolvePriceToShow } from './utils/resolve-price-to-show';
import { resolvePricing } from './utils/resolve-pricing';
import { resolveFeaturesForProduct } from './utils/resolve-features-for-product';

// const useStyles = createStyles((theme, color: string) => ({
//   productCard: {
//     position: 'relative',
//     boxSizing: 'border-box',
//     border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[4]}`,
//     padding: '48px 32px 24px',
//     borderRadius: '4px',
//     width: '300px',
//   },
//   activeProductCard: {
//     border: `1px solid ${theme.colors![color]![5]}`,
//     width: '300px',
//   },
//   wideCard: {
//     width: 'auto',
//   },
// }));

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
  } = props;
  // const { classes, cx } = useStyles(color);

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
    <div className="flex flex-col items-center">
      <RenderIf condition={billingIntervals.length > 1}>
        <Tabs
          value={currentInterval}
          onValueChange={setCurrentInterval as any}
        >
          <TabsList>
            {billingIntervals.map((interval) => (
              <TabsTrigger key={interval.value} value={interval.value}>{interval.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </RenderIf>
      <div className="grid justify-items-center box-border gap-4" style={{ gridTemplateColumns: `repeat(${visibleProducts.length}, 1fr)` }}>
        {visibleProducts.map((prod, index) => {
          const isFirst = index === 0;

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

          return (
            <div
              data-active={isRecommended}
              data-wide={!!unitLabel}
              className="flex flex-col items-center relative box-border border border-slate-200 dark:border-slate-800 pt-16 px-8 pb-8 rounded-md w-72 data-[active=true]:border-emerald-500 dark:data-[active=true]:border-emerald-500 data-[wide=true]:w-auto"
              key={prod.id}
            >
              <span
                data-active={isRecommended}
                className="mb-4 text slate-900 dark:text-slate-100 font-bold data-[active=true]:text-emerald-500 dark:data-[active=true]:text-emerald-500"
              >
                {prod.name}
              </span>
              <RenderIf condition={!isCustom}>
                <span
                  data-active={isRecommended}
                  className="mb-4 text text-center slate-900 dark:text-slate-100 font-bold text-2xl data-[active=true]:text-emerald-500 dark:data-[active=true]:text-emerald-500"
                >
                  {!isCustom ? resolvePricing({ price: priceToShow, unitLabel, currency }) : null}
                </span>
              </RenderIf>
              <span className="text text-center mb-4">{prod.description}</span>
              <div className="flex flex-col items-center mt-auto">
                <RenderIf condition={hasFreeTrial}>
                  <span className="text text-slate-400 mb-4">With a {freeTrialDays} {freeTrialDays! > 1 ? 'days' : 'day'} free trial</span>
                </RenderIf>
                <Link href={resolveBtnUrl()}>
                  <Button color={color} variant={isRecommended ? 'default' : 'outline'}>
                    {resolveBtnLabel()}
                  </Button>
                </Link>
              </div>
              <RenderIf condition={isFirst}>
                <PoweredBy top={170} left={-27} color={color} position="left" />
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
