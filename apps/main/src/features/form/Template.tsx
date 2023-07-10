import { useMemo } from 'react';
import { IconArrowBarToLeft, IconArrowBarToRight, IconInfoCircle } from '@tabler/icons-react';
import { templatesMap } from '@dealo/templates';
import { RenderIf } from '@dealo/ui';

import { Button } from 'components/ui/button';
import { Alert, AlertTitle, AlertDescription } from 'components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'components/ui/tooltip';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from 'components/ui/select';
import { useTemplateStates } from './state';

interface Props {
  widgetId: string;
  showPanel: boolean;
  setShowPanel: (value: boolean) => void;
  currency: string | null;
  setCurrency: (value: string | null) => void;
  env: string;
  setEnv: (value: string) => void;
}

const currencyTooltip = `
Select a currency to preview the prices in.
If no currency is selected, or your price object does not have a specification for it,
prices will be displayed in the default currency of your Stripe account.
Keep in mind this is only a preview mode, if you want to show the widget in a specific currency,
please check the Integration panel for how to.
`;

export default function Template(props: Props) {
  const { widgetId, showPanel, setShowPanel, currency, setCurrency, env, setEnv } = props;
  const {
    template: templateId,
    products: selectedProducts,
    features,
    callbacks,
    recommended,
    unitLabel,
    subscribeLabel,
    freeTrialLabel,
    color,
  } = useTemplateStates();
  const WidgetTemplate = templateId ? templatesMap[templateId]! : () => null;

  const hasSeveralPricesWithSameInterval = useMemo(() => {
    const productsWithMultipleIntervalsPerPrice = selectedProducts.filter((prod) => {
      const intervals = prod.prices
        .map((price) => {
          if (price.type === 'one_time') {
            return 'one_time';
          }

          if (price.recurring!.interval_count !== 1) {
            return `${price.recurring!.interval}_${price.recurring!.interval_count}`;
          }
          return price.recurring!.interval;
        })
        .filter((int) => !!int);
      const uniqueIntervals = new Set(intervals);

      return uniqueIntervals.size !== intervals.length;
    });
    return productsWithMultipleIntervalsPerPrice.length > 0;
  }, [selectedProducts]);

  const currencies = useMemo(() => {
    const currencies = selectedProducts.reduce((acc, prod) => {
      const currencyOptions = prod.prices
        .map((price) => price.currency_options)
        .filter((option) => !!option)
        .map((option) => Object.keys(option!)).flat();
      return acc.concat(currencyOptions);
    }, [] as string[]);
    return Array.from(new Set(currencies)).map((currency: string) => ({ label: currency.toUpperCase(), value: currency }));
  }, [selectedProducts]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" className="h-8 px-1" onClick={() => setShowPanel(!showPanel)}>
          <RenderIf condition={showPanel} fallback={<IconArrowBarToRight />}>
            <IconArrowBarToLeft />
          </RenderIf>
        </Button>
        <div className="flex items-end gap-6 mb-6">
          <RenderIf condition={currencies.length > 1}>
            <div className="flex flex-col gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center">
                      <span>Currency</span>
                      <IconInfoCircle size={14} style={{ marginLeft: '4px' }} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="start" className="w-[280px]">{currencyTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Select
                value={currency || undefined}
                onValueChange={setCurrency}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </RenderIf>
          <div className="flex flex-col gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center">
                    <span>Environment</span>
                    <IconInfoCircle size={14} style={{ marginLeft: '4px' }} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" align="start" className="w-[280px]">
                  Select an environment to preview the callback URLs.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select
              disabled={selectedProducts.length === 0}
              value={env}
              onValueChange={setEnv}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {callbacks.map((cb) => (
                  <SelectItem key={cb.env} value={cb.env}>
                    {cb.env}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <RenderIf condition={hasSeveralPricesWithSameInterval}>
        <Alert className="mb-24 mx-auto max-w-2xl">
          <AlertTitle>Regarding prices and intervals</AlertTitle>
          <AlertDescription>
            We currently only show one price per interval, taking the first one from the list.
            This is a limitation of the current API and we plan to address it in the future.
          </AlertDescription>
        </Alert>
      </RenderIf>
      <WidgetTemplate
        dev
        widget={widgetId}
        features={features}
        products={selectedProducts}
        recommended={recommended}
        unitLabel={unitLabel}
        color={color}
        subscribeLabel={subscribeLabel}
        freeTrialLabel={freeTrialLabel}
        callbacks={callbacks}
        environment={env}
        currency={currency}
      />
    </>
  );
}
