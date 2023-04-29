import { Stack, Title } from '@mantine/core';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <Stack align="center" justify="center" style={{ height: '100vh' }}>
        <Title order={3}>Payment canceled.</Title>
      </Stack>
    </BaseLayout>
  );
}
