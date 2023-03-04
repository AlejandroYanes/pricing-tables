import { Group, Title } from '@mantine/core';

import BaseLayout from 'components/BaseLayout';

const DashboardPage = () => {
  return (
    <BaseLayout>
      <Group position="apart" mb="xl">
        <Title>DashBoard</Title>
      </Group>
    </BaseLayout>
  );
};

export default DashboardPage;
