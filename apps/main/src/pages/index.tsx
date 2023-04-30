import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { createStyles, Group, List, rem, Stack, Text, ThemeIcon, Title, } from '@mantine/core';
import { IconCheck } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import SignInForm from 'components/SignInForm';

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
    gap: `calc(${theme.spacing.xl} * 3)`,
  },
  content: {
    maxWidth: rem(480),

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

const Home: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const { classes } = useStyles();

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
      <BaseLayout hideNavbar>
        <div className={classes.wrapper}>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                A platform to streamline <br /> <span className={classes.highlight}>pricing cards</span> <br /> into your website.
              </Title>
              <Text color="dimmed" mt="md">
                Build fully functional pricing widgets in minutes using our set of templates.
              </Text>

              <List
                mt={30}
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={20} radius="xl">
                    <IconCheck size={rem(12)} stroke={1.5} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <b>Powered by Stripe</b> – use the products you already have to create a pricing widget in minutes
                </List.Item>
                <List.Item>
                  <b>Easy setup</b> – just copy and paste the code snippets to your website
                </List.Item>
                <List.Item>
                  <b>Easy checkout</b> – just redirect your customers to our checkout API, we will generate a checkout session for you
                </List.Item>
              </List>
            </div>
            <Image src="/illustrations/fitting_piece.svg" width={380} height={400} alt="hero" className={classes.image} />
          </div>
          <Group align="flex-start" mt="xl" grow>
            <Stack>
              <SignInForm />
            </Stack>
            <Stack>
              <iframe
                src="https://www.youtube-nocookie.com/embed/mj2gXKl98H0"
                title="Pricing Cards Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                width="560"
                height="315"
                allowFullScreen
              >
              </iframe>
            </Stack>
          </Group>
        </div>
      </BaseLayout>
    </>
  );
};

export default Home;
