import { useState } from 'react';
import { useRouter } from 'next/router';
import { Group, SimpleGrid, Title } from '@mantine/core';

import { trpc } from 'utils/trpc';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import AddBlock from 'components/AddBlock';
import TemplatesModal from 'components/TemplatesModal';

const DashboardPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { mutate, isLoading } = trpc.widgets.create.useMutation({
    onSuccess: (widgetId: string) => router.push(`/form/${widgetId}`),
  });

  return (
    <BaseLayout>
      <Group position="apart" align="center" mb="xl">
        <Title>Dashboard</Title>
      </Group>
      <SimpleGrid cols={4}>
        <AddBlock label="Add new" onClick={() => setShowModal(true)} />
      </SimpleGrid>
      <TemplatesModal
        opened={showModal}
        loading={isLoading}
        onSelect={async (template: string) => mutate({ template })}
        onClose={() => setShowModal(false)}
      />
    </BaseLayout>
  );
};

export default authGuard(DashboardPage);
