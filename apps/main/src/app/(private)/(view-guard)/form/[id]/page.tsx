/* eslint-disable max-len */
'use client'

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { RenderIf, Alert, AlertTitle, AlertDescription, Tabs, TabsList, TabsTrigger, Loader } from '@dealo/ui';
import { IconAlertCircle } from '@tabler/icons-react';

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
  <BaseLayout showBackButton backRoute="/dashboard">
    <div className="flex flex-col justify-center items-center mt-16">
      <Alert>
        <IconAlertCircle size="1rem" />
        <AlertTitle>Oops....</AlertTitle>
        <AlertDescription>
          Something happened and we {`can't`} show any information right now.
          Please go back to the {' '}
          <Link href="/dashboard" className="">
            Dashboard
          </Link>
          . If this problem persists, please contact us.
        </AlertDescription>
      </Alert>
    </div>
  </BaseLayout>
);

const LoadingScreen = () => {
  return (
    <BaseLayout showBackButton backRoute="/dashboard">
      <div className="flex flex-col" style={{ height: 'calc(100vh - 170px)', width: 'calc(100vw - 96px)' }}>
        <div className="flex items-center justify-between h-[49px] mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
          <Tabs value="products">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="visuals">Visuals</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Loader className="mt-16 mx-auto" />
      </div>
    </BaseLayout>
  );
}

interface Props {
  params: {
    id: string;
  };
}

const FormPage = (props: Props) => {
  const { params: { id: widgetId } } = props;

  const startedFirstCall = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [failedToFetchWidgetInfo, setFailedToFetchWidgetInfo] = useState(false);

  const [currentTab, setCurrentTab] = useState<FormTabs>('products');
  const [showPanel, setShowPanel] = useState(true);
  const [selectedEnv, setSelectedEnv] = useState<string>('development');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  const { name, template, productCount } = useFormPageStates();

  useEffect(() => {
    if (widgetId && !startedFirstCall.current) {
      startedFirstCall.current = true;
      fetchWidget(widgetId)
        .then(() => {
          setIsLoaded(true);
        })
        .catch(() => {
          setFailedToFetchWidgetInfo(true);
        });
    }
  }, [widgetId]);

  if (failedToFetchWidgetInfo) {
    return errorScreen;
  }

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  const templateNode = (
    <Template
      widgetId={widgetId as string}
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
      <BaseLayout showBackButton backRoute="/dashboard" title={name}>
        <div className="flex items-center justify-between h-[49px] mb-6 pb-2 border-b border-neutral-200 dark:border-gray-800">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab as any}
          >
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="visuals">Visuals</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
          </Tabs>
          <SaveButton enabled={isLoaded} />
        </div>
        <div className="flex items-stretch min-h-[calc(100vh-170px)]">
          <RenderIf condition={currentTab === 'products'}>
            <ProductsForm showPanel={showPanel} template={templateNode} />
          </RenderIf>
          <RenderIf condition={currentTab === 'visuals'}>
            <VisualsForm showPanel={showPanel} template={templateNode}/>
          </RenderIf>
          <RenderIf condition={currentTab === 'features'}>
            <FeaturesForm />
          </RenderIf>
          <RenderIf condition={currentTab === 'settings'}>
            <SettingsForm showPanel={showPanel} template={templateNode} widgetId={widgetId} />
          </RenderIf>
          <RenderIf condition={currentTab === 'integration'}>
            <IntegrationPanel widgetId={widgetId} templateId={template} productCount={productCount} />
          </RenderIf>
        </div>
      </BaseLayout>
    </>
  );
};

export default FormPage;
