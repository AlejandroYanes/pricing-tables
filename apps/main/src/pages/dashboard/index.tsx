import { useState } from 'react';
import Link from 'next/link';
import { Group, SimpleGrid, Title } from '@mantine/core';

import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import AddBlock from 'components/AddBlock';
import TemplatesModal from 'components/TemplatesModal';

const DashboardPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <BaseLayout>
      <Group position="apart" align="center" mb="xl">
        <Title>Dashboard</Title>
      </Group>
      <SimpleGrid cols={4}>
        <AddBlock label="Add new" onClick={() => setShowModal(true)} />
      </SimpleGrid>
      <TemplatesModal opened={showModal} onSelect={() => undefined} onClose={() => setShowModal(false)} />
    </BaseLayout>
  );
};

export default authGuard(DashboardPage);
