import { Fragment, useRef, useState } from 'react';
import type Stripe from 'stripe';
import {
  ActionIcon,
  Checkbox,
  createStyles,
  Divider,
  Group,
  Menu,
  NumberInput,
  Select,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconChevronDown,
  IconChevronsDown,
  IconChevronsUp,
  IconDotsVertical,
  IconTrash,
  IconX
} from '@tabler/icons';
import type { FormPrice, FormProduct } from 'models';
import { formatCurrency } from 'helpers';
import { RenderIf } from 'ui';

interface Props {
  isFirst: boolean;
  isLast: boolean;
  product: FormProduct;
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

const useStyles = createStyles((theme) => ({
  productBlock: {
    position: 'relative',
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[4]}`,
    borderRadius: '4px',
    marginBottom: '16px',
  },
  deleteBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px'
  },
  flatButton: {
    fontWeight: 600,
    fontSize: '14px',
    ['&:hover']: {
      cursor: 'pointer',
      color: theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor]![4] : theme.colors[theme.primaryColor]![7],
    },
  },
  actionButton: {
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderRadius: 0,
    borderBottomRightRadius: '3px',
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
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const [showPriceSelect, setShowPriceSelect] = useState(false);
  const interactionTimer = useRef<any>(undefined);

  const handleSelectPrice = (priceId: string) => {
    const selectedPrice = product.prices.find((price) => price.id === priceId);

    if (!selectedPrice) return;
    onAddPrice(product.id, selectedPrice);
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

  const selectedPrices = product.prices.filter(p => p.isSelected);
  const remainingPrices = product.prices.length - selectedPrices.length;
  const hasMorePrices = remainingPrices > 0;

  const priceOptions = product.prices
    .filter(p => !p.isSelected)
    .map((price) => ({
      label: resolvePricing(price),
      value: price.id,
    }));

  return (
    <div className={classes.productBlock}>
      <div className={classes.deleteBtn}>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon>
              <IconDotsVertical size={14} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item disabled={isFirst} onClick={onMoveToTop} icon={<IconChevronsUp size={14} />}>Move to top</Menu.Item>
            <Menu.Item disabled={isFirst} onClick={onMoveUp} icon={<IconChevronsUp size={14} />}>Move up</Menu.Item>
            <Menu.Item disabled={isLast} onClick={onMoveDown} icon={<IconChevronDown size={14} />}>Move down</Menu.Item>
            <Menu.Item disabled={isLast} onClick={onMoveToBottom} icon={<IconChevronsDown size={14} />}>Move to bottom</Menu.Item>

            <Menu.Divider />
            <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={onRemove}>Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <Group spacing={4}>
        <Text weight="bold" py={16} pl={16}>{product.name}</Text>
        <RenderIf condition={!product.active}>
          <Tooltip label={disabledProductLabel} width={280} multiline position="right">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconAlertCircle size={18} />
            </div>
          </Tooltip>
        </RenderIf>
      </Group>
      <Stack>
        {(selectedPrices || []).map((price, index, list) => (
          <Fragment key={price.id}>
            <Divider orientation="horizontal" />
            <Stack px={16} pb={!hasMorePrices ? 16 : 0} spacing="sm" style={{ position: 'relative' }}>
              <RenderIf condition={list.length > 1}>
                <div className={classes.deleteBtn}>
                  <ActionIcon radius="xl" onClick={() => onRemovePrice(product.id, price.id)}>
                    <IconX size={14} />
                  </ActionIcon>
                </div>
              </RenderIf>
              <Group align="center" spacing={4}>
                <Text component="span">
                  {resolvePricing(price)}
                </Text>
                <RenderIf condition={!price.active}>
                  <Tooltip label={disabledPriceLabel} width={280} multiline position="right">
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <IconAlertCircle size={18} />
                    </span>
                  </Tooltip>
                </RenderIf>
              </Group>
              <Checkbox
                label="Include free trial"
                checked={price.hasFreeTrial}
                onChange={() => undefined}
                onClick={() => onToggleFreeTrial(product.id, price.id)}
              />
              <RenderIf condition={price.hasFreeTrial}>
                <NumberInput
                  mb="xs"
                  label="Days"
                  min={1}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  value={price.freeTrialDays}
                  onChange={(days) => onFreeTrialDaysChange(product.id, price.id, days! as number)}
                />
              </RenderIf>
            </Stack>
            <RenderIf condition={index === list.length - 1 && hasMorePrices}>
              <Divider orientation="horizontal" />
            </RenderIf>
          </Fragment>
        ))}
      </Stack>
      <RenderIf condition={hasMorePrices}>
        <RenderIf
          condition={!showPriceSelect}
          fallback={
            <Group
              spacing={0}
              h={42}
              onMouseEnter={clearInteractionTimer}
              onMouseLeave={startInteractionTimer}
            >
              <Select
                initiallyOpened
                radius="xs"
                style={{ flex: 1 }}
                styles={{
                  input: {
                    height: 42,
                    border: 'none',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 3,
                  },
                  separatorLabel: {
                    color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[9],
                  },
                }}
                data={priceOptions}
                onChange={handleSelectPrice}
              />
              <ActionIcon
                onClick={() => {
                  setShowPriceSelect(false);
                  clearInteractionTimer();
                }}
                variant="default"
                size={42}
                className={classes.actionButton}
              >
                <IconX size="1rem" stroke={1.5} />
              </ActionIcon>
            </Group>
          }
        >
          <Group h={42} px={16} py={10} align="center" position="apart">
            <Text color="dimmed" size="sm">
              {`${remainingPrices} ${remainingPrices > 1 ? 'prices' : 'price'} remaining`}
            </Text>
            <UnstyledButton
              className={classes.flatButton}
              onClick={() => {
                setShowPriceSelect(true);
              }}
            >
              Add another price
            </UnstyledButton>
          </Group>
        </RenderIf>
      </RenderIf>
    </div>
  );
}
