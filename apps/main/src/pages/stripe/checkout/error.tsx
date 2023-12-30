import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Anchor, Button, Group, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';
import { RenderIf } from 'ui';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  const { query } = useRouter();

  const isInternalFlow = query.internal_flow === 'true';
  return (
    <>
      <Head>
        <title>Dealo | Stripe Checkout error</title>
      </Head>
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
          <RenderIf condition={isInternalFlow}>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </RenderIf>
        </Stack>
      </BaseLayout>
    </>
  );
}
