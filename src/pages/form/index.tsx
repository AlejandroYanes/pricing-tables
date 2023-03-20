/* eslint-disable max-len */
import { useState } from 'react';
import type Stripe from 'stripe';
import { ActionIcon, Button, Divider, Group, Select, Stack, Tabs, Text } from '@mantine/core';
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons';

import type { FormProduct } from 'models/stripe';
import { api } from 'utils/api';
import { formatCurrency } from 'utils/numbers';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import RenderIf from 'components/RenderIf';
import ProductBlock from 'features/form/ProductBlock';
import BasicTemplate from 'features/templates/Basic';

type Tabs = 'products' | 'visuals' | 'settings';

const tabsStyles = { tabsList: { borderBottomWidth: '1px' }, tab: { borderBottomWidth: '1px', marginBottom: '-1px' } };

const FormPage = () => {
  const [currentTab, setCurrentTab] = useState<Tabs>('products');
  const [showProducts, setShowProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<FormProduct[]>([]);

  const { data } = api.products.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const productsList = data || [];

  const handleAddProduct = (selectedId: string) => {
    const [productId, priceId] = selectedId.split('-');
    const selectedProduct = data!.find((prod) => prod.id === productId);
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    const prodCopy = { ...selectedProduct, prices: [{ ...selectedPrice }] };
    setSelectedProducts(selectedProducts.concat([prodCopy]));
    setShowProducts(false);
  };

  const handleAddPrice =(productId: string, price: Stripe.Price) => {
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
    setSelectedProducts(selectedProducts.filter((prod) => prod.id !== productId));
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

  const handleChangeFreeTrialDays = (productId: string, priceId: string, value: string) => {
    const selectedProduct = selectedProducts!.find((prod) => prod.id === productId);
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedProduct || !selectedPrice) return;

    selectedPrice.freeTrialDays = Number(value);

    setSelectedProducts(selectedProducts.map((prod) => {
      if (prod.id === productId) {
        return selectedProduct;
      }

      return prod;
    }))
  };

  const resolvePricing = (price: Stripe.Price): string => {
    if (price.type === 'one_time') {
      return formatCurrency(price.unit_amount! / 100, price.currency);
    }

    if (price.billing_scheme === 'per_unit') {
      const recurringLabel = price.recurring?.interval === 'month' ? 'mo' : 'yr';
      if (price.transform_quantity) {
        return `${formatCurrency(price.unit_amount! / 100, price.currency)} per every ${price.transform_quantity.divide_by} units /${recurringLabel}`;
      }

      return `${formatCurrency(price.unit_amount! / 100, price.currency)} /${recurringLabel}`;
    }

    switch (price.tiers_mode) {
      case 'volume': {
        const tier = price.tiers![0]!;
        return `Starts at ${formatCurrency(tier.unit_amount! / 100, price.currency)} for the first ${tier.up_to} users`;
      }
      case 'graduated': {
        const tier = price.tiers![0]!;
        return `Starts at ${formatCurrency(tier.unit_amount! / 100, price.currency)} a month`;
      }
      default:
        return 'No price';
    }
  };

  const productOptions = productsList
    .filter((product) => !selectedProducts.some((sProd) => sProd.id === product.id))
    .map((prod) => (prod.prices || []).map((price) => ({ ...price, product: prod.name, productId: prod.id })))
    .flatMap((prices) => prices.map((price) => ({
      label: resolvePricing(price),
      value: `${price.productId}-${price.id}`,
      group: price.product,
    })));

  return (
    <BaseLayout>
      <Tabs
        value={currentTab}
        onTabChange={setCurrentTab as any}
        mb="xl"
        styles={tabsStyles}
      >
        <Tabs.List>
          <Tabs.Tab value="products">Products</Tabs.Tab>
          <Tabs.Tab value="visuals">Visuals</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Group align="flex-start" style={{ minHeight: 'calc(100vh - 110px)' }}>
        <Stack style={{ minWidth: '420px' }}>
          <Text mb="xl">Products</Text>
          {selectedProducts.map((prod) => {
            const baseProduct = productsList.find((p) => p.id === prod.id)!;

            return (
              <ProductBlock
                key={prod.id}
                value={prod}
                product={baseProduct}
                onAddPrice={handleAddPrice}
                onRemove={handleRemoveProduct}
                onRemovePrice={handleRemovePrice}
                onToggleFreeTrial={handleToggleFreeTrial}
                onFreeTrialDaysChange={handleChangeFreeTrialDays}
              />
            );
          })}
          <RenderIf condition={productOptions.length > 0}>
            <RenderIf condition={!showProducts}>
              <Group position="right" align="center">
                <Button onClick={() => setShowProducts(true)}>
                  {selectedProducts.length === 0 ? 'Add a product' : 'Add another product'}
                </Button>
              </Group>
            </RenderIf>
            <RenderIf condition={showProducts}>
              <Select data={productOptions} onChange={handleAddProduct} />
            </RenderIf>
          </RenderIf>
        </Stack>
        <Divider orientation="vertical" />
        <Stack style={{ flex: 1 }}>
          <RenderIf condition={currentTab === 'products'}>
            <Group align="center" position="right" mb="xl">
              <Group>
                <ActionIcon><IconDeviceMobile /></ActionIcon>
                <ActionIcon color="blue"><IconDeviceDesktop /></ActionIcon>
              </Group>
            </Group>
            <BasicTemplate products={selectedProducts} recommended={1} />
          </RenderIf>
        </Stack>
      </Group>
    </BaseLayout>
  );
};

export default authGuard(FormPage);
