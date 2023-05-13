/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Alert, Anchor, Group, Loader, MantineProvider, Stack, Tabs, useMantineTheme } from '@mantine/core';
import { RenderIf } from 'ui';

import { trpc } from 'utils/trpc';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import ProductsForm from 'features/form/ProductsForm';
import VisualsForm from 'features/form/VisualsForm';
import SettingsForm from 'features/form/SettingsForm';
import FeaturesForm from 'features/form/FeaturesForm';
import IntegrationPanel from 'features/form/IntegrationPanel';
import Template from 'features/form/Template';
import type { FormTabs } from 'features/form/state';
import { useFormPageStates } from 'features/form/state';
import { fetchWidget } from 'features/form/state/actions';
import SaveButton from 'features/form/SaveButton';

const errorScreen = (
  <BaseLayout showBackButton>
    <Stack mt={60} justify="center" align="center">
      <Alert title="Ooops..." variant="outline" color="gray">
        Something happened and we {`can't`} show any information right now.
        Please go back to the {' '}
        <Anchor component="span" color="teal" weight="bold">
          <Link href="/dashboard">
            Dashboard
          </Link>
        </Anchor>
        . If this problem persists, please contact us.
      </Alert>
    </Stack>
  </BaseLayout>
);

const noStripeScreen = (
  <BaseLayout showBackButton>
    <Stack mt={60} justify="center" align="center">
      <Alert title="Ooops..." variant="outline" color="gray">
        Something happened and we {`can't`} connect with Stripe, please try again later.
      </Alert>
    </Stack>
  </BaseLayout>
);

const LoadingScreen = () => {
  const theme = useMantineTheme();
  return (
    <BaseLayout showBackButton>
      <Stack style={{ height: 'calc(100vh - 170px)', width: 'calc(100vw - 96px)' }}>
        <Group
          mb="xl"
          pb="sm"
          align="center"
          position="apart"
          style={{
            height: '49px',
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[3]}`,
          }}
        >
          <Tabs
            variant="pills"
            color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
            value="products"
          >
            <Tabs.List>
              <Tabs.Tab value="products">Products</Tabs.Tab>
              <Tabs.Tab value="features">Features</Tabs.Tab>
              <Tabs.Tab value="visuals">Visuals</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
              <Tabs.Tab value="integration">Integration</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Group>
        <Loader size="xl" mt={60} mx="auto" />
      </Stack>
    </BaseLayout>
  );
}

const FormPage = () => {
  const theme = useMantineTheme();

  const { query } = useRouter();

  const startedFirstCall = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [failedToFetchWidgetInfo, setFailedToFetchWidgetInfo] = useState(false);

  const [currentTab, setCurrentTab] = useState<FormTabs>('products');
  const [showPanel, setShowPanel] = useState(true);
  const [selectedEnv, setSelectedEnv] = useState<string>('development');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  const { name, color } = useFormPageStates();

  const {
    data,
    isFetching: isFetchingStripeProducts,
    isError: failedToFetchStripeProducts,
  } = trpc.stripe.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: isLoaded,
  });
  const productsList = data || [];

  useEffect(() => {
    if (query.id && !startedFirstCall.current) {
      startedFirstCall.current = true;
      fetchWidget(query.id as string)
        .then(() => {
          setIsLoaded(true);
        })
        .catch(() => {
          setFailedToFetchWidgetInfo(true);
        });
    }
  }, [query.id]);

  if (failedToFetchWidgetInfo) {
    return errorScreen;
  }

  if (failedToFetchStripeProducts) {
    return noStripeScreen;
  }

  if (!isLoaded || isFetchingStripeProducts) {
    return <LoadingScreen />;
  }

  const templateNode = (
    <Template
      widgetId={query.id as string}
      showPanel={showPanel}
      setShowPanel={setShowPanel}
      currency={selectedCurrency}
      setCurrency={setSelectedCurrency}
      env={selectedEnv}
      setEnv={setSelectedEnv}
    />
  );

  return (
    <>
      <Head>
        <title>Dealo | Form</title>
      </Head>
      <BaseLayout showBackButton title={name}>
        <MantineProvider theme={{ primaryColor: color, colorScheme: theme.colorScheme }}>
          <Group
            mb="xl"
            pb="sm"
            align="center"
            position="apart"
            style={{
              height: '49px',
              borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[3]}`,
            }}
          >
            <Tabs
              variant="pills"
              color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
              value={currentTab}
              onTabChange={setCurrentTab as any}
            >
              <Tabs.List>
                <Tabs.Tab value="products">Products</Tabs.Tab>
                <Tabs.Tab value="features">Features</Tabs.Tab>
                <Tabs.Tab value="visuals">Visuals</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
                <Tabs.Tab value="integration">Integration</Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <SaveButton enabled={isLoaded} />
          </Group>
          <Group align="flex-start" style={{ minHeight: 'calc(100vh - 170px)' }}>
            <RenderIf condition={currentTab === 'products'}>
              <ProductsForm showPanel={showPanel} template={templateNode} products={productsList} />
            </RenderIf>
            <RenderIf condition={currentTab === 'visuals'}>
              <VisualsForm showPanel={showPanel} template={templateNode}/>
            </RenderIf>
            <RenderIf condition={currentTab === 'features'}>
              <FeaturesForm />
            </RenderIf>
            <RenderIf condition={currentTab === 'settings'}>
              <SettingsForm showPanel={showPanel} template={templateNode} widgetId={query.id as string} />
            </RenderIf>
            <RenderIf condition={currentTab === 'integration'}>
              <IntegrationPanel widgetId={query.id as string} />
            </RenderIf>
          </Group>
        </MantineProvider>
      </BaseLayout>
    </>
  );
};

export default authGuard(FormPage);
