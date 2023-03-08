import { useState } from 'react';
import type Stripe from 'stripe';
import { ActionIcon, Button, Checkbox, createStyles, Divider, Group, Select, Stack, Text } from '@mantine/core';
import { IconX } from '@tabler/icons';

import type { ExtendedProduct } from 'models/stripe';
import { api } from 'utils/api';
import { formatCurrency } from 'utils/numbers';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import RenderIf from 'components/RenderIf';

const useStyles = createStyles((theme) => ({
  productBlock: {
    position: 'relative',
    border: `1px solid ${theme.colors.gray[7]}`,
    borderRadius: '4px',
    marginBottom: '16px',
    padding: '16px',
  },
  deleteBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px'
  },
}));

const FormPage = () => {
  const { classes } = useStyles();
  const [showProducts, setShowProducts] = useState(false);
  // const [products, setProducts] = useState<ExtendedProduct[]>([]);

  const { data } = api.products.list.useQuery(undefined, { refetchOnWindowFocus: false });

  // const productOptions = (data || [])
  //   .map((prod) => ({ label: prod.name, value: prod.id }))
  //   .filter((option) => !products.some((prod) => prod.id === option.value));

  // const handleAddProduct = (productId: string) => {
  //   const selectedProduct = data!.find((prod) => prod.id === productId);
  //
  //   if (!selectedProduct) return;
  //
  //   setProducts(products.concat([selectedProduct]));
  //   setShowProducts(false);
  // };
  //
  // const handleRemoveProduct = (productId: string) => {
  //   setProducts(products.filter((prod) => prod.id !== productId));
  // };

  const resolvePricing = (price: Stripe.Price) => {
    if (price.billing_scheme === 'per_unit') {
      const recurringLabel = price.recurring?.interval === 'month' ? 'mo' : 'yr';
      if (price.transform_quantity) {
        // eslint-disable-next-line max-len
        return `${formatCurrency(price.unit_amount! / 100, price.currency)} per every ${price.transform_quantity.divide_by} units /${recurringLabel}`;
      }

      return `${formatCurrency(price.unit_amount! / 100, price.currency)} /${recurringLabel}`;
    }

    switch (price.tiers_mode) {
      case 'volume':
        return (
          <ul>
            {(price.tiers || []).map((tier, index, arr) => {
              if (index === 0)
                return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for 1 to ${tier.up_to} users`;

              if (tier.up_to === null)
                return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for ${(arr[index - 1]!.up_to)! + 1} users or more`;

              // eslint-disable-next-line max-len
              return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for ${(arr[index - 1]!.up_to)! + 1} to ${tier.up_to} users`;
            }).map((value, index) => <li key={index}>{value}</li>)}
          </ul>
        );
      case 'graduated':
        return (
          <ul>
            {(price.tiers || []).map((tier, index, arr) => {
              if (index === 0)
                return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for the first ${tier.up_to} users`;

              if (tier.up_to === null)
                return `${formatCurrency(tier.unit_amount! / 100, price.currency)} from ${(arr[index - 1]!.up_to)! + 1} users forward`;

              // eslint-disable-next-line max-len
              return `${formatCurrency(tier.unit_amount! / 100, price.currency)} for the next ${(arr[index - 1]!.up_to)! + 1} to ${tier.up_to} users`;
            }).map((value, index) => <li key={index}>{value}</li>)}
          </ul>
        );
    }
  };

  return (
    <BaseLayout>
      <Group align="flex-start" style={{ minHeight: 'calc(100vh - 110px)' }}>
        <Stack style={{ minWidth: '420px' }}>
          <Text mb="xl">Products</Text>
          {(data || []).map((prod) => (
            <div key={prod.id} className={classes.productBlock}>
              {/*<div className={classes.deleteBtn}>*/}
              {/*  <ActionIcon radius="xl" variant="filled" size="xs" onClick={() => handleRemoveProduct(prod.id)}>*/}
              {/*    <IconX size={14} />*/}
              {/*  </ActionIcon>*/}
              {/*</div>*/}
              <Text weight="bold">{prod.name}</Text>
              <Checkbox.Group>
                <Stack>
                  {(prod.prices || []).map((price) => (
                    <Checkbox key={price.id} label={resolvePricing(price)} value={price.id} />
                  ))}
                </Stack>
              </Checkbox.Group>
            </div>
          ))}
          {/*<RenderIf condition={productOptions.length > 0}>*/}
          {/*  <RenderIf condition={!showProducts}>*/}
          {/*    <Group position="right" align="center">*/}
          {/*      <Button onClick={() => setShowProducts(true)}>Add another product</Button>*/}
          {/*    </Group>*/}
          {/*  </RenderIf>*/}
          {/*  <RenderIf condition={showProducts}>*/}
          {/*    <Select data={productOptions} onChange={handleAddProduct} />*/}
          {/*  </RenderIf>*/}
          {/*</RenderIf>*/}
        </Stack>
        <Divider orientation="vertical" />
        <div>template</div>
      </Group>
    </BaseLayout>
  );
};

export default authGuard(FormPage);
