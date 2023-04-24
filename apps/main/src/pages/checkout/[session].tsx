import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import type Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Loader, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';
import { callAPI } from 'helpers';

import BaseLayout from 'components/BaseLayout';
import CheckoutForm from 'features/checkout/Form';

type SessionData = {
  stripeKey: string;
  color: string;
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
    url: `/api/checkout/${session}`,
  });
}

const createPaymentIntent = async (session: string) => {
  return callAPI<string>({
    url: `/api/checkout/${session}/payment-intent`,
  });
};

export default function CheckoutSession() {
  const { query } = useRouter();

  const stripePromise = useRef<any>(undefined);

  const options = useRef<any>(undefined);

  const { isFetching: isFetchingSession, data, isError: sessionFailed } = useQuery(
    [`session-${query.session}`],
    () => fetchSession(query.session as string),
    { refetchOnWindowFocus: false },
  );

  const { isFetching: isFetchingIntent, data: secret, isError: intentFailed } = useQuery(
    [`session-${query.session}`],
    () => createPaymentIntent(query.session as string),
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (!isFetchingSession && !sessionFailed) {
      stripePromise.current = loadStripe(data!.stripeKey);
    }
  }, [data, isFetchingSession, sessionFailed]);

  useEffect(() => {
    if (!isFetchingIntent && !intentFailed && secret) {
      options.current = {
        clientSecret: secret,
        appearance: {
          theme: 'stripe',
        }
      };
    }
  }, [secret, isFetchingIntent, intentFailed]);

  if (isFetchingSession || isFetchingIntent) {
    return (
      <BaseLayout>
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <Loader />
        </Stack>
      </BaseLayout>
    );
  }

  if (sessionFailed || intentFailed || !data || !secret) {
    return (
      <BaseLayout>
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <IconAlertTriangle size={48} />
          <Title order={3}>Something went wrong, please contact support.</Title>
        </Stack>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout hideNavbar>
      <Elements options={options.current} stripe={stripePromise.current}>
        <CheckoutForm session={data} />
      </Elements>
    </BaseLayout>
  );
}
