import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import type Stripe from 'stripe';
import { ActionIcon, Alert, Button, Group, Menu, Select, Stack, Autocomplete, useMantineTheme, Loader, AutocompleteItem } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import type { DropResult } from 'react-beautiful-dnd';
import { IconChevronDown, IconSelector, IconX } from '@tabler/icons';
import type { FormPrice } from 'models';
import { formatCurrency } from 'helpers';
import { RenderIf } from 'ui';

import { trpc } from 'utils/trpc';
import BaseLayout from 'components/BaseLayout';
import ProductBlock from './ProductBlock';
import TwoColumnsLayout from './TwoColumnsLayout';
import CustomProductBlock from './CustomProductBlock';
import { useWidgetFormStore } from './state';
import {
  addProduct,
  addCustomProduct,
  removeProduct,
  reorderProducts,
  handleAddPrice,
  removePrice,
  toggleFreeTrial,
  changeFreeTrialDays,
  changeCustomCtaName,
  changeCustomCtaLabel,
  changeCustomCTAUrl,
  changeCustomCTADescription,
} from './state/actions';

interface Props {
  showPanel: boolean;
  template: ReactNode;
  // products: FormProduct[];
}

const intervalMap: Record<Stripe.Price.Recurring.Interval, string> = {
  day: 'day',
  week: 'we',
  month: 'mo',
  year: 'yr',
};

const resolvePricing = (price: FormPrice): string => {
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
      ' /',
      intervalCount > 1 ? `${intervalCount} ` : '',
      recurringLabel,
    ];
    return sections.join('');
  }

  return 'Unable to resolve pricing';
};

const noStripeScreen = (
  <BaseLayout showBackButton>
    <Stack mt={60} justify="center" align="center">
      <Alert title="Ooops..." variant="outline" color="gray">
        Something happened and we {`can't`} connect with Stripe, please try again later.
      </Alert>
    </Stack>
  </BaseLayout>
);

export default function ProductsForm(props: Props) {
  const { showPanel, template } = props;

  const { products: selectedProducts } = useWidgetFormStore();
  const [showProducts, setShowProducts] = useState(false);
  const [query, setQuery] = useDebouncedState<string | undefined>(undefined, 200);
  const theme = useMantineTheme();
  const interactionTimer = useRef<any>(undefined);

  const {
    data,
    isFetching: isFetchingStripeProducts,
    isError: failedToFetchStripeProducts,
  } = trpc.stripe.list.useQuery(query, { refetchOnWindowFocus: false, keepPreviousData: true });
  const products = data || [];

  const handleAddProduct = (selectedId: string) => {
    addProduct(products, selectedId);
    setShowProducts(false);

    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = undefined;
    }
  };

  const startInteractionTimer = () => {
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = undefined;
    }
    interactionTimer.current = setTimeout(() => setShowProducts(false), 5000);
  }

  const clearInteractionTimer = () => {
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = undefined;
    }
  }

  if (failedToFetchStripeProducts) {
    return noStripeScreen;
  }

  const productOptions = products
    .filter((product) => !selectedProducts.some((sProd) => sProd.id === product.id))
    .map((prod) => (prod.prices || []).map((price) => ({ ...price, product: prod.name, productId: prod.id })))
    .flatMap((prices) => prices.map((price) => ({
      label: resolvePricing(price),
      key: `${price.productId}-${price.id}`,
      value: price.product,
      group: price.product,
    })));

  const panelContent = (
    <>
      {selectedProducts.map((prod, index) => {
        const baseProduct = products.find((p) => p.id === prod.id)!;
        const isFirst = index === 0;
        const isLast = index === selectedProducts.length - 1;

        const onMoveToTop = () => {
          reorderProducts({
            source: { index, droppableId: 'products' },
            destination: { index: 0, droppableId: 'products' },
          } as DropResult);
        };

        const onMoveUp = () => {
          reorderProducts({
            source: { index, droppableId: 'products' },
            destination: { index: index - 1, droppableId: 'products' },
          } as DropResult);
        };

        const onMoveDown = () => {
          reorderProducts({
            source: { index, droppableId: 'products' },
            destination: { index: index + 1, droppableId: 'products' },
          } as DropResult);
        };

        const onMoveToBottom = () => {
          reorderProducts({
            source: { index, droppableId: 'products' },
            destination: { index: selectedProducts.length - 1, droppableId: 'products' },
          } as DropResult);
        };

        if (prod.isCustom) {
          return (
            <CustomProductBlock
              isFirst={isFirst}
              isLast={isLast}
              key={prod.id}
              value={prod}
              onRemove={() => removeProduct(index)}
              onCTANameChange={(value) => changeCustomCtaName(index, value)}
              onCTALabelChange={(value) => changeCustomCtaLabel(index, value)}
              onCTAUrlChange={(value) => changeCustomCTAUrl(index, value)}
              onDescriptionChange={(value) => changeCustomCTADescription(index, value)}
              onMoveToTop={onMoveToTop}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onMoveToBottom={onMoveToBottom}
            />
          );
        }

        return (
          <ProductBlock
            isFirst={isFirst}
            isLast={isLast}
            key={prod.id}
            value={prod}
            product={baseProduct}
            onAddPrice={handleAddPrice}
            onRemove={() => removeProduct(index)}
            onRemovePrice={removePrice}
            onToggleFreeTrial={toggleFreeTrial}
            onFreeTrialDaysChange={changeFreeTrialDays}
            onMoveToTop={onMoveToTop}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onMoveToBottom={onMoveToBottom}
          />
        );
      })}
      <RenderIf condition={!showProducts}>
        <Group position="right" align="center">
          <Group noWrap spacing={1}>
            <Button
              onClick={() => {
                setShowProducts(true);
                // startInteractionTimer();
              }}
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
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
                <Menu.Item onClick={addCustomProduct}>
                  Add a custom product
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </RenderIf>
      <RenderIf condition={showProducts}>
        <Group
          spacing={0}
        // onMouseEnter={clearInteractionTimer}
        // onMouseLeave={startInteractionTimer}
        >
          <Autocomplete
            initiallyOpened
            data={productOptions}
            value={query}
            onChange={setQuery}
            onItemSubmit={(item: AutocompleteItem) => handleAddProduct(item.key)}
            maxDropdownHeight={300}
            rightSection={isFetchingStripeProducts ? <Loader size={16} /> : <IconSelector size={16} />}
            nothingFound={isFetchingStripeProducts ? 'Loading...' : 'No products found'}
            style={{ flex: 1 }}
            styles={{
              input: {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
              separatorLabel: {
                color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9],
              },
            }}
          />
          {/* <Select
            initiallyOpened
            searchable
            data={productOptions}
            onChange={handleAddProduct}
            onSearchChange={setQuery}
            rightSection={isFetchingStripeProducts ? <Loader size={16} /> : <IconSelector size={16} />}
            nothingFound={isFetchingStripeProducts ? 'Loading...' : 'No products found'}
            style={{ flex: 1 }}
            styles={{
              input: {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
              separatorLabel: {
                color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9],
              },
            }}
          /> */}
          <ActionIcon
            onClick={() => {
              setShowProducts(false);
              setQuery(undefined);
              // clearInteractionTimer();
            }}
            variant="default"
            size={36}
            style={{ borderLeft: 'none', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            <IconX size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
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
