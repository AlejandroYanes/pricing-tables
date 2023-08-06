'use client'

import { useState } from 'react';
import Stripe from 'stripe';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  RenderIf,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Alert,
  AlertDescription,
  CodeBlock,
  useToast,
} from '@dealo/ui';

import { trpc } from 'utils/trpc';
import { guestStripeKey } from 'utils/stripe';

type Status = 'input' | 'empty' | 'list';

export default function SetupModal() {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>('input');
  const [products, setProducts] = useState<Stripe.Product[]>([]);

  const { toast } = useToast();

  const { mutate } = trpc.user.setup.useMutation({
    onSuccess: () => {
      toast({
        title: 'Hooray! Your account is now setup.',
      });
      window.location.reload();
    },
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
    mutate(apiKey);
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Hi there</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full">
          <RenderIf condition={status === 'input'}>
            <span>
                In order to help you, we need to be able to connect to your Stripe account to read your products and prices,
              {` don't`} worry, we {`won't`} create anything, just read, we promise 🤞.
                If you {`don't`} know how to get your API key, you can read about it {' '}
              <a href="https://stripe.com/docs/keys" target="_blank" rel="noreferrer">on the Stripe docs</a>.
            </span>
            <span className="mt-4">If you do not have a Stripe key but still want to test, {`here's`} one from us:</span>
            <CodeBlock className="my-4">
              {guestStripeKey}
            </CodeBlock>
            <div className="flex flex-col gap-2 mt-4">
              <Label htmlFor="stripe-api-key">Stripe API Key</Label>
              <Input autoFocus id="stripe-api-key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <RenderIf condition={error}>
              <Alert variant="destructive" className="mt-4">
                <IconAlertCircle size="1rem" />
                <AlertDescription>
                  Seems like we {`couldn't`} connect to your Stripe account,
                  please try again and make sure you are using the correct API key.
                </AlertDescription>
              </Alert>
            </RenderIf>
            <div className="mt-6 flex justify-end">
              <Button disabled={loading} onClick={handleSetup}>Test connection</Button>
            </div>
          </RenderIf>
          <RenderIf condition={status === 'empty'}>
            <span>
                We {`couldn't`} find any products in your Stripe account, please make sure you have at least one product.
            </span>
            <Button variant="secondary" className="ml-auto mt-4" onClick={handleReset}>Try another account</Button>
          </RenderIf>
          <RenderIf condition={status === 'list'} >
            <span className="mb-3">Do you recognise these products?</span>
            <ul className="list-disc">
              {products.map((product) => (
                <li key={product.id}>
                  {product.name}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={handleCancel}>No</Button>
              <Button onClick={handleConfirm}>
                Yes
              </Button>
            </div>
          </RenderIf>
        </div>
      </DialogContent>
    </Dialog>
  );
}
