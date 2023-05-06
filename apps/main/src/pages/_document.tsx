import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script'
import { createGetInitialProps } from '@mantine/next';

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          {/*<script async src="https://www.googletagmanager.com/gtag/js?id=G-4TJCMV7DEC" />*/}
          {/*<script>*/}
          {/*  window.dataLayer = window.dataLayer || [];*/}
          {/*  /!* @ts-ignore *!/*/}
          {/*  function gtag(){dataLayer.push(arguments);}*/}
          {/*  gtag('js', new Date());*/}

          {/*  gtag('config', 'G-4TJCMV7DEC');*/}
          {/*</script>*/}
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
