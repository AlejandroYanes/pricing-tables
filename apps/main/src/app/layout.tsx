import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { env } from 'env/server.mjs';
import ThemeProvider from 'components/theme-provider';

import 'styles/globals.css';

interface Props {
  children: any;
}

const RootLayout = async ({ children }: Props) => {
  return (
    <html
      id="dealo-root"
      lang="en"
      className="scroll-smooth selection:bg-emerald-500 selection:text-neutral-900"
      suppressHydrationWarning
    >
      <head>
        <title>Dealo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        {/* eslint-disable-next-line max-len */}
        <meta name="description" content="A platform that simplifies the integration of pricing cards into your website. We connect to your Stripe account and enable you to create pricing cards in minutes."/>
        <link rel="canonical" href={env.NEXT_PUBLIC_PLATFORM_URL!}/>
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
        <link rel="manifest" href="/favicon/site.webmanifest"/>
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"/>
      </head>
      <body data-scroll="allow" className="data-[scroll=blocked]:overflow-hidden">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4TJCMV7DEC"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-4TJCMV7DEC');
          `}
        </Script>
      </body>
    </html>
  )
}

export default RootLayout;
