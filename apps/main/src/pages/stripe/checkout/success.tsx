import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Group, Stack, Title } from '@mantine/core';
import { IconConfetti } from '@tabler/icons';
import { RenderIf } from 'ui';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutSuccess() {
  const { query } = useRouter();

  const isInternalFlow = query.internal_flow === 'true';

  return (
    <>
      <Head>
        <title>Dealo | Stripe Checkout success</title>
      </Head>
      <BaseLayout hideNavbar>
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <Group>
            <IconConfetti size={88} />
            <Title order={3} size={36} w={360}>Payment received successfully</Title>
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
