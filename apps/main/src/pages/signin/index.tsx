/* eslint-disable max-len */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Alert, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { RenderIf } from 'ui';

import BaseLayout from 'components/BaseLayout';

const errorsMap: { [error: string]: string } = {
  fallback: "Seems something went wrong but we can't point to what, please contact the developers and send the url you have right now.",
  OAuthAccountNotLinked: 'Seems you already have an account with that email but with another provider.'
};

export default function SigninPage() {
  const { query } = useRouter();
  const hasErrors = !!query.error;
  const errorMessage = errorsMap[query.error as string] || errorsMap.fallback;

  return (
    <BaseLayout>
      <Stack spacing="xl" style={{ maxWidth: '700px', margin: '48px auto 0' }}>
        <RenderIf condition={hasErrors}>
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
        </RenderIf>
      </Stack>
    </BaseLayout>
  );
}
