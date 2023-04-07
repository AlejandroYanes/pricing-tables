/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type Stripe from 'stripe';
import { ActionIcon, Alert, Anchor, Group, LoadingOverlay, MantineProvider, Select, Stack, Tabs, Tooltip } from '@mantine/core';
import { useColorScheme, useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import type { DropResult } from 'react-beautiful-dnd';
import { IconArrowBarToLeft, IconArrowBarToRight, IconDeviceDesktop, IconDeviceMobile, IconInfoCircle } from '@tabler/icons';
import { RenderIf } from 'ui';
import { BasicTemplate } from 'templates';
import type { CTACallback, FormFeature, FeatureType, FormProduct } from 'models';

import { api } from 'utils/api';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import ProductsForm from 'features/form/ProductsForm';
import VisualsForm from 'features/form/VisualsForm';
import SettingsForm from 'features/form/SettingsForm';
import FeaturesForm from 'features/form/FeaturesForm';

type Tabs = 'products' | 'features' | 'visuals' | 'settings';

const tabsStyles = { tabsList: { borderBottomWidth: '1px' }, tab: { borderBottomWidth: '1px', marginBottom: '-1px' } };

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
  const { data: widgetInfo, isLoading: isFetchingWidgetInfo, isError } = api.widgets.fetchInfo.useQuery(query.id as string, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const { data } = api.products.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: isFetchingWidgetInfo,
  });
  // const data: any = mockProducts;
  const productsList = data || [];

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tabs>('products');
  const [showPanel, setShowPanel] = useState(true);

  const [selectedProducts, productHandlers] = useListState<FormProduct>([]);

  const [features, featureHandlers] = useListState<FormFeature>([]);

  const [color, setColor] = useState<string>('teal');

  const [recommended, setRecommended] = useState<string | null>(null);
  const [subscribeLabel, setSubscribeLabel] = useState('Subscribe');
  const [freeTrialLabel, setFreeTrialLabel] = useState('Start free trial');
  const [usesUnitLabel, setUsesUnitLabel] = useState(false);
  const [unitLabel, setUnitLabel] = useState<string | null>(null);
  const [callbacks, callbackHandlers] = useListState<CTACallback>([
    { env: 'development', url: '' },
    { env: 'production', url: '' },
  ]);

  const [selectedEnv, setSelectedEnv] = useState<string>('development');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  useEffect(() => {
    if (!isFetchingWidgetInfo && widgetInfo) {
      productHandlers.setState(widgetInfo!.products);
      featureHandlers.setState(widgetInfo!.features);
      setColor(widgetInfo!.color);
      setRecommended(widgetInfo!.recommended);
      setSubscribeLabel(widgetInfo!.subscribeLabel);
      setFreeTrialLabel(widgetInfo!.freeTrialLabel);
      setUsesUnitLabel(widgetInfo!.usesUnitLabel);
      setUnitLabel(widgetInfo!.unitLabel);
      callbackHandlers.setState(widgetInfo!.callbacks);
      setSelectedCurrency(widgetInfo!.currency);
      setIsLoaded(true);
    }
  }, [isFetchingWidgetInfo, widgetInfo]);

  const hasSeveralPricesWithSameInterval = useMemo(() => {
    const productsWithMultipleIntervalsPerPrice = selectedProducts.filter((prod) => {
      const intervals = prod.prices.map((price) => price.recurring?.interval);
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

  const handleAddProduct = (selectedId: string) => {
    const [productId, priceId] = selectedId.split('-');
    // @ts-ignore
    const selectedProduct = data!.find((prod) => prod.id === productId);
    // @ts-ignore
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    const copy = { ...selectedProduct, prices: [{ ...selectedPrice }], features: [] };
    productHandlers.append(copy);
  };

  const handleAddCustomProduct = () => {
    const hasCustomProduct = selectedProducts.some((prod) => prod.isCustom);

    if (hasCustomProduct) {
      showNotification({
        message: 'There is already a custom product',
      });
      return;
    }

    const customProduct: Partial<FormProduct> = {
      id: 'custom',
      object: 'product',
      isCustom: true,
      active: true,
      name: 'Custom Product',
      description: 'Custom product are used to present an extra option for users to contact the sales team',
      prices: [],
      ctaLabel: 'Contact Us',
      ctaUrl: ''
    };
    productHandlers.append(customProduct as FormProduct);
  };

  const handleRemoveProduct = (index: number) => {
    productHandlers.remove(index);
    if (selectedProducts.length === 1) {
      setRecommended(null);
    }
  };

  const handleAddPrice = (productId: string, price: Stripe.Price) => {
    const selectedProduct = selectedProducts!.find((prod) => prod.id === productId);

    if (!selectedProduct) return;

    const prodCopy = { ...selectedProduct!, prices: selectedProduct.prices.concat([{ ...price }]) };
    productHandlers.setState(selectedProducts.map((prod) => {
      if (prod.id === productId) {
        return prodCopy;
      }

      return prod;
    }));
  };

  const handleRemovePrice = (productId: string, priceId: string) => {
    const selectedProduct = selectedProducts!.find((prod) => prod.id === productId);
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    const prodCopy = { ...selectedProduct!, prices: selectedProduct.prices.filter((price) => price.id !== priceId) };
    productHandlers.setState(selectedProducts.map((prod) => {
      if (prod.id === productId) {
        return prodCopy;
      }

      return prod;
    }));
  };

  const handleToggleFreeTrial = (productId: string, priceId: string) => {
    const selectedProduct = selectedProducts!.find((prod) => prod.id === productId);
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    selectedPrice.hasFreeTrial = !selectedPrice.hasFreeTrial;

    if (!selectedPrice.freeTrialDays) selectedPrice.freeTrialDays = 7;

    productHandlers.setState(selectedProducts.map((prod) => {
      if (prod.id === productId) {
        return selectedProduct;
      }

      return prod;
    }));
  };

  const handleChangeFreeTrialDays = (productId: string, priceId: string, days: number) => {
    const selectedProduct = selectedProducts!.find((prod) => prod.id === productId);
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    selectedPrice.freeTrialDays = days ?? 1;

    productHandlers.setState(selectedProducts.map((prod) => {
      if (prod.id === productId) {
        return selectedProduct;
      }

      return prod;
    }))
  };

  const handleCustomCTALabelChange = (index: number, nextLabel: string) => {
    productHandlers.setItemProp(index, 'ctaLabel', nextLabel);
  };

  const handleCustomCTAUrlChange = (index: number, nextUrl: string) => {
    productHandlers.setItemProp(index, 'ctaUrl', nextUrl);
  };

  const handleCustomDescriptionChange = (index: number, nextDescription: string) => {
    productHandlers.setItemProp(index, 'description', nextDescription);
  };

  const handleUnitLabelToggle = () => {
    console.log('handleUnitLabelToggle');
    setUsesUnitLabel(!usesUnitLabel);
    setUnitLabel(!usesUnitLabel ? 'units' : null);
  };

  const handleUnitLabelChange = (nextUnit: string) => {
    setUnitLabel(nextUnit);
  };

  const handleAddNewFeature = () => {
    const nextFeature: FormFeature = {
      id: `${Date.now()}`,
      name: 'test',
      type: 'boolean',
      products: selectedProducts.map((prod) => ({ id: prod.id, value: 'false' })),
    };
    featureHandlers.append(nextFeature);
  };

  const handleDeleteFeature = (featureIndex: number) => {
    featureHandlers.remove(featureIndex);
  };

  const handleFeatureLabelUpdate = (featureIndex: number, nextLabel: string) => {
    featureHandlers.setItemProp(featureIndex, 'name', nextLabel);
  };

  const handleFeatureTypeUpdate = (featureIndex: number, nextType: FeatureType) => {
    const initialValue: Record<FeatureType, string> = { string: '', compose: '', boolean: 'false' };
    const feature = features.at(featureIndex)!;
    featureHandlers.setItem(featureIndex, {
      ...feature,
      type: nextType,
      products: feature.products.map((prod) => ({ ...prod, value: initialValue[nextType] })),
    });
  };

  const handleFeatureValueChange = (featureIndex: number, productId: string, value: string) => {
    const feature = features.at(featureIndex)!;
    const product = feature.products.find((prod) => prod.id === productId);

    if (product) {
      product.value = value;
    } else {
      feature.products.push({ id: productId, value });
    }

    featureHandlers.setItem(featureIndex, feature);
  };

  const handleFeatureReorder = ({ destination, source }: DropResult) => {
    featureHandlers.reorder({ from: source.index, to: destination?.index || 0 });
  }

  const addNewCallback = () => {
    callbackHandlers.append({ env: '', url: '' });
  };

  const deleteCallback = (index: number) => {
    callbackHandlers.remove(index);
  };

  const handleCallbackEnvChange = (index: number, nextEnv: string) => {
    callbackHandlers.setItemProp(index, 'env', nextEnv);
  };

  const handleCallbackUrlChange = (index: number, nextUrl: string) => {
    callbackHandlers.setItemProp(index, 'url', nextUrl);
  };

  if (isError) {
    return errorScreen;
  }

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
                  label="Select a currency to display prices in. If no currency is selected, prices will be displayed in the default currency of your Stripe account."
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
            label="Modes"
            disabled={selectedProducts.length === 0}
            data={callbacks.map((cb) => cb.env)}
            value={selectedEnv}
            onChange={(value) => setSelectedEnv(value!)}
          />
          <ActionIcon mb={4}>
            <IconDeviceMobile />
          </ActionIcon>
          <ActionIcon mb={4}>
            <IconDeviceDesktop />
          </ActionIcon>
        </Group>
      </Group>
      <RenderIf condition={hasSeveralPricesWithSameInterval}>
        <Alert title="Regarding prices and intervals" variant="outline" color="orange" mb="xl">
          We currently only show one price per interval, taking the first one from the list.
          This is a limitation of the current API and we plan to address it in the future.
        </Alert>
      </RenderIf>
      <BasicTemplate
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
    <BaseLayout>
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
          </Tabs.List>
        </Tabs>
        <Group align="flex-start" style={{ minHeight: 'calc(100vh - 170px)' }}>
          <RenderIf condition={currentTab === 'products'}>
            <ProductsForm
              showPanel={showPanel}
              template={template}
              products={productsList}
              selectedProducts={selectedProducts}
              onAddProduct={handleAddProduct}
              onAddCustomProduct={handleAddCustomProduct}
              onAddPrice={handleAddPrice}
              onRemoveProduct={handleRemoveProduct}
              onRemovePrice={handleRemovePrice}
              onToggleFreeTrial={handleToggleFreeTrial}
              onChangeFreeTrialDays={handleChangeFreeTrialDays}
              onCustomCTALabelChange={handleCustomCTALabelChange}
              onCustomCTAUrlChange={handleCustomCTAUrlChange}
              onCustomCTADescriptionChange={handleCustomDescriptionChange}
            />
          </RenderIf>
          <RenderIf condition={currentTab === 'visuals'}>
            <VisualsForm
              showPanel={showPanel}
              template={template}
              color={color}
              onColorChange={setColor}
            />
          </RenderIf>
          <RenderIf condition={currentTab === 'features'}>
            <FeaturesForm
              products={selectedProducts}
              features={features}
              onAddNew={handleAddNewFeature}
              onDelete={handleDeleteFeature}
              onFeatureLabelUpdate={handleFeatureLabelUpdate}
              onFeatureTypeChange={handleFeatureTypeUpdate}
              onFeatureValueChange={handleFeatureValueChange}
              onFeatureReorder={handleFeatureReorder}
            />
          </RenderIf>
          <RenderIf condition={currentTab === 'settings'}>
            <SettingsForm
              showPanel={showPanel}
              template={template}
              products={selectedProducts}
              recommended={recommended}
              onRecommendedChange={setRecommended}
              unitLabel={unitLabel}
              usesUnitLabel={usesUnitLabel}
              onToggleUnitLabels={handleUnitLabelToggle}
              onUnitLabelChange={handleUnitLabelChange}
              subscribeLabel={subscribeLabel}
              onSubscribeLabelChange={setSubscribeLabel}
              freeTrialLabel={freeTrialLabel}
              onFreeTrialLabelChange={setFreeTrialLabel}
              callbacks={callbacks}
              onAddNewCallback={addNewCallback}
              onDeleteCallback={deleteCallback}
              onCallbackEnvChange={handleCallbackEnvChange}
              onCallbackUrlChange={handleCallbackUrlChange}
            />
          </RenderIf>
        </Group>
        <RenderIf condition={!isLoaded}>
          <LoadingOverlay visible overlayBlur={2} />
        </RenderIf>
      </MantineProvider>
    </BaseLayout>
  );
};

export default authGuard(FormPage);
