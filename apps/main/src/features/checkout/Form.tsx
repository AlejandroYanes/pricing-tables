import { useEffect, useRef, useState } from 'react';
import type Stripe from 'stripe';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { formatCurrencyWithoutSymbol, getCurrencySymbol } from 'helpers';
import { intervalsMap } from 'templates';
import { RenderIf } from 'ui';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

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

type PricingProps = {
  price: SessionData['product']['price'];
  unitLabel: string | null;
  currency?: string | null;
}

const resolvePricing = (options: PricingProps) => {
  const { price, unitLabel, currency: selectedCurrency } = options;
  const {
    type,
    currency: baseCurrency,
    currency_options,
    billing_scheme,
    transform_quantity,
    recurring,
    unit_amount: baseAmount,
  } = price;

  const { currency, unit_amount } = selectedCurrency && currency_options![selectedCurrency]
    ? {
      currency: selectedCurrency,
      unit_amount: currency_options![selectedCurrency]!.unit_amount,
    } : {
      currency: baseCurrency,
      unit_amount: baseAmount,
    };

  if (type === 'one_time') {
    if (transform_quantity) {
      return (
        <Stack spacing={0} ml="auto" style={{ flexShrink: 0 }}>
          <Group spacing={4}>
            <Text component="sup" size={18} mt={-8}>
              {getCurrencySymbol(currency)}
            </Text>
            <Text size={48} style={{ lineHeight: 1 }}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
          </Group>
          <Text component="sub">
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </Text>
        </Stack>
      );
    }

    return (
      <Group spacing={4} ml="auto" noWrap style={{ flexShrink: 0 }}>
        <Text component="sup">{getCurrencySymbol(currency)}</Text>
        <Text size={48}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
        <RenderIf condition={!!unitLabel}>
          <Text component="sub">{` per ${unitLabel}`}</Text>
        </RenderIf>
      </Group>
    );
  }

  const recurringLabel = intervalsMap[recurring!.interval].long;
  const intervalCount = recurring!.interval_count;

  if (billing_scheme === 'per_unit') {
    if (transform_quantity) {
      return (
        <Stack spacing={0} ml="auto" style={{ flexShrink: 0 }}>
          <Group spacing={4}>
            <Text component="sup" size={18} mt={-8}>
              {getCurrencySymbol(currency)}
            </Text>
            <Text size={48} style={{ lineHeight: 1 }}>{formatCurrencyWithoutSymbol(unit_amount! / 100)}</Text>
            <Text component="sub" size={18} mb={-8}>
              {`/ ${intervalCount > 1 ? intervalCount : ''}${recurringLabel}`}
            </Text>
          </Group>
          <Text component="sub">
            {`per every ${transform_quantity.divide_by} ${!!unitLabel ? unitLabel : 'units'}`}
          </Text>
        </Stack>
      );
    }

    return (
      <Group spacing={4} noWrap style={{ flexShrink: 0 }}>
        <Text size={48} style={{ lineHeight: 1 }}>
          {getCurrencySymbol(currency)}
        </Text>
        <Text size={48} style={{ lineHeight: 1 }}>
          {formatCurrencyWithoutSymbol(unit_amount! / 100, false)}
        </Text>
        <Stack spacing={0} ml="xs">
          <Text size="sm">per</Text>
          <Text size="sm">
            {`${intervalCount > 1 ? `${intervalCount} ` : ''}${recurringLabel}`}
          </Text>
        </Stack>
      </Group>
    );
  }

  return 'Unable to resolve pricing';
};

export default function CheckoutForm(props: { session: SessionData }) {
  const {
    session: {
      color,
      email: initialEmail,
      product,
    },
  } = props;

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailRef = useRef<string>(initialEmail || '');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;

      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: 'http://localhost:3000',
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || null);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <Stack spacing={0} style={{ maxWidth: '600px', width: '100%', margin: '80px auto' }}>
      <Title order={1} mb="xl">Checkout</Title>
      <Text>{product.name}</Text>
      <Text size="sm" color="dimmed" mb="md">{product.description}</Text>
      {resolvePricing({
        price: product.price as any,
        unitLabel: null,
        currency: null,
      })}

      <Stack mt="xl">
        <LinkAuthenticationElement
          id="link-authentication-element"
          options={{ defaultValues: { email: emailRef.current } }}
          onChange={(e: any) => emailRef.current = e.target.value}
        />
        <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      </Stack>
      <Button fullWidth uppercase mt="xl" color={color} loading={isLoading} disabled={isLoading || !stripe || !elements}>
        Pay now
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </Stack>
  );
}
