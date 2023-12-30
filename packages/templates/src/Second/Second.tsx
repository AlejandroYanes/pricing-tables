/* eslint-disable max-len */
import type { ReactNode } from 'react';
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
            <td key={prod.id} data-active={isRecommended} className={`align-top py-2 px-4 ${CELL_STYLES[color]}`}>
              <div className="flex flex-col items-center gap-4 py-4 h-full">
                <span className="text text-[32px]">{prod.name}</span>
                {
                  isCustom
                    ? <span className="text text-center mt-auto whitespace-break-spaces">{prod.description}</span>
                    : null
                }
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
              })} className="block">
                <Button
                  data-spaced={hasFreeTrial}
                  className={`mt-8 mb-8 data-[spaced=true]:mb-4 uppercase ${isRecommended ? BUTTON_STYLES[color] : OUTLINE_BUTTON_STYLES[color]}`}
                  variant="undecorated"
                >
                  {resolveBtnLabel({ type, prod, isCustom: !!isCustom, hasFreeTrial, freeTrialLabel, subscribeLabel })}
                </Button>
              </a>
              <RenderIf condition={hasFreeTrial}>
                <div className="mb-6">
                  <span data-active={isRecommended} className="text text-sm text-slate-500 data-[active=true]:text-white">With a {freeTrialDays} days free trial</span>
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
    <div data-el="template__root" className="flex flex-col items-center gap-4">
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
      <div data-el="template__content" className="relative m-1 ml-9">
        <table
          className="table-fixed border-collapse border border-slate-200 dark:border-slate-700"
          style={{ width: `${visibleProducts.length * 300}px` }}
        >
          <tbody>{rows}</tbody>
        </table>
        <PoweredBy color={color} position="left" style={{ left: -31, top: 168 }} />
      </div>
    </div>
  );
}
