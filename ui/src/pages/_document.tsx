/* eslint-disable import/no-default-export,react/function-component-definition */
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* favicon.ico is automatically injected by Next.js */}
        {/* <link rel="icon" href="/favicon.ico" sizes="48x48" /> */}
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon-512.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
