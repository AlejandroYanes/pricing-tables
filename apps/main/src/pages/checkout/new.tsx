import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';
import { callAPI } from 'helpers';
import { RenderIf } from 'ui';
import { z } from 'zod';

import BaseLayout from 'components/BaseLayout';

const inputSchema = z.object({
  widget_id: z.string().cuid(),
  product_id: z.string().cuid(),
  price_id: z.string().cuid(),
  email: z.string().email().optional(),
});

export default function NewCheckoutSession() {
  const { query, push } = useRouter();
  const [failed, setFailed] = useState(false);

  const createCheckoutSession = async () => {
    const parsedQuery = inputSchema.safeParse(query);

    if (!parsedQuery.success) {
      setFailed(true);
      return;
    }

    try {
      const response = await callAPI<{ session: string }>({
        url: '/api/checkout/new-session',
        body: parsedQuery.data,
      });
      await push(`/checkout/${response.session}`);
    } catch (err) {
      setFailed(true);
    }
  }

  useEffect(() => {
    createCheckoutSession();
  }, []);

  return (
    <BaseLayout hideNavbar>
      <RenderIf
        condition={!failed}
        fallback={
          <Stack align="center" justify="center" style={{ height: '100vh' }}>
            <IconAlertTriangle size={48} />
            <Title order={3}>Something went wrong, please contact support.</Title>
          </Stack>
        }
      >
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <Loader />
          <Title order={3}>Please bear with us while we generate a new session</Title>
        </Stack>
      </RenderIf>
    </BaseLayout>
  );
}
