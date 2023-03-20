/* eslint-disable max-len */
import { Button, Group, Select, Text } from '@mantine/core';
import type Stripe from 'stripe';
import { useState } from 'react';

import type { ExtendedProduct, FormProduct } from 'models/stripe';
import { formatCurrency } from 'utils/numbers';
import RenderIf from 'components/RenderIf';
import ProductBlock from './ProductBlock';

interface Props {
  products: ExtendedProduct[];
  selectedProducts: FormProduct[];
  onAddProduct: (selectedId: string) => void;
  onAddPrice: (productId: string, price: Stripe.Price) => void;
  onRemoveProduct: (productId: string) => void;
  onRemovePrice: (productId: string, priceId: string) => void;
  onToggleFreeTrial: (productId: string, priceId: string) => void;
  onChangeFreeTrialDays: (productId: string, priceId: string, days: number) => void;
}

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

export default function ProductsForm(props: Props) {
  const {
    products,
    selectedProducts,
    onAddProduct,
    onAddPrice,
    onRemoveProduct,
    onRemovePrice,
    onToggleFreeTrial,
    onChangeFreeTrialDays,
  } = props;
  const [showProducts, setShowProducts] = useState(false);

  const handleAddProduct = (selectedId: string) => {
    onAddProduct(selectedId);
    setShowProducts(false);
  };

  const productOptions = products
    .filter((product) => !selectedProducts.some((sProd) => sProd.id === product.id))
    .map((prod) => (prod.prices || []).map((price) => ({ ...price, product: prod.name, productId: prod.id })))
    .flatMap((prices) => prices.map((price) => ({
      label: resolvePricing(price),
      value: `${price.productId}-${price.id}`,
      group: price.product,
    })));

  return (
    <>
      <Text mb="xl">Products</Text>
      {selectedProducts.map((prod) => {
        const baseProduct = products.find((p) => p.id === prod.id)!;

        return (
          <ProductBlock
            key={prod.id}
            value={prod}
            product={baseProduct}
            onAddPrice={onAddPrice}
            onRemove={onRemoveProduct}
            onRemovePrice={onRemovePrice}
            onToggleFreeTrial={onToggleFreeTrial}
            onFreeTrialDaysChange={onChangeFreeTrialDays}
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
    </>
  );
}
