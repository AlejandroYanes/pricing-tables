import { type NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Divider, Stack } from '@mantine/core';

import BaseLayout from 'components/BaseLayout';
import HeroTitle from 'components/HeroTitle';
import SignInForm from 'components/SignInForm';

const Home: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') {
    router.push('/dashboard');
  }

  return (
    <>
      <Head>
        <title>Pricing Tables</title>
        <meta name="description" content="A platform to quiclky generate a pricing widget" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack spacing="xl" align="center" style={{ maxWidth: '700px', margin: '48px auto 0' }}>
          <HeroTitle />
          <Divider orientation="vertical" />
          <SignInForm />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default Home;
