import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader, Stack, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';
import { callAPI } from 'helpers';
import { RenderIf } from 'ui';

import BaseLayout from 'components/BaseLayout';

export default function NewCheckoutSession() {
  const { query, push } = useRouter();
  const [failed, setFailed] = useState(false);

  const createCheckoutSession = async () => {
    try {
      const response = await callAPI<{ session: string }>({
        url: '/api/checkout/new-session',
        body: query,
      });
      await push(`/checkout/${response.session}`);
    } catch (err) {
      setFailed(true);
    }
  }

  useEffect(() => {
    createCheckoutSession();
  }, []);

  return (
    <BaseLayout hideNavbar>
      <RenderIf
        condition={!failed}
        fallback={
          <Stack align="center" justify="center" style={{ height: '100vh' }}>
            <IconAlertTriangle size={48} />
            <Title order={3}>Something went wrong, please contact support.</Title>
          </Stack>
        }
      >
        <Stack align="center" justify="center" style={{ height: '100vh' }}>
          <Loader />
          <Title order={3}>Please bear with us while we generate a new session</Title>
        </Stack>
      </RenderIf>
    </BaseLayout>
  );
}
