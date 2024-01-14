import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import type Stripe from 'stripe';
import type { DropResult } from 'react-beautiful-dnd';
import { IconAlertCircle, IconChevronDown, IconSearch, IconSelector, IconX } from '@tabler/icons-react';
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  Loader,
  Input, useToast,
} from '@dealo/ui';

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
  toggleFreeTrial,
  changeFreeTrialDays,
  changeFreeTrialEndAction,
  handleAddPrice,
  removePrice,
  removeProduct,
  reorderProducts,
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [apiQuery, setApiQuery] = useState<string | undefined>(undefined);
  const { debounceCall } = useDebounce(250);

  const interactionTimer = useRef<any>(undefined);

  const { toast } = useToast();

  const {
    data,
    isFetching: isFetchingStripeProducts,
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

  const handleAddCustomProduct = () => {
    const success = addCustomProduct();
    if (!success) {
      toast({
        variant: 'destructive',
        description: 'You can only have 2 custom products',
      });
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
            onFreeTrialEndActionChange={changeFreeTrialEndAction}
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
                <DropdownMenuItem onClick={handleAddCustomProduct}>
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
          <Popover open={showDropdown} onOpenChange={setShowDropdown}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={showDropdown}
                className="justify-between rounded-r-none flex-1 font-normal"
              >
                Select a product...
                <RenderIf
                  condition={isFetchingStripeProducts}
                  fallback={<IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                >
                  <Loader size="xs" color="black" />
                </RenderIf>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <div className="flex items-center justify-between px-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <IconSearch className="h-4 w-4 stroke-slate-500" />
                <Input
                  value={query || ''}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  variant="undecorated"
                  className="border-none outline-none pl-2 pr-0"
                />
              </div>
              <ul className="flex flex-col gap-1">
                {productOptions.map((product) => (
                  <li key={product.id} className="flex flex-col p-1">
                    <span className="text text-sm text-slate-500 pl-1 mb-1">{product.name}</span>
                    <ul className="flex flex-col">
                      {product.prices.map((price) => (
                        <li key={price.id}>
                          <Button
                            variant="undecorated"
                            className="p-1 pl-2 h-auto w-full justify-start rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => handleAddProduct(product.id, price.id)}
                          >
                            {resolvePricing(price)}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <RenderIf condition={productOptions.length === 0}>
                <div className="flex flex-col items-center justify-center p-4">
                  <span className="text text-slate-500">No products found</span>
                </div>
              </RenderIf>
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => {
              setQuery(undefined);
              setApiQuery(undefined);
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
