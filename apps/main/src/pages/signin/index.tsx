/* eslint-disable max-len */
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Alert, Button, createStyles, Group, Loader, rem, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { generateQueryString } from 'helpers';

import BaseLayout from 'components/BaseLayout';
import SignInForm from 'components/SignInForm';
import RenderWithDelay from 'components/RenderWithDelay';

const errorsMap: { [error: string]: string } = {
  fallback: "Seems something went wrong but we can't point to what, please contact the developers and send the url you have right now.",
  OAuthAccountNotLinked: 'Seems you already have an account with that email but with another provider.'
};

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `calc(${theme.spacing.xl} * 3)`,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: rem(480),

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colors.teal[6],
    fontSize: rem(64),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },
  subtitle: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontSize: rem(40),
    lineHeight: 1.2,
    fontWeight: 700,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },
  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export default function SigninPage() {
  const { status } = useSession();
  const router = useRouter();
  const { query } = router;
  const hasErrors = !!query.error;
  const errorMessage = errorsMap[query.error as string] || errorsMap.fallback;

  const { classes } = useStyles();

  const buildCheckoutUrl = () => {
    const checkoutPageRoute = '/stripe/checkout/start';
    const searchParams = generateQueryString(query);
    return `${checkoutPageRoute}?${searchParams}`;
  }

  useEffect(() => {
    if (status === 'authenticated') {
      const url = query.internal_flow === 'true' ? buildCheckoutUrl() : '/dashboard';
      router.push(url);
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Dealo | Signin</title>
        </Head>
        <BaseLayout hideUserControls>
          <RenderWithDelay delay={1000}>
            <Stack align="center" justify="center" spacing="xl" style={{ maxWidth: '700px', margin: '48px auto 0' }}>
              <Loader />
            </Stack>
          </RenderWithDelay>
        </BaseLayout>
      </>
    );
  }

  if (status === 'authenticated') return null;

  if (hasErrors) {
    return (
      <>
        <Head>
          <title>Dealo | Signin</title>
        </Head>
        <BaseLayout hideUserControls>
          <Stack spacing="xl" style={{ maxWidth: '700px', margin: '48px auto 0' }}>
            <Alert
              icon={<IconAlertCircle size={16} />}
              title={<Title order={3}>Hmm...</Title>}
              color="orange"
              variant="outline"
            >
              <Text size="lg">{errorMessage}</Text>
            </Alert>
            <Group mt="lg" position="right" align="flex-end">
              <Link href="/">
                <Button color="gray">Get back</Button>
              </Link>
            </Group>
          </Stack>
        </BaseLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dealo | Signin</title>
      </Head>
      <BaseLayout hideUserControls>
        <Stack spacing={32} align="center" mx="auto">
          <div className={classes.inner}>
            <div className={classes.content}>
              <Group spacing={0}>
                <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64} />
                <Title order={1} mb="md" className={classes.title}>ealo</Title>
              </Group>
              <Title className={classes.subtitle}>
                A platform to streamline <br /> <span className={classes.highlight}>pricing cards</span> <br /> into your website.
              </Title>
              <Text color="dimmed" mt="md">
                Build fully functional pricing widgets in minutes using our set of templates.
              </Text>
            </div>
          </div>
          <SignInForm />
        </Stack>
      </BaseLayout>
    </>
  );
}
