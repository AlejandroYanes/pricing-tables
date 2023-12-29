import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useColorScheme } from '@mantine/hooks';
import { Button, createStyles, Group, rem, Stack, Text, Title } from '@mantine/core';

import BaseLayout from 'components/BaseLayout';
import PublicNavbar from 'components/PublicNavbar';

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.colors.teal[6],
    fontSize: rem(64),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },
}));

const PricingPage = () => {
  const { data, status } = useSession();
  const user = data?.user;

  const { classes } = useStyles();
  const colorScheme = useColorScheme();

  useEffect(() => {
    import('pricing-cards');
  }, []);

  if (status === 'loading') return null;

  if (status === 'unauthenticated') {
    return (
      <>
        <Head>
          <title>Dealo | Pricing</title>
        </Head>
        <BaseLayout hideNavbar>
          <PublicNavbar showBackButton backRoute="/" />
          <Stack justify="center" align="center" style={{ margin: '0 auto', height: 'calc(100vh - 88px)' }}>
            <Group position="center">
              <Group spacing={0}>
                <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64} />
                <Title order={1} mb="md" className={classes.title}>ealo</Title>
              </Group>
            </Group>
            <Text align="center" size="xl" mb={64}>
              Pick a plan to start using Dealo, you can cancel at any time.
            </Text>
            {/* @ts-ignore */}
            <pricing-cards widget="clpy5czwo0001hin5sqyyfhz4" theme={colorScheme} internal="true" />
          </Stack>
        </BaseLayout>
      </>
    );
  }

  if (user && user.hasSubscription) {
    return (
      <>
        <Head>
          <title>Dealo | Pricing</title>
        </Head>
        <BaseLayout hideUserControls showBackButton={!!user} backRoute="/dashboard" title="Pricing">
          <Stack justify="flex-start" align="center" style={{ margin: '48px auto 0', height: 'calc(100vh - 88px)' }}>
            <Title order={1}>Hi {user.name}</Title>
            <Text>You already have a subscription with us, if you want to check:</Text>
            <Link href="/api/stripe/customer/portal">
              <Button>Got to the Customer Portal</Button>
            </Link>
          </Stack>
        </BaseLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dealo | Pricing</title>
      </Head>
      <BaseLayout hideUserControls showBackButton={!!user} backRoute="/dashboard" title="Pick a plan">
        <Stack justify="center" align="center" style={{ margin: '0 auto', height: 'calc(100vh - 88px)' }}>
          {/* @ts-ignore */}
          <pricing-cards widget="clpy5czwo0001hin5sqyyfhz4" theme={colorScheme} internal="true" />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default PricingPage;
