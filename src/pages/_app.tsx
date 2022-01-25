import { ApolloProvider } from '@apollo/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { AppProps } from 'next/app';
import { Router } from '../components/Router';
import { Toaster } from '../components/Toaster';
import { MapEditorContextProvider } from '../context/MapEditorContextProvider';
import { ModalMapContextProvider } from '../context/ModalMapContextProvider';
import { UserContextProvider } from '../context/UserContextProvider';
import '../generated/fontello/css/hsl-icons.css';
import { GQLClient } from '../graphql';
import '../i18n';
import '../styles/globals.css';

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
          <ModalMapContextProvider>
            <MapEditorContextProvider>
              <Router />
              <Toaster />
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...pageProps} />
            </MapEditorContextProvider>
          </ModalMapContextProvider>
        </UserContextProvider>
      </ApolloProvider>
    </SafeHydrate>
  );
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
