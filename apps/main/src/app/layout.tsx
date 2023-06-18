import { type ReactNode } from 'react';
import Script from 'next/script';

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (

    <html>
      <head>
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4TJCMV7DEC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-4TJCMV7DEC');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

export default RootLayout;
