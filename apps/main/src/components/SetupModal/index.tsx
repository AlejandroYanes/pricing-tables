'use client'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  RenderIf,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Loader,
} from '@dealo/ui';

export default function SetupModal() {
  const { data, status: sessionStatus } = useSession();

  if (sessionStatus === 'loading') {
    return (
      <Dialog open>
        <DialogContent className="max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Just a moment please.</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center w-full">
            <Loader />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data?.user) {
    return (
      <Dialog open>
        <DialogContent className="max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Hi there</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col w-full">
            <span className="text">
              Something is wrong with your session, please reload the page and make sure you are signed in.
              If the problem persists, please contact us.
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { hasLegacySetup, isSetup } = data.user;

  return (
    <Dialog open>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Hi there</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full">
          <RenderIf condition={hasLegacySetup}>
            <span className="text">
              We are updating the way we connect to your Stripe account. <br/>
              We are moving to a more secure way, which basically means that we will no longer require knowing your Stripe key.
              For this to work we need you to complete a few steps, this time within Stripe.
              <br />
              After you complete the steps, we will remove your Stripe key from our database.
            </span>
          </RenderIf>
          <RenderIf condition={!hasLegacySetup && !isSetup}>
            <span className="text">
              Welcome, as a final step we need you to connect your Stripe account to our platform.
              We will redirect you to Stripe, where you will be asked to complete a series of steps.
              After that you will be free to use our app.
            </span>
          </RenderIf>
          <div className="flex flex-row justify-end items-center mt-6">
            <Link href="/api/stripe/connect/start">
              <Button>Proceed</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
