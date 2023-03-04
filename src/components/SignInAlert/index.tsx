import Head from 'next/head';
import Link from 'next/link';
import { IconAlertCircle } from '@tabler/icons';
import { Alert, Button, Group, Stack } from '@mantine/core';

import BaseLayout from '../BaseLayout';

interface Props {
  asPage?: boolean;
}

export default function SignInAlert(props: Props) {
  const { asPage } = props;

  if (asPage) {
    return (
      <>
        <Head>
          <title>CV | Oops...</title>
          <meta name="description" content="Un-authenticated" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <BaseLayout>
          <Stack mx="auto" style={{ maxWidth: '700px' }}>
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Hmm..."
              variant="outline"
            >
              {`Seems we're not sure who you are, do you mind signing in?`}
              <Group position="right" mt="md">
                <Link href="/"><Button>Sign in</Button></Link>
              </Group>
            </Alert>
          </Stack>
        </BaseLayout>
      </>
    );
  }

  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Hmm..."
      variant="outline"
    >
      {`Seems we're not sure who you are, do you mind signing in?`}
      <Group position="right" mt="md">
        <Link href="/"><Button>Sign in</Button></Link>
      </Group>
    </Alert>
  );
}
