import { Head, Html, Main, NextScript } from 'next/document';
import { FC } from 'react';

const Document: FC = () => (
  <Html lang="en">
    <Head>
      {/* favicon.ico is automatically injected by Next.js */}
      {/* <link rel="icon" href="/favicon.ico" sizes="48x48" /> */}
      <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/favicon-512.png" />
      <link rel="manifest" href="/manifest.json" />

      <script src="/initConfig.js" type="module" defer />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

// eslint-disable-next-line import-x/no-default-export
export default Document;
