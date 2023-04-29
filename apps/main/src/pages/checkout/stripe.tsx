import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader, Stack, Title } from '@mantine/core';
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
  currency: z.string().length(3),
  email: z.string().email().optional(),
  disable_email: z.boolean().optional(),
});

export default function NewStripeCheckoutSession() {
  const { query } = useRouter();

  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  const timeoutRef = useRef<any>(undefined);

  const createCheckoutSession = () => {
    setStarted(true);
    const parsedQuery = inputSchema.safeParse(query);

    if (!parsedQuery.success) {
      setFailed(true);
      return;
    }

    callAPI<{ url: string }>({
      method: 'POST',
      url: '/api/checkout/stripe',
      body: parsedQuery.data,
    }).then((response) => {
      window.open(response.url, '_blank');
    }).catch((err) => {
      console.log(err);
      setFailed(true);
    });
  }

  const startFailedTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isEmptyObject(query)) {
        setFailed(true);
      }
    }, 5000);
  }

  useEffect(() => {
    console.log('useEffect to create checkout session', query);
    startFailedTimeout();
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
            <Title order={3}>Something went wrong, please contact support.</Title>
          </Stack>
        }
      >
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <Loader />
          <Title order={3}>Please bear with us while we generate a new Stripe Checkout</Title>
        </Stack>
      </RenderIf>
    </BaseLayout>
  );
}
