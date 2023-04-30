import { Group, Stack, Title } from '@mantine/core';
import { IconMoodConfuzed } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <Stack align="center" justify="center" style={{ height: '100vh' }}>
        <Group>
          <IconMoodConfuzed size={88} />
          <Title order={3} size={36} w={360}>Payment was canceled.</Title>
        </Group>
      </Stack>
    </BaseLayout>
  );
}
