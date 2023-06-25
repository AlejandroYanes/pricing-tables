import { Anchor, Group, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <Stack align="center" justify="center" style={{ height: '100vh' }}>
        <Group>
          <IconAlertTriangle size={88} />
          <Title order={3} w={480}>
            Something went wrong, please contact support at {' '}
            <Anchor href="mailto:alejandro.yanes94@gmail.com">alejandro.yanes94@gmail.com</Anchor>
            .
          </Title>
        </Group>
      </Stack>
    </BaseLayout>
  );
}
