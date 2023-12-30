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
  const { data, status: sessionStatus } = useSession();

  if (sessionStatus === 'loading') {
    return (
      <Modal
        opened
        closeOnEscape={false}
        closeOnClickOutside={false}
        onClose={() => undefined}
        title={<Text size="lg" weight="bold">Just a moment please.</Text>}
      >
        <Stack align="center" justify="center" py="md">
          <Loader />
        </Stack>
      </Modal>
    );
  }

  if (!data?.user) {
    return (
      <Modal
        opened
        closeOnEscape={false}
        closeOnClickOutside={false}
        onClose={() => undefined}
        title={<Text size="lg" weight="bold">Hi there</Text>}
      >
        <Text>
          Something is wrong with your session, please reload the page and make sure you are signed in.
          If the problem persists, please contact us.
        </Text>
      </Modal>
    );
  }


  return (
    <Dialog open>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Hi there</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full">
          <RenderIf condition={hasLegacySetup}>
            <Text>
              We are updating the way we connect to your Stripe account. <br/>
              We are moving to a more secure way, which basically means that we will no longer require knowing your Stripe key.
              For this to work we need you to complete a few steps, this time within Stripe.
              After you complete the steps, we will remove your Stripe key from our database.
            </Text>
          </RenderIf>
          <RenderIf condition={!hasLegacySetup && !isSetup}>
            <Text>
              Welcome, as a final step we need you to connect your Stripe account to our platform.
              We will redirect you to Stripe, where you will be asked to complete a series of steps.
              After that you will be free to use our app.
            </Text>
          </RenderIf>
          <Group position="right" mt="md">
            <Link href="/api/stripe/connect/start">
              <Button>Proceed</Button>
            </Link>
          </Group>
        </div>
      </DialogContent>
    </Dialog>
  );
}
