'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { RenderIf, Loader, Button } from '@dealo/ui';

import BaseLayout from 'components/BaseLayout';

type Status = 'pending' | 'success' | 'incomplete' | 'failed';

const ReturnPage = () => {
  const { status: sessionStatus, data } = useSession();

  const [status, setStatus] = useState<Status>('pending');
  const abortRef = useRef<AbortController | undefined>(undefined);

  const checkStatus = async () => {
    if (sessionStatus === 'unauthenticated' || !data?.user) return;

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch('/api/stripe/connect/check', {
        method: 'GET',
        signal: controller.signal,
      });
      const data = await response.json();
      if (data?.connected === true) {
        setStatus('success');
        setTimeout(() => {
          const platformUrl = window.location.origin;
          window.location.href = `${platformUrl}/dashboard`;
        }, 1000);
      } else {
        setStatus('incomplete');
      }
    } catch (error) {
      setStatus('failed');
    }
  };

  useEffect(() => {
    checkStatus();
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [sessionStatus]);

  if (sessionStatus === 'loading') {
    return (
      <>
        <Head>
          <title>Dealo | Stripe Connect results</title>
        </Head>
        <BaseLayout>
          <div className="flex flex-col items-center justify-center w-full p-[86px]">
            <Loader />
          </div>
        </BaseLayout>
      </>
    );
  }

  if (sessionStatus === 'unauthenticated' || !data?.user) {
    return (
      <>
        <Head>
          <title>Dealo | Stripe Connect results</title>
        </Head>
        <BaseLayout>
          <div className="flex flex-col items-center justify-center w-full p-[86px]">
            <span className="text text-center">
              Something is wrong with your session, please go back and make sure you are signed in.
            </span>
            <Link href="/apps/main/public">
              <Button>Go back</Button>
            </Link>
          </div>
        </BaseLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dealo | Stripe Connect results</title>
      </Head>
      <BaseLayout>
        <div className="flex flex-col items-center justify-center w-full p-[86px]">
          <RenderIf condition={status === 'pending'}>
            <Loader />
            <span className="text text-center">
              We are verifying the status of your account, please wait a moment.
            </span>
          </RenderIf>

          <RenderIf condition={status === 'incomplete'}>
            <span className="text text-center">
              Your account is not fully setup, do you want to continue now?
            </span>
            <Link href="/api/stripe/connect/start">
              <Button>Continue</Button>
            </Link>
          </RenderIf>

          <RenderIf condition={status === 'failed'}>
            <span className="text text-center">
              Something went wrong, please try again later.
            </span>
            <Link href="/dashboard">
              <Button>Go back</Button>
            </Link>
          </RenderIf>

          <RenderIf condition={status === 'success'}>
            <span className="text text-center">
              Congrats, your Stripe account is now connected to our platform.
            </span>
          </RenderIf>
        </div>
      </BaseLayout>
    </>
  );
};

export default ReturnPage;
