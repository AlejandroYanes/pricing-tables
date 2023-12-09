import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button, Loader, Stack, Text } from '@mantine/core';
import { RenderIf } from 'ui';

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
          <Stack align="center" justify="center" style={{ width: '100%', padding: '86px' }}>
            <Loader />
          </Stack>
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
          <Stack align="center" justify="center" spacing="md" style={{ width: '100%', padding: '86px' }}>
            <Text align="center">
              Something is wrong with your session, please go back and make sure you are signed in.
            </Text>
            <Link href="/">
              <Button>Go back</Button>
            </Link>
          </Stack>
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
        <Stack align="center" justify="center" spacing="md" style={{ width: '100%', padding: '86px' }}>
          <RenderIf condition={status === 'pending'}>
            <Loader />
            <Text align="center">
              We are verifying the status of your account, please wait a moment.
            </Text>
          </RenderIf>

          <RenderIf condition={status === 'incomplete'}>
            <Text align="center">
              Your account is not fully setup, do you want to continue now?
            </Text>
            <Link href="/api/stripe/connect/start">
              <Button>Continue</Button>
            </Link>
          </RenderIf>

          <RenderIf condition={status === 'failed'}>
            <Text align="center">
              Something went wrong, please try again later.
            </Text>
            <Link href="/dashboard">
              <Button>Go back</Button>
            </Link>
          </RenderIf>

          <RenderIf condition={status === 'success'}>
            <Text align="center">
              Congrats, your Stripe account is now connected to our platform.
            </Text>
          </RenderIf>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default ReturnPage;
