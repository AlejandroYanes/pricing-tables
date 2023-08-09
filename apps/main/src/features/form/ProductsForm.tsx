import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import type Stripe from 'stripe';
import { Alert, Button, createStyles, Divider, Group, Menu, Popover, Stack, Text, TextInput, UnstyledButton } from '@mantine/core';
import type { DropResult } from 'react-beautiful-dnd';
import { IconChevronDown, IconX } from '@tabler/icons';
import type { FormPrice } from 'models';
import { formatCurrency } from 'helpers';
import { RenderIf } from 'ui';

import { trpc } from 'utils/trpc';
import { useDebounce } from 'utils/hooks/useDebounce';
import BaseLayout from 'components/BaseLayout';
import ProductBlock from './ProductBlock';
import TwoColumnsLayout from './TwoColumnsLayout';
import CustomProductBlock from './CustomProductBlock';
import { useWidgetFormStore } from './state';
import {
  addCustomProduct,
  addProduct,
  changeCustomCTADescription,
  changeCustomCtaLabel,
  changeCustomCtaName,
  changeCustomCTAUrl,
  changeFreeTrialDays,
  handleAddPrice,
  removePrice,
  removeProduct,
  reorderProducts,
  toggleFreeTrial,
} from './state/actions';

interface Props {
  showPanel: boolean;
  template: ReactNode;
}

const useStyles = createStyles((theme) => ({
  productList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  productGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: theme.spacing.md,
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    width: '100%',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
    }
  },
}));

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

  const { classes } = useStyles();

  const { products: selectedProducts } = useWidgetFormStore();
  const [showProducts, setShowProducts] = useState(false);
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [apiQuery, setApiQuery] = useState<string | undefined>(undefined);
  const { debounceCall } = useDebounce(250);
  const interactionTimer = useRef<any>(undefined);

  const {
    data,
    isError: failedToFetchStripeProducts,
  } = trpc.stripe.list.useQuery(apiQuery, { refetchOnWindowFocus: false, keepPreviousData: true });
  const products = data || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debounceCall(() => {
      setApiQuery(value);
    });
  };

  const handleAddProduct = (productId: string, priceId: string) => {
    addProduct(products, productId, priceId);
    setQuery(undefined);
    setApiQuery(undefined);
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
      setApiQuery(undefined);
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

  const productOptions = products.filter((product) => !selectedProducts.some((sProd) => sProd.id === product.id));

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
        <Group position="right" align="center">
          <Group noWrap spacing={1}>
            <Button
              onClick={() => {
                setShowProducts(true);
                startInteractionTimer();
              }}
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              {selectedProducts.length === 0 ? 'Add a product' : 'Add another product'}
            </Button>
            <Menu transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
              <Menu.Target>
                <Button
                  style={{
                    padding: 0,
                    width: 36,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <IconChevronDown size="1rem" stroke={1.5} />
                </Button>
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
          spacing={1}
          onMouseEnter={clearInteractionTimer}
          onMouseLeave={startInteractionTimer}
        >
          <Popover position="bottom" shadow="md" width="target">
            <Popover.Target>
              <Button style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                Select a product
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <TextInput placeholder="Search for products..." value={query} onChange={handleSearch} />
              <Divider orientation="horizontal" my="md" />
              <ul className={classes.productList}>
                {productOptions.map((product) => (
                  <li key={product.id} className={classes.productGroup}>
                    <Text color="dimmed" mb={4}>{product.name}</Text>
                    <ul style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', listStyle: 'none', padding: '0' }}>
                      {product.prices.map((price) => (
                        <li key={price.id}>
                          <UnstyledButton
                            className={classes.productItem}
                            onClick={() => handleAddProduct(product.id, price.id)}
                          >
                            {resolvePricing(price)}
                          </UnstyledButton>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <RenderIf condition={productOptions.length === 0}>
                <Stack justify="center" align="center" p={16}>
                  <span className="text text-slate-500">No products found</span>
                </Stack>
              </RenderIf>
            </Popover.Dropdown>
          </Popover>
          <Button
            onClick={() => {
              setShowProducts(false);
              setQuery(undefined);
              clearInteractionTimer();
            }}
            style={{
              padding: 0,
              width: 36,
              borderLeft: 'none',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            <IconX size="1rem" stroke={1.5} />
          </Button>
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
