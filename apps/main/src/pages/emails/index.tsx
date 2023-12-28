import Head from 'next/head';
import { Button, Stack } from '@mantine/core';

import BaseLayout from 'components/BaseLayout';

export default function EmailsPage () {
  const sendEmail = async () => {
    await fetch('/api/emails/send');
  }
  return (
    <>
      <Head>
        <title>Dealo | Stripe Checkout start</title>
      </Head>
      <BaseLayout showBackButton backRoute="/dashboard" title="Email tests">
        <Stack spacing="lg" justify="center" align="center" style={{ height: '100vh' }}>
          <Button onClick={sendEmail}>Send email</Button>
        </Stack>
      </BaseLayout>
    </>
  );
}
