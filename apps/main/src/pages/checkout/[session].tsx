import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import type Stripe from 'stripe';
import { Group, Loader, Stack, Text, Title } from '@mantine/core';
import { callAPI, formatCurrencyWithoutSymbol, getCurrencySymbol } from 'helpers';
import { IconAlertTriangle } from '@tabler/icons';
import { intervalsMap } from 'templates';
import { RenderIf } from 'ui';

import BaseLayout from 'components/BaseLayout';

type SessionData = {
  color: string;
  product: {
    name: string;
    description: string;
    price: {
      currency: string;
      currency_options: {
        [key: string]: {
          custom_unit_amount: string | null;
          tax_behavior: string;
          unit_amount: number;
          unit_amount_decimal: string;
        };
      };
      unit_amount: number;
      unit_amount_decimal: string;
      billing_scheme: Stripe.Price.BillingScheme;
      recurring: Stripe.Price.Recurring;
      transform_quantity: Stripe.Price.TransformQuantity;
      type: Stripe.Price.Type;
    };
  };
}

const fetchSession = async (session: string) => {
  return callAPI<SessionData>({
    url: `/api/checkout/${session}`,
  });
}

type PricingProps = {
  price: SessionData['product']['price'];
  unitLabel: string | null;
  currency?: string | null;
}

const resolvePricing = (options: PricingProps) => {
  const { price, unitLabel, currency: selectedCurrency } = options;
  const {
    type,
    currency: baseCurrency,
    currency_options,
    billing_scheme,
    transform_quantity,
    recurring,
    unit_amount: baseAmount,
  } = price;

  const { currency, unit_amount } = selectedCurrency && currency_options![selectedCurrency]
    ? {
      currency: selectedCurrency,
      unit_amount: currency_options![selectedCurrency]!.unit_amount,
    } : {
      currency: baseCurrency,
      unit_amount: baseAmount,
    };

  if (type === 'one_time') {
    if (transform_quantity) {
      return (
        <Stack spacing={0} ml="auto" style={{ flexShrink: 0 }}>
          <Group spacing={4}>
            <Text component="sup" size={18} mt={-8}>
              {getCurrencySymbol(currency)}
            </Text>
            <Text size={48} style={{ lineHeight: 1 }}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
          </Group>
          <Text component="sub">
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </Text>
        </Stack>
      );
    }

    return (
      <Group spacing={4} ml="auto" noWrap style={{ flexShrink: 0 }}>
        <Text component="sup">{getCurrencySymbol(currency)}</Text>
        <Text size={48}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
        <RenderIf condition={!!unitLabel}>
          <Text component="sub">{` per ${unitLabel}`}</Text>
        </RenderIf>
      </Group>
    );
  }

  const recurringLabel = intervalsMap[recurring!.interval].long;
  const intervalCount = recurring!.interval_count;

  if (billing_scheme === 'per_unit') {
    if (transform_quantity) {
      return (
        <Stack spacing={0} ml="auto" style={{ flexShrink: 0 }}>
          <Group spacing={4}>
            <Text component="sup" size={18} mt={-8}>
              {getCurrencySymbol(currency)}
            </Text>
            <Text size={48} style={{ lineHeight: 1 }}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
            <Text component="sub" size={18} mb={-8}>
              {`/ ${intervalCount > 1 ? intervalCount : ''}${recurringLabel}`}
            </Text>
          </Group>
          <Text component="sub">
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </Text>
        </Stack>
      );
    }

    return (
      <Group spacing={4} noWrap style={{ flexShrink: 0 }}>
        <Text size={48} style={{ lineHeight: 1 }}>
          {getCurrencySymbol(currency)}
        </Text>
        <Text size={48} style={{ lineHeight: 1 }}>
          {formatCurrencyWithoutSymbol(unit_amount! / 100, false)}
        </Text>
        <Stack spacing={0} ml="xs">
          <Text size="sm">per</Text>
          <Text size="sm">
            {`${intervalCount > 1 ? `${intervalCount} ` : ''}${recurringLabel}`}
          </Text>
        </Stack>
      </Group>
    );
  }

  return 'Unable to resolve pricing';
};

export default function CheckoutSession() {
  const { query } = useRouter();
  const { isFetching, data, isError } = useQuery(
    [`session-${query.session}`],
    () => fetchSession(query.session as string),
    {
      refetchOnWindowFocus: false,
    },
  );

  if (isFetching) {
    return (
      <BaseLayout>
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <Loader />
        </Stack>
      </BaseLayout>
    );
  }

  if (isError || !data) {
    return (
      <BaseLayout>
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <IconAlertTriangle size={48} />
          <Title order={3}>Something went wrong, please contact support.</Title>
        </Stack>
      </BaseLayout>
    );
  }

  const { product } = data;

  return (
    <BaseLayout hideNavbar>
      <Group style={{ maxWidth: '900px', width: '100%', margin: '80px auto' }}>
        <Stack spacing={0}>
          <Title order={1} mb="xl">Checkout</Title>
          <Text>{product.name}</Text>
          <Text size="sm" color="dimmed" mb="md">{product.description}</Text>
          {resolvePricing({
            price: product.price as any,
            unitLabel: null,
            currency: null,
          })}
        </Stack>
        <Stack></Stack>
      </Group>
    </BaseLayout>
  );
}
