import { ActionIcon, Button, Group, Menu, Select, useMantineTheme } from '@mantine/core';
import type Stripe from 'stripe';
import type { ReactNode} from 'react';
import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons';
import type { ExtendedProduct, FormProduct } from 'models';
import { formatCurrency } from 'helpers';
import { RenderIf } from 'ui';

import ProductBlock from './ProductBlock';
import TwoColumnsLayout from './TwoColumnsLayout';
import CustomProductBlock from './CustomProductBlock';

interface Props {
  showPanel: boolean;
  template: ReactNode;
  products: ExtendedProduct[];
  selectedProducts: FormProduct[];
  onAddProduct: (selectedId: string) => void;
  onAddPrice: (productId: string, price: Stripe.Price) => void;
  onRemoveProduct: (index: number) => void;
  onRemovePrice: (productId: string, priceId: string) => void;
  onToggleFreeTrial: (productId: string, priceId: string) => void;
  onChangeFreeTrialDays: (productId: string, priceId: string, days: number) => void;
  onAddCustomProduct: () => void;
  onCustomCTANameChange: (index: number, nextName: string) => void;
  onCustomCTALabelChange: (index: number, nextLabel: string) => void;
  onCustomCTAUrlChange: (index: number, nextLabel: string) => void;
  onCustomCTADescriptionChange: (index: number, nextDescription: string) => void;
}

const intervalMap: Record<Stripe.Price.Recurring.Interval, string> = {
  day: 'day',
  week: 'we',
  month: 'mo',
  year: 'yr',
};

const resolvePricing = (price: Stripe.Price): string => {
  if (price.type === 'one_time') {
    if (price.transform_quantity) {
      return `${formatCurrency(price.unit_amount! / 100, price.currency)} per every ${price.transform_quantity.divide_by} units`;
    }
    return formatCurrency(price.unit_amount! / 100, price.currency);
  }

  const recurringLabel = intervalMap[price.recurring!.interval];
  const intervalCount = price.recurring!.interval_count;

  if (price.billing_scheme === 'per_unit') {
    if (price.transform_quantity) {
      const sections = [
        formatCurrency(price.unit_amount! / 100, price.currency),
        ' per every ',
        price.transform_quantity.divide_by,
        ' units every /',
        intervalCount > 1 ? `${intervalCount} ` : '',
        recurringLabel
      ];
      return sections.join('');
    }

    const sections = [
      formatCurrency(price.unit_amount! / 100, price.currency),
      '/',
      intervalCount > 1 ? `${intervalCount} ` : '',
      recurringLabel,
    ];
    return sections.join('');
  }

  return 'Unable to resolve pricing';

  // disabled for now (https://github.com/AlejandroYanes/pricing-tables/issues/22)
  // switch (price.tiers_mode) {
  //   case 'volume': {
  //     const tier = price.tiers![0]!;
  //     return `Starts at ${formatCurrency(tier.unit_amount! / 100, price.currency)} for the first ${tier.up_to} units /${recurringLabel}`;
  //   }
  //   case 'graduated': {
  //     const tier = price.tiers![0]!;
  //     return `Starts at ${formatCurrency(tier.unit_amount! / 100, price.currency)} /${recurringLabel}`;
  //   }
  //   default:
  //     return 'No price';
  // }
};

export default function ProductsForm(props: Props) {
  const {
    showPanel,
    template,
    products,
    selectedProducts,
    onAddProduct,
    onAddCustomProduct,
    onAddPrice,
    onRemoveProduct,
    onRemovePrice,
    onToggleFreeTrial,
    onChangeFreeTrialDays,
    onCustomCTANameChange,
    onCustomCTALabelChange,
    onCustomCTAUrlChange,
    onCustomCTADescriptionChange,
  } = props;
  const [showProducts, setShowProducts] = useState(false);

  const theme = useMantineTheme();

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

  const panelContent = (
    <>
      {selectedProducts.map((prod, index) => {
        const baseProduct = products.find((p) => p.id === prod.id)!;

        if (prod.isCustom) {
          return (
            <CustomProductBlock
              key={prod.id}
              value={prod}
              onRemove={() => onRemoveProduct(index)}
              onCTANameChange={(value) => onCustomCTANameChange(index, value)}
              onCTALabelChange={(value) => onCustomCTALabelChange(index, value)}
              onCTAUrlChange={(value) => onCustomCTAUrlChange(index, value)}
              onDescriptionChange={(value) => onCustomCTADescriptionChange(index, value)}
            />
          );
        }

        return (
          <ProductBlock
            key={prod.id}
            value={prod}
            product={baseProduct}
            onAddPrice={onAddPrice}
            onRemove={() => onRemoveProduct(index)}
            onRemovePrice={onRemovePrice}
            onToggleFreeTrial={onToggleFreeTrial}
            onFreeTrialDaysChange={onChangeFreeTrialDays}
          />
        );
      })}
      <RenderIf condition={productOptions.length > 0}>
        <RenderIf condition={!showProducts}>
          <Group position="right" align="center">
            <Group noWrap spacing={1}>
              <Button onClick={() => setShowProducts(true)} style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                {selectedProducts.length === 0 ? 'Add a product' : 'Add another product'}
              </Button>
              <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon
                    variant="filled"
                    color="primary"
                    size={36}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  >
                    <IconChevronDown size="1rem" stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={onAddCustomProduct}>
                    Add a custom product
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </RenderIf>
        <RenderIf condition={showProducts}>
          <Select
            data={productOptions}
            onChange={handleAddProduct}
            styles={{
              separatorLabel: {
                color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9],
              },
            }}
          />
        </RenderIf>
      </RenderIf>
    </>
  );

  return (
    <TwoColumnsLayout
      leftContent={showPanel ? panelContent : null}
      rightContent={template}
    />
  );
}
