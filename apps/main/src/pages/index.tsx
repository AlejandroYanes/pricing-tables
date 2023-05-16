import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { createStyles, Group, List, rem, Stack, Text, ThemeIcon, Title, useMantineTheme, MediaQuery } from '@mantine/core';
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
    padding: `calc(${theme.spacing.xl} * 4) 0`,
    gap: `calc(${theme.spacing.xl} * 3)`,
    [theme.fn.smallerThan('md')]: {
      padding: `calc(${theme.spacing.md} * 2) 0`,
    },
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

  bottom: {
    [theme.fn.smallerThan('md')]: {
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
      '& > *': {
        maxWidth: 'unset',
      },
      '& > iframe': {
        width: '100% !important',
      },
    },
  },
}));

const Home: NextPage = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>Dealo</title>
        <meta name="description" content="A platform to streamline pricing cards and checkouts" />
      </Head>
      <BaseLayout hideNavbar>
        <div className={classes.wrapper}>
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
                  <b>Easy checkout</b> – redirect your customers to our checkout API, we will generate a checkout session for you
                </List.Item>
              </List>

              <a
                href="https://www.producthunt.com/posts/dealo?utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-dealo"
                target="_blank"
                rel="noreferrer"
                style={{ margin: '60px auto 0' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  // eslint-disable-next-line max-len
                  src={`https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=393090&theme=${theme.colorScheme}&period=weekly&topic_id=237`}
                  alt="Dealo - Pricing&#0032;cards&#0032;and&#0032;checkouts&#0032;for&#0032;no&#0045;code | Product Hunt"
                  style={{ width: '250px', height: '54px' }}
                  width="250"
                  height="54"
                />
              </a>
            </div>
            <Image src="/illustrations/fitting_piece.svg" width={380} height={400} alt="hero" className={classes.image} />
          </div>
          <Group align="flex-start" mt="xl" grow className={classes.bottom}>
            <Stack>
              <SignInForm />
            </Stack>
            <Stack>
              <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/EwyFL4IT9Mo"
                  title="Pricing Cards Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  width="560"
                  height="315"
                  allowFullScreen
                  style={{ border: 'none' }}
                >
                </iframe>
              </MediaQuery>
              <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/EwyFL4IT9Mo"
                  title="Pricing Cards Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  width="320"
                  height="260"
                  allowFullScreen
                  style={{ border: 'none', marginBottom: '32px' }}
                >
                </iframe>
              </MediaQuery>
            </Stack>
          </Group>
        </div>
      </BaseLayout>
    </>
  );
};

export default Home;
