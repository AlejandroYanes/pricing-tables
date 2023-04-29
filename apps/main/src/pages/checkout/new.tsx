import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Anchor, Loader, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';
import { callAPI } from 'helpers';
import { RenderIf } from 'ui';
import { z } from 'zod';

import { cuidZodValidator, isEmptyObject } from 'utils/validations';
import BaseLayout from 'components/BaseLayout';

const inputSchema = z.object({
  widget_id: z.string().cuid(),
  product_id: cuidZodValidator,
  price_id: cuidZodValidator,
  email: z.string().email().optional(),
});

export default function NewCheckoutSession() {
  const { query, push } = useRouter();

  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  const createCheckoutSession = async () => {
    setStarted(true);
    const parsedQuery = inputSchema.safeParse(query);

    if (!parsedQuery.success) {
      setFailed(true);
      return;
    }

    try {
      const response = await callAPI<{ session: string }>({
        method: 'POST',
        url: '/api/checkout/create',
        body: parsedQuery.data,
      });
      await push(`/checkout/session/${response.session}`);
    } catch (err) {
      setFailed(true);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && !isEmptyObject(query) && !started) {
      createCheckoutSession();
    }
  }, [query]);

  return (
    <BaseLayout hideNavbar>
      <RenderIf
        condition={!failed}
        fallback={
          <Stack align="center" justify="center" style={{ height: '100vh' }}>
            <IconAlertTriangle size={48} />
            <Title order={3}>
              Something went wrong, please contact support at {' '}
              <Anchor href="mailto:alejandro.yanes94@gmail.com">alejandro.yanes94@gmail.com</Anchor>
              .
            </Title>
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
