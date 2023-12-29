/* eslint-disable max-len */
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Center, createStyles, Group, List, rem, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconBrush,
  IconCheck,
  IconClock,
  IconCopy,
  IconFlask,
  IconHelp,
  IconMathOff,
  IconPower,
  IconStar,
  IconTrendingUp,
  IconUser
} from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import PublicNavbar from 'components/PublicNavbar';
import PricingWidget from 'components/PricingWidget';

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

  darkerSection: {
    padding: `${rem(24)} ${rem(24)}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
  },
  card: {
    width: '30%',
    borderRadius: theme.radius.sm,
    padding: `${rem(20)} ${rem(24)}`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  }
}));

const IconListItem = ({ title, text, icon }: { title: string; text: string; icon: JSX.Element }) => (
  <Group align="center" noWrap>
    <Center style={{ width: '32px', height: '32px', flexShrink: 0 }}>
      {icon}
    </Center>
    <Stack spacing={0}>
      <Text weight="bold">{title}</Text>
      <Text>{text}</Text>
    </Stack>
  </Group>
);

const Card = ({ title, text, icon }: { title: string; text: string; icon: JSX.Element }) => {
  const { classes } = useStyles();
  return (
    <Stack className={classes.card}>
      {icon}
      <Title order={3}>{title}</Title>
      <Text>{text}</Text>
    </Stack>
  );
}

const Home: NextPage = () => {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>Dealo</title>
        <meta name="description" content="A platform to streamline pricing and checkouts" />
      </Head>
      <BaseLayout hideNavbar>
        <PublicNavbar />
        <div className={classes.wrapper}>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Group spacing={0}>
                <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64} />
                <Title order={1} mb="md" className={classes.title}>ealo</Title>
              </Group>
              <Title className={classes.subtitle}>
                A platform to streamline <br /> <span className={classes.highlight}>pricing</span> <br /> into your website.
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
                  <b>Easy setup</b> – just copy and paste the code snippets to your website
                </List.Item>
                <List.Item>
                  <b>Powered by Stripe</b> – use the products you already have to create a pricing widget in minutes
                </List.Item>
                <List.Item>
                  <b>Easy checkout</b> – redirect your customers to our checkout API, we will generate a checkout session for you
                </List.Item>
              </List>
            </div>
            <Image src="/illustrations/fitting_piece.svg" width={380} height={400} alt="hero" className={classes.image} />
          </div>

          <Stack className={classes.darkerSection} mb={140}>
            <Title order={1} align="center" mb="xl">Unleash Your Potential</Title>
            <Group position="apart"  align="stretch" mb="lg">
              <Card icon={<IconMathOff />} title="Goodbye to Headaches" text="No more wrangling with code to set up pricing pages and bill your customers." />
              <Card icon={<IconPower />} title="Empowerment" text="Create and customize sleek, professional pricing cards effortlessly." />
              <Card icon={<IconFlask />} title="Innovate" text="Use our A/B testing and Insights to find the best pricing combination." />
            </Group>
            <Group position="apart" align="stretch">
              <Card icon={<IconStar />} title="Frictionless Journey" text="Provide your customers with a frictionless checkout experience while you focus on scaling your business." />
              <Card icon={<IconUser />} title="Dynamic Experience" text="Create a dynamic and user-friendly checkout experience." />
              <Card icon={<IconBrush />} title="Your brand is your identity" text="Maintain consistency effortlessly by embedding the generated UI directly into your website." />
            </Group>
          </Stack>

          <Group style={{ justifyContent: 'space-around' }} mb={140}>
            <Stack style={{ width: '40%' }}>
              <Title order={2} mb="xl">How it works</Title>
              <IconListItem icon={<IconBrush />} title="Customize" text="Pick from our choise of templates, add your products and splash your colours." />
              <IconListItem icon={<IconCopy />} title="Embed" text="Copy and paste the provided code snippets to your website." />
              <IconListItem icon={<IconCheck size={28} />} title="Checkout" text="Redirect your customers to our checkout API for a smooth transaction process." />
            </Stack>
            <Stack style={{ width: '40%' }}>
              <Title order={2} mb="xl">Why Choose Us?</Title>
              <IconListItem icon={<IconTrendingUp />} title="No-Code, No Limits" text="Craft widgets in under 15 minutes and integrate seamlessly with any website." />
              <IconListItem icon={<IconClock />} title="Time-Saving" text="Set up your pricing structure in minutes, not hours." />
              <IconListItem icon={<IconHelp />} title="Comprehensive Support" text="We're more than a tool, we're your dedicated partner." />
            </Stack>
          </Group>

          <Stack mt="xl" align="center" justify="center">
            <Title order={1} mb="xl">Get started now.</Title>
            <PricingWidget />
            <Text color="dimmed" mt="lg">This is a working example of a pricing widget.</Text>
          </Stack>
        </div>
      </BaseLayout>
    </>
  );
};

export default Home;
