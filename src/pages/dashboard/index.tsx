import { Group, Loader, Stack, Text, Title } from '@mantine/core';

import { api } from 'utils/api';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';

const DashboardPage = () => {
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

  const prodElements = products.data.map((prod) => (
    <Stack key={prod.id} mb="xl">
      <Title order={3}>{prod.name}</Title>
      <Text>{JSON.stringify(prod)}</Text>
    </Stack>
  ));

  return (
    <BaseLayout>
      <Title mb="xl">DashBoard</Title>
      {prodElements}
    </BaseLayout>
  );
};

export default authGuard(DashboardPage);
