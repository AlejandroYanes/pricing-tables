import type { JSXElementConstructor } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import BaseLayout from 'components/BaseLayout';

const query = '(max-width: 586px)';

export default function viewSizeGuard(Component: JSXElementConstructor<any> | null) {
  return (props: any) => {
    const router = useRouter();
    const matches = useMediaQuery(query);

    if (matches) {
      return (
        <BaseLayout hideNavbar>
          <Stack align="center" justify="center" mx="auto" mt={60} style={{ maxWidth: '600px' }}>
            <Image src="/illustrations/mobile_devices.svg" width={320} height={280} alt="no mobile support" />
            <Title order={2} align="center">
             No small screen support.
            </Title>
            <Text align="center">
              We currently do not support small screens, we are working on it.
              <br />
              Please use a desktop device to access the app.
            </Text>
            <Button variant="default" onClick={() => router.push('/')}>Go back</Button>
          </Stack>
        </BaseLayout>
      );
    }

    if (!Component) {
      return null;
    }

    return <Component {...props} />;
  };
}
