'use client'

import { useState } from 'react';
import Stripe from 'stripe';
import { Alert, Anchor, Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { RenderIf } from '@dealo/ui';

import { trpc } from 'utils/trpc';
import { guestStripeKey } from 'utils/stripe';

type Status = 'input' | 'empty' | 'list';

export default function SetupModal() {
  const [open, setOpen] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>('input');
  const [products, setProducts] = useState<Stripe.Product[]>([]);

  const { mutate } = trpc.user.setup.useMutation({
    onSuccess: () => window.location.reload(),
  });

  const handleSetup = async () => {
    try {
      setLoading(true);
      const stripeClient = new Stripe(apiKey, {
        apiVersion: '2022-11-15',
      });
      const response = await stripeClient.products.list({
        active: true,
        limit: 5,
      });
      if (response.data.length === 0) {
        setStatus('empty');
        setLoading(false);
        return;
      }
      setProducts(response.data);
      setStatus('list');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  }

  const handleReset = () => {
    setStatus('input');
    setProducts([]);
    setApiKey('');
    setError(false);
    setLoading(false);
  }

  const handleCancel = () => {
    setStatus('input');
    setProducts([]);
    setApiKey('');
  };

  const handleConfirm = async () => {
    setLoading(true);
    await mutate(apiKey);
    showNotification({
      message:'Hooray! Your account is now setup.'
    });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Modal
      opened
      centered
      size="lg"
      styles={{
        body: {
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      withCloseButton={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
      onClose={() => undefined}
      title={<Text size="lg" weight="bold">Hi there</Text>}
    >
      <RenderIf condition={status === 'input'}>
        <Text>
          In order to help you, we need to be able to connect to your Stripe account to read your products and prices,
          {` don't`} worry, we {`won't`} create anything, just read, we promise 🤞.
          If you {`don't`} know how to get your API key, you can read about it {' '}
          <Anchor href="https://stripe.com/docs/keys" target="_blank">on the Stripe docs</Anchor>.
        </Text>
        <Text mt="sm">If you do not have a Stripe key but still want to test, {`here's`} one from us:</Text>
        <Prism language="markup">
          {guestStripeKey}
        </Prism>
        <TextInput autoFocus my="xl" label="Stripe API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        <RenderIf condition={error}>
          <Alert my="md" icon={<IconAlertCircle size="1rem" />} color="red" variant="outline">
            Seems like we {`couldn't`} connect to your Stripe account,
            please try again and make sure you are using the correct API key.
          </Alert>
        </RenderIf>
        <Group mt="xl" position="right">
          <Button loading={loading} onClick={handleSetup}>Test connection</Button>
        </Group>
      </RenderIf>
      <RenderIf condition={status === 'empty'}>
        <Text>
          We {`couldn't`} find any products in your Stripe account, please make sure you have at least one product.
        </Text>
        <Group mt="auto" position="right">
          <Button onClick={handleReset}>Try another account</Button>
        </Group>
      </RenderIf>
      <RenderIf condition={status === 'list'} >
        <Text mt="xl">Do you recognise these products?</Text>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name}
            </li>
          ))}
        </ul>
        <Group mt="xl" position="right">
          <Button onClick={handleCancel} variant="outline" color="gray">No</Button>
          <Button onClick={handleConfirm} loading={loading}>Yes</Button>
        </Group>
      </RenderIf>
    </Modal>
  );
}
