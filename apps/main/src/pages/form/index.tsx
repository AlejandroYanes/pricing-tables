/* eslint-disable max-len */
import { useMemo, useState } from 'react';
import type Stripe from 'stripe';
import { ActionIcon, Alert, Group, MantineProvider, Select, Tabs, Tooltip } from '@mantine/core';
import { useColorScheme, useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconArrowBarToLeft, IconArrowBarToRight, IconDeviceDesktop, IconDeviceMobile, IconInfoCircle } from '@tabler/icons';
import type { DropResult } from 'react-beautiful-dnd';
import { RenderIf } from 'ui';
import { BasicTemplate } from 'templates';
import type { CTACallback, Feature, FeatureType, FeatureValue, FormProduct } from 'models';

import { api } from 'utils/api';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import ProductsForm from 'features/form/ProductsForm';
import VisualsForm from 'features/form/VisualsForm';
import SettingsForm from 'features/form/SettingsForm';
import FeaturesForm from 'features/form/FeaturesForm';

type Tabs = 'products' | 'features' | 'visuals' | 'settings';

const tabsStyles = { tabsList: { borderBottomWidth: '1px' }, tab: { borderBottomWidth: '1px', marginBottom: '-1px' } };

const FormPage = () => {
  const colorScheme = useColorScheme();
  const [currentTab, setCurrentTab] = useState<Tabs>('products');
  const [showPanel, setShowPanel] = useState(true);

  const [selectedProducts, productHandlers] = useListState<FormProduct>([]);

  const [features, featureHandlers] = useListState<Feature>([]);

  const [color, setColor] = useState<string>('teal');

  const [recommended, setRecommended] = useState<string | undefined>(undefined);
  const [subscribeLabel, setSubscribeLabel] = useState('Subscribe');
  const [freeTrialLabel, setFreeTrialLabel] = useState('Start free trial');
  const [usesUnitLabel, setUsesUnitLabel] = useState(false);
  const [unitLabel, setUnitLabel] = useState<string | undefined>(undefined);
  const [callbacks, callbackHandlers] = useListState<CTACallback>([
    { env: 'development', url: '' },
    { env: 'production', url: '' },
  ]);

  const [selectedEnv, setSelectedEnv] = useState<string>('development');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

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

  const { data } = api.products.list.useQuery(undefined, { refetchOnWindowFocus: false });
  // const data: any = mockProducts;
  const productsList = data || [];

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
      setRecommended(undefined);
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
    setUnitLabel(!usesUnitLabel ? 'units' : undefined);
  };

  const handleUnitLabelChange = (nextUnit: string) => {
    setUnitLabel(nextUnit);
  };

  const handleAddNewFeature = () => {
    const nextFeature: Feature = {
      id: `${Date.now()}`,
      name: 'test',
      type: 'boolean',
      products: selectedProducts.map((prod) => ({ id: prod.id, value: false })),
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
    const initialValue: Record<FeatureType, FeatureValue> = { string: '', compose: '', boolean: false };
    const feature = features.at(featureIndex)!;
    featureHandlers.setItem(featureIndex, {
      ...feature,
      type: nextType,
      products: feature.products.map((prod) => ({ ...prod, value: initialValue[nextType] })),
    });
  };

  const handleFeatureValueChange = (featureIndex: number, productId: string, value: FeatureValue) => {
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

const mockFeatures: Feature[] = [
  { id: '1', 'name':'Unlimited private repos', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: true },{ id: 'prod_NRrvLHLkz1aSdI', value: true },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  { id: '2', 'name':'Jira software integration', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: true },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  {id: '3', 'name':'Required merge checks', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: false },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  {id: '4', 'name':'IP Whitelisting', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: false },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
];
