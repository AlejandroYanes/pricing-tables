/* eslint-disable max-len */
import { Fragment, useState } from 'react';
import type Stripe from 'stripe';
import { ActionIcon, Button, Checkbox, createStyles, Divider, Group, Select, Stack, Text } from '@mantine/core';
import { IconDeviceDesktop, IconDeviceMobile, IconX } from '@tabler/icons';

import type { ExtendedProduct } from 'models/stripe';
import { api } from 'utils/api';
import { formatCurrency } from 'utils/numbers';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import RenderIf from 'components/RenderIf';

const useStyles = createStyles((theme) => ({
  productBlock: {
    position: 'relative',
    border: `1px solid ${theme.colors.gray[4]}`,
    borderRadius: '4px',
    marginBottom: '16px',
  },
  deleteBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px'
  },
  productCard: {
    border: `1px solid ${theme.colors.gray[4]}`,
    padding: '48px 32px 24px',
    borderRadius: '4px',
    width: '280px',
  },
  activeProductCard: {
    border: `1px solid ${theme.colors.blue[5]}`,
  },
}));

const FormPage = () => {
  const { classes, cx } = useStyles();
  const [showProducts, setShowProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ExtendedProduct[]>([]);

  const { data } = api.products.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const productsList = data || [];

  const handleAddProduct = (selectedId: string) => {
    const [productId, priceId] = selectedId.split('-');
    const selectedProduct = data!.find((prod) => prod.id === productId);
    const selectedPrice = selectedProduct?.prices.find((price) => price.id === priceId);

    if (!selectedPrice) return;

    const prodCopy = { ...selectedProduct!, prices: [selectedPrice] };
    setSelectedProducts(selectedProducts.concat([prodCopy]));
    setShowProducts(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((prod) => prod.id !== productId));
  };

  const resolvePricing = (price: Stripe.Price): string => {
    if (price.billing_scheme === 'per_unit') {
      const recurringLabel = price.recurring?.interval === 'month' ? 'mo' : 'yr';
      if (price.transform_quantity) {
        return `${formatCurrency(price.unit_amount! / 100, price.currency)} per every ${price.transform_quantity.divide_by} units /${recurringLabel}`;
      }

      return `${formatCurrency(price.unit_amount! / 100, price.currency)} /${recurringLabel}`;
    }
    return '';

    // switch (price.tiers_mode) {
    //   case 'volume':
    //     return (
    //       <ul>
    //         {(price.tiers || []).map((tier, index, arr) => {
    //           if (index === 0)
    //             return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for 1 to ${tier.up_to} users`;
    //
    //           if (tier.up_to === null)
    //             return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for ${(arr[index - 1]!.up_to)! + 1} users or more`;
    //
    //           // eslint-disable-next-line max-len
    //           return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for ${(arr[index - 1]!.up_to)! + 1} to ${tier.up_to} users`;
    //         }).map((value, index) => <li key={index}>{value}</li>)}
    //       </ul>
    //     );
    //   case 'graduated':
    //     return (
    //       <ul>
    //         {(price.tiers || []).map((tier, index, arr) => {
    //           if (index === 0)
    //             return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for the first ${tier.up_to} users`;
    //
    //           if (tier.up_to === null)
    //             return `${formatCurrency(tier.unit_amount! / 100, price.currency)} from ${(arr[index - 1]!.up_to)! + 1} users forward`;
    //
    //           // eslint-disable-next-line max-len
    //           return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for the next ${(arr[index - 1]!.up_to)! + 1} to ${tier.up_to} users`;
    //         }).map((value, index) => <li key={index}>{value}</li>)}
    //       </ul>
    //     );
    // }
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
      <Group align="flex-start" style={{ minHeight: 'calc(100vh - 110px)' }}>
        <Stack style={{ minWidth: '420px' }}>
          <Text mb="xl">Products</Text>
          {selectedProducts.map((prod) => {
            const baseProduct = productsList.find((p) => p.id === prod.id)!;
            const hasMorePrices = baseProduct.prices.length - prod.prices.length > 0;
            const remainingPrices = baseProduct.prices.length - prod.prices.length;

            return (
              <div key={prod.id} className={classes.productBlock}>
                <div className={classes.deleteBtn}>
                  <ActionIcon radius="xl" variant="filled" size="xs" onClick={() => handleRemoveProduct(prod.id)}>
                    <IconX size={14} />
                  </ActionIcon>
                </div>
                <Text weight="bold" p={16}>{prod.name}</Text>
                <Stack>
                  {(prod.prices || []).map((price) => (
                    <Fragment key={price.id}>
                      <Stack px={16} pb={!hasMorePrices ? 16 : 0} spacing="xs">
                        <Text>{`${resolvePricing(price)}`}</Text>
                        <Checkbox label="Include free trial" />
                      </Stack>
                      <RenderIf condition={hasMorePrices}>
                        <Divider orientation="horizontal" />
                      </RenderIf>
                    </Fragment>
                  ))}
                </Stack>
                <RenderIf condition={hasMorePrices}>
                  <Group px={16} py={4} align="center" position="apart">
                    <Text color="dimmed" size="sm">
                      {`${remainingPrices} ${remainingPrices > 1 ? 'prices' : 'price'} remaining`}
                    </Text>
                    <Button variant="white" style={{ padding: 0 }}>Add another price</Button>
                  </Group>
                </RenderIf>
              </div>
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
          <Group align="center" position="apart" mb="xl">
            <Text>Template</Text>
            <Group>
              <ActionIcon><IconDeviceMobile /></ActionIcon>
              <ActionIcon color="blue"><IconDeviceDesktop /></ActionIcon>
            </Group>
          </Group>
          <Group align="center" position="center" spacing="xl">
            {selectedProducts.map((prod, index) => (
              <Stack
                key={prod.id}
                align="center"
                className={cx(classes.productCard, { [classes.activeProductCard]: index === selectedProducts.length - 1 })}
              >
                <Text weight="bold" color={index === selectedProducts.length - 1 ? 'blue' : 'black'}>{prod.name}</Text>
                <Text>{prod.description}</Text>
                <Text
                  style={{ fontSize: '32px', fontWeight: 'bold' }}
                  color={index === selectedProducts.length - 1 ? 'blue' : 'black'}
                >
                  {resolvePricing(prod.prices![0]!)}
                </Text>
                <Button mt="xl" variant={index === selectedProducts.length - 1 ? 'filled' : 'outline'}>Subscribe</Button>
              </Stack>
            ))}
          </Group>
        </Stack>
      </Group>
    </BaseLayout>
  );
};

export default authGuard(FormPage);
