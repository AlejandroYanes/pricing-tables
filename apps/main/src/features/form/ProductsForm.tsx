'use client'

import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import type Stripe from 'stripe';
import { Autocomplete, Loader, type AutocompleteItem } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import type { DropResult } from 'react-beautiful-dnd';
import { IconAlertCircle, IconChevronDown, IconSelector, IconX } from '@tabler/icons-react';
import type { FormPrice } from '@dealo/models';
import { formatCurrency } from '@dealo/helpers';
import {
  RenderIf,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@dealo/ui';

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
    <div className="flex flex-col justify-center items-center mt-16">
      <Alert>
        <IconAlertCircle size="1rem" />
        <AlertTitle>Ooops....</AlertTitle>
        <AlertDescription>
          Something happened and we {`can't`} connect with Stripe, please try again later.
        </AlertDescription>
      </Alert>
    </div>
  </BaseLayout>
);

export default function ProductsForm(props: Props) {
  const { showPanel, template } = props;

  const { products: selectedProducts } = useWidgetFormStore();
  const [showProducts, setShowProducts] = useState(false);
  const [query, setQuery] = useDebouncedState<string | undefined>(undefined, 200);
  const interactionTimer = useRef<any>(undefined);

  const {
    data,
    isFetching: isFetchingStripeProducts,
    isError: failedToFetchStripeProducts,
  } = trpc.stripe.list.useQuery(query, { refetchOnWindowFocus: false, keepPreviousData: true });
  const products = data || [];

  const handleAddProduct = (selectedId: string) => {
    addProduct(products, selectedId);
    setQuery(undefined);
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
    interactionTimer.current = setTimeout(() => {
      setShowProducts(false);
      setQuery(undefined);
    }, 5000);
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
            product={prod}
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
        <div className="flex items-center justify-end">
          <div className="flex items-center flex-nowrap">
            <Button
              variant="black"
              className="rounded-r-none mr-[1px]"
              onClick={() => {
                setShowProducts(true);
                startInteractionTimer();
              }}
            >
              {selectedProducts.length === 0 ? 'Add a product' : 'Add another product'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button component="span" variant="black" className="rounded-l-none">
                  <IconChevronDown size="1rem" stroke={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={addCustomProduct}>
                  Add a custom product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </RenderIf>
      <RenderIf condition={showProducts}>
        <div
          className="flex items-center"
          onMouseEnter={clearInteractionTimer}
          onMouseLeave={startInteractionTimer}
        >
          {/*<Select onValueChange={handleAddProduct}>*/}
          {/*  <SelectTrigger className="w-full rounded-r-none">*/}
          {/*    <SelectValue />*/}
          {/*  </SelectTrigger>*/}
          {/*  <SelectContent>*/}
          {/*    {productOptions.map((option) => (*/}
          {/*      <SelectItem key={option.value} value={option.value}>*/}
          {/*        {option.label}*/}
          {/*      </SelectItem>*/}
          {/*    ))}*/}
          {/*  </SelectContent>*/}
          {/*</Select>*/}
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
            }}
          />
          <Button
            onClick={() => {
              setQuery(undefined);
              setShowProducts(false);
              clearInteractionTimer();
            }}
            variant="outline"
            className="rounded-l-none border-l-0"
          >
            <IconX size="1rem" stroke={1.5} />
          </Button>
        </div>
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
