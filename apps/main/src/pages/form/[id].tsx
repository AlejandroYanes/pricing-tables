/* eslint-disable max-len */
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ActionIcon, Alert, Anchor, Group, LoadingOverlay, MantineProvider, Select, Stack, Tabs, Text, Tooltip } from '@mantine/core';
import { useColorScheme, useListState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import type { DropResult } from 'react-beautiful-dnd';
import {
  IconAlertTriangle,
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconInfoCircle
} from '@tabler/icons';
import { RenderIf } from 'ui';
import { templatesMap } from 'templates';
import type { FormCallback, FeatureType, FormFeature, FormProduct, FormPrice } from 'models';
import { callAPI, reorder } from 'helpers';

import { trpc } from 'utils/trpc';
import authGuard from 'utils/hoc/authGuard';
import { useDebounce } from 'utils/hooks/useDebounce';
import BaseLayout from 'components/BaseLayout';
import ProductsForm from 'features/form/ProductsForm';
import VisualsForm from 'features/form/VisualsForm';
import SettingsForm from 'features/form/SettingsForm';
import FeaturesForm from 'features/form/FeaturesForm';
import useTrackAndSave from 'features/form/useTrackAndSave';
import IntegrationPanel from 'features/form/IntegrationPanel';

type Tabs = 'products' | 'features' | 'visuals' | 'settings' | 'integration';

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
  const { data: widgetInfo, isFetching: isFetchingWidgetInfo, isError } = trpc.widgets.fetchInfo.useQuery(query.id as string, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const { data } = trpc.stripe.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: isFetchingWidgetInfo,
  });
  // const data = mockProducts as any;
  const productsList = data || [];

  const { debounceCall } = useDebounce(1000);

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tabs>('products');
  const [showPanel, setShowPanel] = useState(true);

  const [selectedProducts, productHandlers] = useListState<FormProduct>([]);

  const [features, featureHandlers] = useListState<FormFeature>([]);

  const [color, setColor] = useState<string>('teal');

  const [name, setName] = useState<string>('');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<string | null>(null);
  const [subscribeLabel, setSubscribeLabel] = useState('Subscribe');
  const [freeTrialLabel, setFreeTrialLabel] = useState('Start free trial');
  const [usesUnitLabel, setUsesUnitLabel] = useState(false);
  const [unitLabel, setUnitLabel] = useState<string | null>(null);
  const [callbacks, callbackHandlers] = useListState<FormCallback>([]);

  const [selectedEnv, setSelectedEnv] = useState<string>('development');
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  useTrackAndSave({
    selectedProducts,
    features,
    color,
    name,
    template: templateId,
    recommended,
    subscribeLabel,
    freeTrialLabel,
    usesUnitLabel,
    unitLabel,
    callbacks,
    widgetId: query.id as string,
  }, isLoaded);

  useEffect(() => {
    if (!isFetchingWidgetInfo && widgetInfo) {
      productHandlers.setState(widgetInfo!.products);
      featureHandlers.setState(widgetInfo!.features);
      callbackHandlers.setState(widgetInfo!.callbacks);
      setName(widgetInfo!.name);
      setColor(widgetInfo!.color);
      setTemplateId(widgetInfo!.template);
      setRecommended(widgetInfo!.recommended);
      setSubscribeLabel(widgetInfo!.subscribeLabel);
      setFreeTrialLabel(widgetInfo!.freeTrialLabel);
      setUsesUnitLabel(widgetInfo!.usesUnitLabel);
      setUnitLabel(widgetInfo!.unitLabel);
      setIsLoaded(true);
    }
  }, [isFetchingWidgetInfo, widgetInfo]);

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

  const handleAddProduct = (selectedId: string) => {
    const [productId, priceId] = selectedId.split('-');
    // @ts-ignore
    const selectedProduct = data!.find((prod) => prod.id === productId);
    // @ts-ignore
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    const copy = { ...selectedProduct, prices: [{ ...selectedPrice, hasFreeTrial: false, freeTrialDays: 0 }], features: [] };
    productHandlers.append(copy);

    featureHandlers.apply((feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id: copy.id, value }) };
    });

    callAPI({
      url: `/api/widgets/${query.id}/add-product`,
      method: 'POST',
      body: { productId: selectedProduct.id, priceId: selectedPrice.id }
    }).catch(() => {
      handleAPIError();
    });
  };

  const handleAddCustomProduct = () => {
    const hasCustomProductLimit = selectedProducts.filter((prod) => prod.isCustom).length === 2;

    if (hasCustomProductLimit) {
      showNotification({
        color: 'orange',
        message: 'You can only have 2 custom products',
      });
      return;
    }

    const id = `custom-${Date.now()}`;
    const customProduct: Partial<FormProduct> = {
      id,
      isCustom: true,
      active: true,
      name: 'Custom Product',
      description: 'Custom product can be used to present an extra option, whether a free tier or for users to contact your sales team',
      prices: [],
      ctaLabel: 'Label',
      ctaUrl: ''
    };
    productHandlers.append(customProduct as FormProduct);

    featureHandlers.apply((feature) => {
      const value = feature.type === 'boolean' ? 'false' : '';
      return { ...feature, products: feature.products.concat({ id, value }) };
    });

    callAPI({
      url: `/api/widgets/${query.id}/add-custom-product`,
      method: 'POST',
      body: { productId: id }
    }).catch(() => {
      handleAPIError();
    });
  };

  const handleRemoveProduct = (index: number) => {
    productHandlers.remove(index);
    if (selectedProducts.length === 1) {
      setRecommended(null);
    }

    const productId = selectedProducts[index]!.id;
    featureHandlers.apply((feature) => {
      return { ...feature, products: feature.products.filter((prod) => prod.id !== productId) };
    });

    callAPI({
      url: `/api/widgets/${query.id}/remove-product`,
      method: 'POST',
      body: { productId: selectedProducts[index]!.id }
    }).catch(() => {
      handleAPIError();
    });
  };

  const handleProductReorder = ({ destination, source }: DropResult) => {
    productHandlers.reorder({ from: source.index, to: destination?.index || 0 });

    debounceCall(() => {
      const sortedProductIds = reorder(selectedProducts, { from: source.index, to: destination?.index || 0 })
        .map((prod) => prod.id);

      callAPI({
        url: `/api/widgets/${query.id}/reorder-products`,
        method: 'POST',
        body: {
          ids: sortedProductIds,
        },
      }).catch(() => {
        handleAPIError();
      });
    });
  }

  const handleAddPrice = (productId: string, price: FormPrice) => {
    const selectedProduct = selectedProducts!.find((prod) => prod.id === productId);

    if (!selectedProduct) return;

    const prodCopy = { ...selectedProduct!, prices: selectedProduct.prices.concat([{ ...price }]) };
    productHandlers.setState(selectedProducts.map((prod) => {
      if (prod.id === productId) {
        return prodCopy;
      }

      return prod;
    }));

    callAPI({
      url: `/api/widgets/${query.id}/add-price`,
      method: 'POST',
      body: { productId, priceId: price.id }
    }).catch(() => {
      handleAPIError();
    });
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

    callAPI({
      url: `/api/widgets/${query.id}/remove-price`,
      method: 'POST',
      body: { productId, priceId }
    }).catch(() => {
      handleAPIError();
    });
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

  const handleCustomCTANameChange = (index: number, nextName: string) => {
    productHandlers.setItemProp(index, 'name', nextName);
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

    callAPI({
      url: `/api/widgets/${query.id}/add-feature`,
      method: 'POST',
      body: {
        ...nextFeature,
        products: selectedProducts.map((prod) => ({ id: prod.id, value: 'false' })),
      }
    }).catch(() => {
      handleAPIError();
    });
  };

  const handleDeleteFeature = (featureIndex: number) => {
    featureHandlers.remove(featureIndex);

    const targetFeature = features.at(featureIndex)!;
    callAPI({
      url: `/api/widgets/${query.id}/remove-feature`,
      method: 'POST',
      body: { id: targetFeature.id }
    }).catch(() => {
      handleAPIError();
    });
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

    debounceCall(() => {
      const sortedFeatureIds = reorder(features, { from: source.index, to: destination?.index || 0 })
        .map((feat) => {
          return feat.products.map(() => feat.id);
        }, [])
        .flat();

      callAPI({
        url: `/api/widgets/${query.id}/reorder-features`,
        method: 'POST',
        body: {
          ids: sortedFeatureIds,
        },
      }).catch(() => {
        handleAPIError();
      });
    });
  }

  const addNewCallback = () => {
    const newId = `${Date.now()}`;
    const alreadyExists = callbacks.some((cb) => cb.env === '' );
    callbackHandlers.append({
      id: newId,
      env: '',
      url: '',
      error: alreadyExists ? 'There can only be one callback per mode' : undefined,
    });

    if (!alreadyExists) {
      callAPI({
        url: `/api/widgets/${query.id}/add-callback`,
        method: 'POST',
        body: { id: newId, env: '', url: '' },
      }).catch(() => {
        handleAPIError();
      });
    }
  };

  const deleteCallback = (index: number) => {
    callbackHandlers.remove(index);

    const targetCallback = callbacks.at(index)!;
    callAPI({
      url: `/api/widgets/${query.id}/remove-callback`,
      method: 'POST',
      body: { env: targetCallback.env },
    }).catch(() => {
      handleAPIError();
    });
  };

  const handleCallbackEnvChange = (index: number, nextEnv: string) => {
    const alreadyExists = callbacks.some((cb) => cb.env === nextEnv );
    if (alreadyExists) {
      callbackHandlers.setItemProp(index, 'error', 'There can only be one callback per mode');
    }
    if (callbacks.at(index)?.error) {
      callbackHandlers.setItemProp(index, 'error', undefined);
    }

    callbackHandlers.setItemProp(index, 'env', nextEnv);
  };

  const handleCallbackUrlChange = (index: number, nextUrl: string) => {
    callbackHandlers.setItemProp(index, 'url', nextUrl);
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
        widgetId={query.id}
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
        <title>Pricing cards | Widget form</title>
      </Head>
      <BaseLayout showBackButton>
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
                onCustomCTANameChange={handleCustomCTANameChange}
                onCustomCTALabelChange={handleCustomCTALabelChange}
                onCustomCTAUrlChange={handleCustomCTAUrlChange}
                onCustomCTADescriptionChange={handleCustomDescriptionChange}
                onProductReorder={handleProductReorder}
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
                widgetId={query.id as string}
                templateId={templateId}
                onTemplateChange={setTemplateId}
                template={template}
                products={selectedProducts}
                name={name}
                onNameChange={setName}
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
