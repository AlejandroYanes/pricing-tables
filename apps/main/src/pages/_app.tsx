import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { PricingThemeProvider } from 'ui';

import { api } from 'utils/api';

const MyApp: AppType<{ session: Session | null }> = (props) => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;
  return (
    <SessionProvider session={session}>
      <PricingThemeProvider>
        <ModalsProvider>
          <Component {...pageProps} />
          <Notifications />
        </ModalsProvider>
      </PricingThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
