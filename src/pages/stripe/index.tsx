import { Button, Group, Loader, Stack, Text, Title } from '@mantine/core';
import type Stripe from 'stripe';

import { api } from 'utils/api';
import { formatCurrency } from 'utils/numbers';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import RenderIf from '../../components/RenderIf';

const emojies = ['🐢', '🐎', '🚗'];

const StripePage = () => {
  const { data: products, isLoading } = api.products.list.useQuery(undefined, { refetchOnWindowFocus: false });

  if (isLoading) {
    return (
      <BaseLayout>
        <Title mb="xl">DashBoard</Title>
        <Group position="center">
          <Loader size="xl" />
        </Group>
      </BaseLayout>
    );
  }

  if (!products) {
    return (
      <BaseLayout>
        <Title mb="xl">DashBoard</Title>
        <Text mt="">There are no products to list...</Text>
      </BaseLayout>
    );
  }

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

  const prodElements = products.map((prod, pIndex) => (
    <Stack key={prod.id} mb="xl" align="center" spacing={2} sx={{ minWidth: '380px' }}>
      <Title order={3}>{prod.name}</Title>
      <Text mb="xl">{prod.description}</Text>
      <span style={{ fontSize: '72px' }}>{emojies[pIndex]}</span>
      {(prod.prices || []).map((price, prIndex) => (
        <>
          <Text key={price.id} weight={prod.default_price === price.id ? 'bold' : 'regular'}>
            {resolvePricing(price)}
          </Text>
          <RenderIf condition={prIndex < prod.prices!.length - 1}>
            or
          </RenderIf>
        </>
      ))}
    </Stack>
  ));

  return (
    <BaseLayout>
      <Group position="apart" align="center" mb="xl">
        <Title>Stripe integration</Title>
        <Button variant="filled">Create New</Button>
      </Group>
      <Group mt="xl" position="center">
        {prodElements}
      </Group>
    </BaseLayout>
  );
};

export default authGuard(StripePage);
