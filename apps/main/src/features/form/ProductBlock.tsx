import { Fragment, useRef, useState } from 'react';
import type Stripe from 'stripe';
import {
  IconAlertCircle,
  IconChevronDown,
  IconChevronsDown,
  IconChevronsUp,
  IconDotsVertical,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import type { FormPrice, FormProduct } from '@dealo/models';
import { formatCurrency } from '@dealo/helpers';
import { RenderIf } from '@dealo/ui';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from 'components/ui/dropdown-menu';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from 'components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';

interface Props {
  isFirst: boolean;
  isLast: boolean;
  product: FormProduct;
  value: FormProduct;
  onAddPrice: (productId: string, price: FormPrice) => void;
  onRemove: () => void;
  onRemovePrice: (productId: string, priceId: string) => void;
  onToggleFreeTrial: (productId: string, priceId: string) => void;
  onFreeTrialDaysChange: (productId: string, priceId: string, days: number) => void;
  onMoveToTop: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToBottom: () => void;
}

const intervalMap: Record<Stripe.Price.Recurring.Interval, string> = {
  day: 'day',
  week: 'we',
  month: 'mo',
  year: 'yr',
};

const resolvePricing = (price: FormPrice): string => {
  if (price.type === 'one_time') {
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
        ' units /',
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

const disabledProductLabel = `
This product is disabled on Stripe, we keep showing it so you can take action,
but it will not show on the widget on your web page.
`;

const disabledPriceLabel = `
This price is disabled on Stripe, we keep showing it so you can take action,
but it will not show on the widget on your web page.
`;

export default function ProductBlock(props: Props) {
  const {
    isFirst,
    isLast,
    product,
    value,
    onAddPrice,
    onRemove,
    onRemovePrice,
    onToggleFreeTrial,
    onFreeTrialDaysChange,
    onMoveToTop,
    onMoveUp,
    onMoveDown,
    onMoveToBottom,
  } = props;
  // const { classes } = useStyles();
  // const theme = useMantineTheme();

  const [showPriceSelect, setShowPriceSelect] = useState(false);
  const interactionTimer = useRef<any>(undefined);

  const handleSelectPrice = (priceId: string) => {
    const selectedPrice = product.prices.find((price) => price.id === priceId);

    if (!selectedPrice) return;
    onAddPrice(value.id, selectedPrice);
    setShowPriceSelect(false);
    clearInteractionTimer();
  };

  const startInteractionTimer = () => {
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = undefined;
    }
    interactionTimer.current = setTimeout(() => setShowPriceSelect(false), 5000);
  }

  const clearInteractionTimer = () => {
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = undefined;
    }
  }

  const hasMorePrices = product.prices.length - value.prices.length > 0;
  const remainingPrices = product.prices.length - value.prices.length;

  const priceOptions = product.prices
    .filter((price) => !value.prices.some((sp) => sp.id === price.id))
    .map((price) => ({
      label: resolvePricing(price),
      value: price.id,
    }));

  return (
    <div className="relative rounded-sm mb-4 border-solid border border-neutral-200 dark:border-neutral-700">
      <div className="absolute top-1 right-1">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button component="span" variant="ghost" size="sm" className="h-7 p-2">
              <IconDotsVertical size={14} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuItem disabled={isFirst} onClick={onMoveToTop}>
              <IconChevronsUp size={14} />
              Move to top
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isFirst} onClick={onMoveUp}>
              <IconChevronsUp size={14} />
              Move up
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isLast} onClick={onMoveDown}>
              <IconChevronDown size={14} />
              Move down
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isLast} onClick={onMoveToBottom}>
              <IconChevronsDown size={14} />
              Move to bottom
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={onRemove}>
              <IconTrash size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <span className="py-4 pl-4 text font-bold">{value.name}</span>
        <RenderIf condition={!product.active}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <IconAlertCircle size={18} />
              </TooltipTrigger>
              <TooltipContent className="w-[280px]">
                {disabledProductLabel}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </RenderIf>
      </div>
      <div className="flex flex-col">
        {(value.prices || []).map((price, index, list) => (
          <Fragment key={price.id}>
            {/* eslint-disable-next-line max-len */}
            <div className={`flex flex-col px-4 py-2 gap-2 border-t ${index === list.length - 1 && hasMorePrices ? 'border-b' : ''} border-neutral-200 dark:border-neutral-700 relative ${hasMorePrices ? 'pb-4' : ''}`}>
              <RenderIf condition={list.length > 1}>
                <div className="absolute top-1 right-1">
                  <Button className="rounded-full h-7 px-2" variant="ghost" size="sm" onClick={() => onRemovePrice(value.id, price.id)}>
                    <IconX size={14} />
                  </Button>
                </div>
              </RenderIf>
              <div className="flex items-center gap-1">
                <span className="text">
                  {resolvePricing(price)}
                </span>
                <RenderIf condition={!price.active}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <IconAlertCircle size={18} />
                      </TooltipTrigger>
                      <TooltipContent className="w-[280px]">{disabledPriceLabel}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </RenderIf>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`free-trial-checkbox-${price.id}`}
                  checked={price.hasFreeTrial}
                  onChange={() => undefined}
                  onClick={() => onToggleFreeTrial(value.id, price.id)}
                />
                <Label htmlFor={`free-trial-checkbox-${price.id}`} className="cursor-pointer">
                  Include free trial
                </Label>
              </div>
              <RenderIf condition={price.hasFreeTrial}>
                <div className="flex flex-col gap-2 mb-2">
                  <Label htmlFor="free-trial-days">Days</Label>
                  <Input
                    id="free-trial-days"
                    type="number"
                    min={1}
                    value={price.freeTrialDays}
                    onChange={(event) => onFreeTrialDaysChange(value.id, price.id, Number(event.target.value))}
                  />
                </div>
              </RenderIf>
            </div>
          </Fragment>
        ))}
      </div>
      <RenderIf condition={hasMorePrices}>
        <RenderIf
          condition={showPriceSelect}
          fallback={
            <div className="flex justify-between items-center h-[42px] px-4 py-3">
              <span className="text text-sm text-neutral-500 dark:text-neutral-300">
                {`${remainingPrices} ${remainingPrices > 1 ? 'prices' : 'price'} remaining`}
              </span>
              <Button
                variant="link"
                className="p-0"
                onClick={() => {
                  setShowPriceSelect(true);
                }}
              >
                Add another price
              </Button>
            </div>
          }
        >
          <div
            className="flex items-center h-[42px]"
            onMouseEnter={clearInteractionTimer}
            onMouseLeave={startInteractionTimer}
          >
            <Select onValueChange={handleSelectPrice} defaultOpen>
              <SelectTrigger className="rounded-r-none rounded-tl-none rounded-bl-[3px] border-y-0 border-l-0 h-[42px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setShowPriceSelect(false);
                clearInteractionTimer();
              }}
              variant="ghost"
              className="h-[42px] rounded-l-none rounded-tr-none rounded-br-[3px]"
            >
              <IconX size="1rem" stroke={1.5} />
            </Button>
          </div>
        </RenderIf>
      </RenderIf>
    </div>
  );
}
