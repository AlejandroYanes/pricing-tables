import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Container, createStyles, Group, List, rem, Text, ThemeIcon, Title, } from '@mantine/core';
import { IconCheck } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import SignInForm from '../components/SignInForm';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

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

function HeroBullets() {
  const { classes } = useStyles();
  return (
    <div>
      <Container>
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
            </List>

            <Group mt={30}>
              <SignInForm />
            </Group>
          </div>
          <Image src="/illustrations/fitting_piece.svg" width={380} height={600} alt="hero" className={classes.image} />
        </div>
      </Container>
    </div>
  );
}

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
      <BaseLayout hideNavbar>
        <HeroBullets />
      </BaseLayout>
    </>
  );
};

export default Home;
