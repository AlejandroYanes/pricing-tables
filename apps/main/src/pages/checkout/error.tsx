import { Anchor, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <Stack align="center" justify="center" style={{ height: '100vh' }}>
        <IconAlertTriangle size={48} />
        <Title order={3}>
          Something went wrong, please contact support at {' '}
          <Anchor href="mailto:alejandro.yanes94@gmail.com">alejandro.yanes94@gmail.com</Anchor>
          .
        </Title>
      </Stack>
    </BaseLayout>
  );
}
