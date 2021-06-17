import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import { Router } from '../components/Router';
import { UserContextProvider } from '../context/UserContextProvider';
import { GQLClient } from '../graphql';
import '../styles/globals.css';
import '../leaflet-config';

function SafeHydrate({ children }: { children: JSX.Element }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SafeHydrate>
      <ApolloProvider client={GQLClient}>
        <UserContextProvider>
          <Router />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </UserContextProvider>
      </ApolloProvider>
    </SafeHydrate>
  );
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
