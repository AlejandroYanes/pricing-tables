import { Group, Stack, Title } from '@mantine/core';
import { IconConfetti } from '@tabler/icons-react';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <Stack align="center" justify="center" style={{ height: '100vh' }}>
        <Group>
          <IconConfetti size={88} />
          <Title order={3} size={36} w={360}>Payment received successfully</Title>
        </Group>
      </Stack>
    </BaseLayout>
  );
}
