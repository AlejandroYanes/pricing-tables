/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActionIcon, Alert, Anchor, Group, LoadingOverlay, MantineProvider, Select, Stack, Tabs, Text, Tooltip } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconAlertTriangle, IconArrowBarToLeft, IconArrowBarToRight, IconInfoCircle } from '@tabler/icons';
import { RenderIf } from 'ui';
import { templatesMap } from 'templates';

import { trpc } from 'utils/trpc';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import ProductsForm from 'features/form/ProductsForm';
import VisualsForm from 'features/form/VisualsForm';
import SettingsForm from 'features/form/SettingsForm';
import FeaturesForm from 'features/form/FeaturesForm';
import IntegrationPanel from 'features/form/IntegrationPanel';
import type { PageTabs } from 'features/form/state';
import { usePageStates } from 'features/form/state';
import { fetchWidget } from 'features/form/state/actions';

const tabsStyles = { tabsList: { borderBottomWidth: '1px' }, tab: { borderBottomWidth: '1px', marginBottom: '-1px' } };

const currencyTooltip = `
Select a currency to preview the prices in.
If no currency is selected, or your price object does not have a specification for it,
prices will be displayed in the default currency of your Stripe account.
Keep in mind this is only a preview mode, if you want to show the widget in a specific currency,
please check the Integration panel for how to.
`;

const errorScreen = (
  <BaseLayout>
    <Stack mt={60} justify="center" align="center">
      <Alert title="Ooops..." variant="outline" color="gray">
        Seems like {`you're`} lost, {`there's`} nothing here to see.
        Please go back to the {' '}
        <Anchor component="span" color="teal" weight="bold">
          <Link href="/dashboard">
            Dashboard
          </Link>
        </Anchor>
        {' '}
        and start creating.
      </Alert>
    </Stack>
  </BaseLayout>
);

const FormPage = () => {
  const colorScheme = useColorScheme();

  const { query } = useRouter();

  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentTab, setCurrentTab] = useState<PageTabs>('products');
  const [showPanel, setShowPanel] = useState(true);
  const [selectedEnv, setSelectedEnv] = useState<string>('development');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  const {
    selectedProducts,
    features,
    callbacks,
    template: templateId,
    name,
    color,
    recommended,
    unitLabel,
    subscribeLabel,
    freeTrialLabel,
  } = usePageStates();

  const { data } = trpc.stripe.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    // enabled: isLoaded,
  });
  // const data = mockProducts as any;
  const productsList = data || [];

  // useTrackAndSave({
  //   selectedProducts,
  //   features,
  //   color,
  //   name,
  //   template: templateId,
  //   recommended,
  //   subscribeLabel,
  //   freeTrialLabel,
  //   usesUnitLabel,
  //   unitLabel,
  //   callbacks,
  //   successUrl,
  //   cancelUrl,
  //   widgetId: query.id as string,
  // }, isLoaded);

  useEffect(() => {
    if (query.id && !isStarted) {
      setIsStarted(true);
      fetchWidget(query.id as string)
        .then(() => {
          setIsLoaded(true);
        })
        .catch(() => {
          setIsError(true);
        });
    }
  }, [query.id]);

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

  const handleAPIError = () => {
    modals.open({
      centered: true,
      withCloseButton: false,
      children:(
        <Stack>
          <IconAlertTriangle color="orange" size={60} style={{ margin: '0 auto' }} />
          <Text>
            There was an error while saving your changes, please do not make any more changes.
            First, try to refresh the page and check your network connection.
            If the problem still persist, <Anchor color="orange" href="mailto: alejandro.yanes94@gmail.com">contact us</Anchor>.
          </Text>
        </Stack>
      ),
    });
  };

  if (isError) {
    return errorScreen;
  }

  const Template = templateId ? templatesMap[templateId]! : () => null;

  const template = (
    <>
      <Group align="center" position="apart" mb="xl">
        <ActionIcon mb={4} onClick={() => setShowPanel(!showPanel)}>
          <RenderIf condition={showPanel} fallback={<IconArrowBarToRight />}>
            <IconArrowBarToLeft />
          </RenderIf>
        </ActionIcon>
        <Group align="flex-end" mb="xl">
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
              value={selectedCurrency}
              onChange={setSelectedCurrency}
            />
          </RenderIf>
          <Select
            label={
              <Tooltip
                transitionProps={{ duration: 200 }}
                label="Select an enviromment to preview the callback URLs."
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
            value={selectedEnv}
            onChange={(value) => setSelectedEnv(value!)}
          />
        </Group>
      </Group>
      <RenderIf condition={hasSeveralPricesWithSameInterval}>
        <Alert title="Regarding prices and intervals" variant="outline" color="orange" mb="xl">
          We currently only show one price per interval, taking the first one from the list.
          This is a limitation of the current API and we plan to address it in the future.
        </Alert>
      </RenderIf>
      <Template
        dev
        widget={query.id}
        features={features}
        products={selectedProducts}
        recommended={recommended}
        unitLabel={unitLabel}
        color={color}
        subscribeLabel={subscribeLabel}
        freeTrialLabel={freeTrialLabel}
        callbacks={callbacks}
        environment={selectedEnv}
        currency={selectedCurrency}
      />
    </>
  );

  return (
    <>
      <Head>
        <title>Dealo | Form</title>
      </Head>
      <BaseLayout showBackButton title={name}>
        <MantineProvider theme={{ primaryColor: color, colorScheme }}>
          <Tabs
            value={currentTab}
            onTabChange={setCurrentTab as any}
            mb="xl"
            styles={tabsStyles}
          >
            <Tabs.List>
              <Tabs.Tab value="products">Products</Tabs.Tab>
              <Tabs.Tab value="features">Features</Tabs.Tab>
              <Tabs.Tab value="visuals">Visuals</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
              <Tabs.Tab value="integration">Integration</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Group align="flex-start" style={{ minHeight: 'calc(100vh - 170px)' }}>
            <RenderIf condition={currentTab === 'products'}>
              <ProductsForm showPanel={showPanel} template={template} products={productsList} />
            </RenderIf>
            <RenderIf condition={currentTab === 'visuals'}>
              <VisualsForm showPanel={showPanel} template={template}/>
            </RenderIf>
            <RenderIf condition={currentTab === 'features'}>
              <FeaturesForm />
            </RenderIf>
            <RenderIf condition={currentTab === 'settings'}>
              <SettingsForm showPanel={showPanel} template={template} widgetId={query.id as string} />
            </RenderIf>
            <RenderIf condition={currentTab === 'integration'}>
              <IntegrationPanel widgetId={query.id as string} />
            </RenderIf>
          </Group>
          <RenderIf condition={!isLoaded}>
            <LoadingOverlay visible overlayBlur={2} />
          </RenderIf>
        </MantineProvider>
      </BaseLayout>
    </>
  );
};

export default authGuard(FormPage);
