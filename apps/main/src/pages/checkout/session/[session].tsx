import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import type Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Anchor, Loader, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';
import { callAPI } from 'helpers';

import BaseLayout from 'components/BaseLayout';
import CheckoutForm from 'features/checkout/Form';

type SessionData = {
  color: string;
  email: string;
  product: {
    name: string;
    description: string;
    price: {
      currency: string;
      currency_options: {
        [key: string]: {
          custom_unit_amount: string | null;
          tax_behavior: string;
          unit_amount: number;
          unit_amount_decimal: string;
        };
      };
      unit_amount: number;
      unit_amount_decimal: string;
      billing_scheme: Stripe.Price.BillingScheme;
      recurring: Stripe.Price.Recurring;
      transform_quantity: Stripe.Price.TransformQuantity;
      type: Stripe.Price.Type;
    };
  };
}

const fetchSession = async (session: string) => {
  return callAPI<SessionData>({
    url: `/api/checkout/${session}/details`,
  });
}

const createPaymentIntent = async (session: string) => {
  return callAPI<{ secret: string }>({
    url: `/api/checkout/${session}/payment-intent`,
  });
};

const publishableKey = 'pk_test_51MgxvIJIZhxRN8vVfqvXShvAMBWHXvYRiCh3HfqAByUJi1vD0ObatVIb7DHcd8xO1G0oidtJjFSHtTMCNuwpjpvP00GtWkUKWq';

export default function CheckoutSession() {
  const { query } = useRouter();

  const stripePromise = useRef<any>(undefined);
  const options = useRef<any>(undefined);

  const [isStripeReady, setStripeReady] = useState(false);
  const [optionsReady, setOptionsReady] = useState(false);

  const { isFetching: isFetchingSession, data, isError: sessionFailed } = useQuery(
    [`session-${query.session}`],
    () => fetchSession(query.session as string),
    { refetchOnWindowFocus: false, enabled: !!query.session },
  );

  const { isFetching: isFetchingIntent, data: intent, isError: intentFailed } = useQuery(
    [`session-${query.session}-payment-intent`],
    () => createPaymentIntent(query.session as string),
    { refetchOnWindowFocus: false, retry: false, enabled: !!query.session },
  );

  useEffect(() => {
    if (!isFetchingSession && !sessionFailed) {
      stripePromise.current = loadStripe(publishableKey);
      setStripeReady(true);
    }
  }, [data, isFetchingSession, sessionFailed]);

  useEffect(() => {
    if (!isFetchingIntent && !intentFailed && intent) {
      console.log('setting options', intent);
      options.current = {
        clientSecret: intent.secret,
        appearance: {
          theme: 'stripe',
        }
      };
      setOptionsReady(true);
    }
  }, [intent, isFetchingIntent, intentFailed]);

  if (isFetchingSession || isFetchingIntent || !isStripeReady || !optionsReady) {
    return (
      <BaseLayout>
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <Loader />
        </Stack>
      </BaseLayout>
    );
  }

  if (sessionFailed || intentFailed || !data || !intent) {
    return (
      <BaseLayout>
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

  console.log('intent', intent);
  console.log('options', options.current);

  return (
    <BaseLayout hideNavbar>
      <Elements options={options.current} stripe={stripePromise.current}>
        <CheckoutForm session={data} />
      </Elements>
    </BaseLayout>
  );
}
