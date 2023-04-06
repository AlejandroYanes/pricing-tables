import { useState } from 'react';
import { useRouter } from 'next/router';
import Stripe from 'stripe';
import { Alert, Anchor, Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons';
import { RenderIf } from 'ui';

import { api } from 'utils/api';

export default function SetupModal() {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const [products, setProducts] = useState<Stripe.Product[]>([]);

  const { mutate } = api.user.setup.useMutation();

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
      setProducts(response.data);
      setShowList(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setShowList(false);
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
    router.reload();
  };

  if (!open) return null;

  return (
    <Modal
      opened
      centered
      size="lg"
      withCloseButton={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
      onClose={() => undefined}
      title="Hi there"
    >
      <Text>
        In order to help you, we need to be able to connect to your Stripe account to read your products and prices,
        {` don't`} worry, we {`won't`} create anything, just read, we promise 🤞.
        If you {`don't`} know how to get your API key, you can read about it {' '}
        <Anchor href="https://stripe.com/docs/keys" target="_blank">on the Stripe docs</Anchor>.
      </Text>
      <RenderIf
        condition={showList}
        fallback={
          <>
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
          </>
        }
      >
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
