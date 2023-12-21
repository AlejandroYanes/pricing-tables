import { Anchor, Group, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <Stack align="center" justify="center" style={{ height: '100vh' }}>
        <Group>
          <IconAlertTriangle size={88} />
          <Title order={3} w={480}>
            Something went wrong, please contact support at {' '}
            <Anchor href="mailto:support@dealo.app">support@dealo.app</Anchor>
            .
          </Title>
        </Group>
      </Stack>
    </BaseLayout>
  );
}
