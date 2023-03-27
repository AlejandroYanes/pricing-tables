/* eslint-disable max-len */
import { useState } from 'react';
import type Stripe from 'stripe';
import { ActionIcon, Group, MantineProvider, Tabs } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons';

import type { Feature, FormProduct } from 'models/stripe';
import { api } from 'utils/api';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import RenderIf from 'components/RenderIf';
import ProductsForm from 'features/form/ProductsForm';
import BasicTemplate from 'features/templates/Basic';
import VisualsForm from 'features/form/VisualsForm';
import SettingsForm from 'features/form/SettingsForm';
import FeaturesForm from 'features/form/FeaturesForm';

type Tabs = 'products' | 'features' | 'visuals' | 'settings';

const tabsStyles = { tabsList: { borderBottomWidth: '1px' }, tab: { borderBottomWidth: '1px', marginBottom: '-1px' } };

const FormPage = () => {
  const colorScheme = useColorScheme();
  const [currentTab, setCurrentTab] = useState<Tabs>('products');

  const [selectedProducts, setSelectedProducts] = useState<FormProduct[]>([]);

  const [features, setFeatures] = useState<Feature[]>([]);

  const [color, setColor] = useState<string>('blue');

  const [recommended, setRecommended] = useState<string | undefined>(undefined);
  const [subscribeLabel, setSubscribeLabel] = useState('Subscribe');
  const [freeTrialLabel, setFreeTrialLabel] = useState('Start free trial');
  const [usesUnitLabel, setUsesUnitLabel] = useState(false);
  const [unitLabel, setUnitLabel] = useState<string | undefined>(undefined);

  const { data } = api.products.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const productsList = data || [];

  const handleAddProduct = (selectedId: string) => {
    const [productId, priceId] = selectedId.split('-');
    const selectedProduct = data!.find((prod) => prod.id === productId);
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    const prodCopy = { ...selectedProduct, prices: [{ ...selectedPrice }], features: [] };
    setSelectedProducts(selectedProducts.concat([prodCopy]));
  };

  const handleAddPrice = (productId: string, price: Stripe.Price) => {
    const selectedProduct = selectedProducts!.find((prod) => prod.id === productId);

    if (!selectedProduct) return;

    const prodCopy = { ...selectedProduct!, prices: selectedProduct.prices.concat([{ ...price }]) };
    setSelectedProducts(selectedProducts.map((prod) => {
      if (prod.id === productId) {
        return prodCopy;
      }

      return prod;
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    const nextProductList = selectedProducts.filter((prod) => prod.id !== productId);
    setSelectedProducts(nextProductList);
    if (nextProductList.length === 0) {
      setRecommended(undefined);
    }
  };

  const handleRemovePrice = (productId: string, priceId: string) => {
    const selectedProduct = selectedProducts!.find((prod) => prod.id === productId);
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    const prodCopy = { ...selectedProduct!, prices: selectedProduct.prices.filter((price) => price.id !== priceId) };
    setSelectedProducts(selectedProducts.map((prod) => {
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

    setSelectedProducts(selectedProducts.map((prod) => {
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

    setSelectedProducts(selectedProducts.map((prod) => {
      if (prod.id === productId) {
        return selectedProduct;
      }

      return prod;
    }))
  };

  const handleUnitLabelToggle = () => {
    console.log('handleUnitLabelToggle');
    setUsesUnitLabel(!usesUnitLabel);
    setUnitLabel(!usesUnitLabel ? 'units' : undefined);
  };

  const handleUnitLabelChange = (nextUnit: string) => {
    setUnitLabel(nextUnit);
  };

  const handleAddNewFeature = () => {
    setFeatures(features.concat([{ name: 'test', products: [] }]));
  };

  const handleFeatureToggle = (featureIndex: number, productId: string) => {
    const feature = features.at(featureIndex)!;
    const hasProduct = feature.products.includes(productId);

    if (hasProduct) {
      feature.products = feature.products.filter((prod) => prod !== productId);
    } else {
      feature.products = feature.products.concat(productId);
    }
    setFeatures(features.map((feat, index) => {
      if (index === featureIndex) {
        return feature;
      }
      return feat;
    }));
  };

  const handleFeatureLabelUpdate = (featureIndex: number, nextLabel: string) => {
    const feature = features.at(featureIndex)!;
    setFeatures(features.map((feat, index) => {
      if (index === featureIndex) {
        return { ...feature, name: nextLabel };
      }
      return feat;
    }));
  };

  const template = (
    <>
      <Group align="center" position="right" mb="xl">
        <Group>
          <ActionIcon><IconDeviceMobile /></ActionIcon>
          <ActionIcon color="primary"><IconDeviceDesktop /></ActionIcon>
        </Group>
      </Group>
      <BasicTemplate
        products={selectedProducts}
        recommended={recommended}
        unitLabel={unitLabel}
        color={color}
        subscribeLabel={subscribeLabel}
        freeTrialLabel={freeTrialLabel}
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
              template={template}
              products={productsList}
              selectedProducts={selectedProducts}
              onAddProduct={handleAddProduct}
              onAddPrice={handleAddPrice}
              onRemoveProduct={handleRemoveProduct}
              onRemovePrice={handleRemovePrice}
              onToggleFreeTrial={handleToggleFreeTrial}
              onChangeFreeTrialDays={handleChangeFreeTrialDays}
            />
          </RenderIf>
          <RenderIf condition={currentTab === 'visuals'}>
            <VisualsForm
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
              onFeatureToggle={handleFeatureToggle}
              onFeatureUpdate={handleFeatureLabelUpdate}
            />
          </RenderIf>
          <RenderIf condition={currentTab === 'settings'}>
            <SettingsForm
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
            />
          </RenderIf>
        </Group>
      </MantineProvider>
    </BaseLayout>
  );
};

export default authGuard(FormPage);
