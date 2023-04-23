import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import type Stripe from 'stripe';
import { Divider } from '@mantine/core';
import { callAPI } from 'helpers';

import BaseLayout from 'components/BaseLayout';

type SessionData = {
  color: string;
  product: {
    name: string;
    description: string;
    price: {
      currency: string;
      currency_options: Stripe.Price.CurrencyOptions;
      unitAmount: number;
      unitAmountDecimal: string;
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

export default function CheckoutSession() {
  const { query } = useRouter();
  const { isFetching, data, isError } = useQuery([`session-${query.session}`], () => fetchSession(query.session as string));

  return (
    <BaseLayout hideNavbar>
      <h1>Checkout Session</h1>
      {JSON.stringify(query)}
      <Divider />
      {isFetching && <p>Loading...</p>}
      {isError && <p>Error</p>}
      {!isFetching && data ? JSON.stringify(data) : null}
    </BaseLayout>
  );
}
