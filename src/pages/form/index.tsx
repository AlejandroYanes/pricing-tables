/* eslint-disable max-len */
import { useState } from 'react';
import type Stripe from 'stripe';
import { ActionIcon, Divider, Group, Stack, Tabs } from '@mantine/core';
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons';

import type { FormProduct } from 'models/stripe';
import { api } from 'utils/api';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import RenderIf from 'components/RenderIf';
import ProductsForm from 'features/form/ProductsForm';
import BasicTemplate from 'features/templates/Basic';

type Tabs = 'products' | 'visuals' | 'settings';

const tabsStyles = { tabsList: { borderBottomWidth: '1px' }, tab: { borderBottomWidth: '1px', marginBottom: '-1px' } };

const FormPage = () => {
  const [currentTab, setCurrentTab] = useState<Tabs>('products');
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
      <Group align="flex-start" style={{ minHeight: 'calc(100vh - 170px)' }}>
        <Stack style={{ minWidth: '420px' }}>
          <RenderIf condition={currentTab === 'products'}>
            <ProductsForm
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
        </Stack>
        <Divider orientation="vertical" />
        <Stack style={{ flex: 1 }}>
          <Group align="center" position="right" mb="xl">
            <Group>
              <ActionIcon><IconDeviceMobile /></ActionIcon>
              <ActionIcon color="blue"><IconDeviceDesktop /></ActionIcon>
            </Group>
          </Group>
          <BasicTemplate products={selectedProducts} recommended={1} />
        </Stack>
      </Group>
    </BaseLayout>
  );
};

export default authGuard(FormPage);
