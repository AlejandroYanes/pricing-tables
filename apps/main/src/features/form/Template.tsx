import { useMemo, useState } from 'react';
import { ActionIcon, Alert, Center, Group, SegmentedControl, Select, Stack, Text, Tooltip } from '@mantine/core';
import { IconArrowBarToLeft, IconArrowBarToRight, IconDeviceDesktop, IconDeviceMobile, IconInfoCircle } from '@tabler/icons';
import { templatesMap, mockTemplate } from 'templates';
import { RenderIf } from 'ui';

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
  const { render: WidgetTemplate } = templateId ? templatesMap[templateId]! : mockTemplate;

  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  const hasSeveralPricesWithSameInterval = useMemo(() => {
    const productsWithMultipleIntervalsPerPrice = selectedProducts.filter((prod) => {
      const intervals = prod.prices
        .filter((price) => price.isSelected)
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
      <Group align="center" position="apart" mb="xl">
        <ActionIcon mb={4} onClick={() => setShowPanel(!showPanel)}>
          <RenderIf condition={showPanel} fallback={<IconArrowBarToRight />}>
            <IconArrowBarToLeft />
          </RenderIf>
        </ActionIcon>
        <Group align="flex-end" mb="xl">
          <Stack spacing={0}>
            <Text size="sm" weight="bold">View</Text>
            <SegmentedControl
              size="xs"
              styles={{ label: { padding: '2px 4px' } }}
              value={view}
              data={[
                { label: (
                  <Center>
                    <IconDeviceDesktop />
                  </Center>
                ), value: 'desktop' },
                { label: (
                  <Center>
                    <IconDeviceMobile />
                  </Center>
                ), value: 'mobile' },
              ]}
              onChange={setView as any}
            />
          </Stack>
          <RenderIf condition={currencies.length > 1}>
            <Select
              clearable
              label={
                <Tooltip
                  transitionProps={{ duration: 200 }}
                  label={currencyTooltip}
                  width={280}
                  position="right"
                  multiline
                  withArrow
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Currency</span>
                    <IconInfoCircle size={14} style={{ marginLeft: '4px' }} />
                  </div>
                </Tooltip>
              }
              data={currencies}
              value={currency}
              onChange={setCurrency}
            />
          </RenderIf>
          <Select
            label={
              <Tooltip
                transitionProps={{ duration: 200 }}
                label="Select an environment to preview the callback URLs."
                width={280}
                position="right"
                multiline
                withArrow
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>Callback env</span>
                  <IconInfoCircle size={14} style={{ marginLeft: '4px' }} />
                </div>
              </Tooltip>
            }
            disabled={selectedProducts.length === 0}
            data={callbacks.map((cb) => cb.env)}
            value={env}
            onChange={(value) => setEnv(value!)}
          />
        </Group>
      </Group>
      <RenderIf condition={hasSeveralPricesWithSameInterval}>
        <Alert title="Regarding prices and intervals" variant="outline" color="orange" mb="xl">
          We currently only show one price per interval, taking the first one from the list.
          This is a limitation of the current API and we plan to address it in the future.
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
        isMobile={view === 'mobile'}
      />
    </>
  );
}
