import Link from 'next/link';
import { Group, SimpleGrid, Title } from '@mantine/core';

import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import AddBlock from 'components/AddBlock';

const DashboardPage = () => {
  return (
    <BaseLayout>
      <Group position="apart" align="center" mb="xl">
        <Title>Dashboard</Title>
      </Group>
      <SimpleGrid cols={4}>
        <Link href="/form">
          <AddBlock label="Add New Table" />
        </Link>
      </SimpleGrid>
    </BaseLayout>
  );
};

export default authGuard(DashboardPage);
