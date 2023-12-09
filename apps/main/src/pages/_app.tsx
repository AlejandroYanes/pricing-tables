import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from '@vercel/speed-insights/next';
import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { PricingThemeProvider } from 'ui';

import { trpc } from 'utils/trpc';

const MyApp: AppType<{ session: Session | null }> = (props) => {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;
  return (
    <>
      <SessionProvider session={session}>
        <PricingThemeProvider>
          <ModalsProvider>
            <Component {...pageProps} />
            <Notifications position="top-right" />
          </ModalsProvider>
        </PricingThemeProvider>
      </SessionProvider>
      <Analytics />
      {/*<SpeedInsights />*/}
    </>
  );
};

export default trpc.withTRPC(MyApp);
