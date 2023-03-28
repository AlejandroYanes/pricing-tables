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

  const [selectedProducts, setSelectedProducts] = useState<FormProduct[]>(mockSelectedProducts as any);

  const [features, setFeatures] = useState<Feature[]>(mockFeatures);

  const [color, setColor] = useState<string>('blue');

  const [recommended, setRecommended] = useState<string | undefined>('prod_NRrvLHLkz1aSdI');
  const [subscribeLabel, setSubscribeLabel] = useState('Subscribe');
  const [freeTrialLabel, setFreeTrialLabel] = useState('Start free trial');
  const [usesUnitLabel, setUsesUnitLabel] = useState(false);
  const [unitLabel, setUnitLabel] = useState<string | undefined>(undefined);

  // const { data } = api.products.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const data: any = mockProducts;
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
        features={features}
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

const mockProducts = [{'id':'prod_NZk3fmc36zKJqc','object':'product','active':true,'attributes':[],'created':1679525739,'default_price':'price_1MoaZEJIZhxRN8vV9PGqLBPk','description':'Paying per users, starts at 3 users.','images':[],'livemode':false,'metadata':{},'name':'Per user','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':'user','updated':1679526037,'url':null,'prices':[{'id':'price_1MoaZEJIZhxRN8vV9PGqLBPk','object':'price','active':true,'billing_scheme':'per_unit','created':1679525740,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NZk3fmc36zKJqc','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':250,'unit_amount_decimal':'250'}]},{'id':'prod_NWWy4clNk7Enso','object':'product','active':true,'attributes':[],'created':1678785169,'default_price':null,'description':'You will be buying a life time license','images':[],'livemode':false,'metadata':{},'name':'One Time Buy','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678825865,'url':null,'prices':[{'id':'price_1MlTuXJIZhxRN8vVrm00VlhQ','object':'price','active':true,'billing_scheme':'per_unit','created':1678785169,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NWWy4clNk7Enso','recurring':null,'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'one_time','unit_amount':500000,'unit_amount_decimal':'500000'}]},{'id':'prod_NRrwPguKtyHVRl','object':'product','active':true,'attributes':[],'created':1677709991,'default_price':'price_1Mix3vJIZhxRN8vV7cvEddpk','description':'Enterprise Plan description','images':[],'livemode':false,'metadata':{},'name':'Enterprise Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678182255,'url':null,'prices':[{'id':'price_1Mix3vJIZhxRN8vV7cvEddpk','object':'price','active':true,'billing_scheme':'per_unit','created':1678182243,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrwPguKtyHVRl','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':5000,'unit_amount_decimal':'5000'},{'id':'price_1MlU0eJIZhxRN8vVFgYZnF02','object':'price','active':true,'billing_scheme':'tiered','created':1678785548,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrwPguKtyHVRl','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers':[{'flat_amount':null,'flat_amount_decimal':null,'unit_amount':50,'unit_amount_decimal':'50','up_to':1000},{'flat_amount':null,'flat_amount_decimal':null,'unit_amount':35,'unit_amount_decimal':'35','up_to':null}],'tiers_mode':'graduated','transform_quantity':null,'type':'recurring','unit_amount':null,'unit_amount_decimal':null},{'id':'price_1MjUu3JIZhxRN8vVva09rpdo','object':'price','active':true,'billing_scheme':'per_unit','created':1678312327,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrwPguKtyHVRl','recurring':{'aggregate_usage':null,'interval':'year','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':50000,'unit_amount_decimal':'50000'}]},{'id':'prod_NRrvLHLkz1aSdI','object':'product','active':true,'attributes':[],'created':1677709939,'default_price':'price_1Mix3QJIZhxRN8vVmiM3xH4p','description':'Premium plan description','images':[],'livemode':false,'metadata':{},'name':'Premium Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678621159,'url':null,'prices':[{'id':'price_1Mix3QJIZhxRN8vVmiM3xH4p','object':'price','active':true,'billing_scheme':'per_unit','created':1678182212,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvLHLkz1aSdI','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':2500,'unit_amount_decimal':'2500'},{'id':'price_1Mlea4JIZhxRN8vVPzF2csYG','object':'price','active':true,'billing_scheme':'tiered','created':1678826184,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvLHLkz1aSdI','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers':[{'flat_amount':null,'flat_amount_decimal':null,'unit_amount':35,'unit_amount_decimal':'35','up_to':1000},{'flat_amount':null,'flat_amount_decimal':null,'unit_amount':15,'unit_amount_decimal':'15','up_to':null}],'tiers_mode':'volume','transform_quantity':null,'type':'recurring','unit_amount':null,'unit_amount_decimal':null},{'id':'price_1MilSyJIZhxRN8vVeLS9NaAk','object':'price','active':true,'billing_scheme':'per_unit','created':1678137668,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvLHLkz1aSdI','recurring':{'aggregate_usage':null,'interval':'year','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':25000,'unit_amount_decimal':'25000'}]},{'id':'prod_NRrvBSQC0ZoHY7','object':'product','active':true,'attributes':[],'created':1677709893,'default_price':'price_1Mix29JIZhxRN8vVWAiQKwWu','description':'Basic plan description','images':[],'livemode':false,'metadata':{},'name':'Basic Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678621196,'url':null,'prices':[{'id':'price_1Mix29JIZhxRN8vVWAiQKwWu','object':'price','active':true,'billing_scheme':'per_unit','created':1678182133,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvBSQC0ZoHY7','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':1000,'unit_amount_decimal':'1000'},{'id':'price_1MilUCJIZhxRN8vVyTUym4ZP','object':'price','active':true,'billing_scheme':'per_unit','created':1678137744,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvBSQC0ZoHY7','recurring':{'aggregate_usage':null,'interval':'year','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':10000,'unit_amount_decimal':'10000'}]}]

const mockSelectedProducts = [
  {'id':'prod_NRrvBSQC0ZoHY7',object:'product','active':true,'attributes':[],'created':1677709893,'default_price':'price_1Mix29JIZhxRN8vVWAiQKwWu','description':'Basic plan description','images':[],'livemode':false,'metadata':{},'name':'Basic Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678621196,'url':null,'prices':[{'id':'price_1Mix29JIZhxRN8vVWAiQKwWu','object':'price','active':true,'billing_scheme':'per_unit','created':1678182133,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvBSQC0ZoHY7','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':1000,'unit_amount_decimal':'1000'}],'features':[]},
  {'id':'prod_NRrvLHLkz1aSdI','object':'product','active':true,'attributes':[],'created':1677709939,'default_price':'price_1Mix3QJIZhxRN8vVmiM3xH4p','description':'Premium plan description','images':[],'livemode':false,'metadata':{},'name':'Premium Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678621159,'url':null,'prices':[{'id':'price_1Mix3QJIZhxRN8vVmiM3xH4p','object':'price','active':true,'billing_scheme':'per_unit','created':1678182212,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvLHLkz1aSdI','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':2500,'unit_amount_decimal':'2500'}],'features':[]},
  {'id':'prod_NRrwPguKtyHVRl','object':'product','active':true,'attributes':[],'created':1677709991,'default_price':'price_1Mix3vJIZhxRN8vV7cvEddpk','description':'Enterprise Plan description','images':[],'livemode':false,'metadata':{},'name':'Enterprise Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678182255,'url':null,'prices':[{'id':'price_1Mix3vJIZhxRN8vV7cvEddpk','object':'price','active':true,'billing_scheme':'per_unit','created':1678182243,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrwPguKtyHVRl','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':5000,'unit_amount_decimal':'5000'}],'features':[]},
];

const mockFeatures = [
  {'name':'Unlimited private repos','products':['prod_NRrvBSQC0ZoHY7','prod_NRrvLHLkz1aSdI','prod_NRrwPguKtyHVRl']},
  {'name':'Jira software integration','products':['prod_NRrvLHLkz1aSdI','prod_NRrwPguKtyHVRl']},
  {'name':'Required merge checks','products':['prod_NRrvLHLkz1aSdI','prod_NRrwPguKtyHVRl']},
  {'name':'IP Whitelisting','products':['prod_NRrwPguKtyHVRl']},
];
