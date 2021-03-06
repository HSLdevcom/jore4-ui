import { ApolloProvider } from '@apollo/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { UserProvider } from '../auth/UserProvider';
import '../generated/fontello/css/hsl-icons.css';
import { createGraphqlClient } from '../graphql';
import '../i18n';
import { ReduxProvider } from '../redux';
import { Router } from '../router/Router';
import '../styles/globals.css';
import { Toaster } from '../uiComponents/Toaster';

function SafeHydrate({ children }: { children: JSX.Element }) {
  // We are not using SSR. Use useEffect as workaround to
  // get rid of hydration mismatch error on first render as
  // suggested in nextjs documentation:
  // https://nextjs.org/docs/messages/react-hydration-error#possible-ways-to-fix-it
  const [windowType, setWindowType] = useState('undefined');
  useEffect(() => setWindowType(typeof window), []);
  return (
    <div suppressHydrationWarning>
      {windowType === 'undefined' ? null : children}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const graphqlClient = createGraphqlClient();
  return (
    <SafeHydrate>
      <ApolloProvider client={graphqlClient}>
        <ReduxProvider>
          <UserProvider />
          <Router />
          <Toaster />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ReduxProvider>
      </ApolloProvider>
    </SafeHydrate>
  );
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
