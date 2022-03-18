import { ApolloProvider } from '@apollo/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { AppProps } from 'next/app';
import { Router } from '../components/Router';
import { Toaster } from '../components/Toaster';
import { MapEditorContextProvider } from '../context/MapEditorContextProvider';
import { MapFilterContextProvider } from '../context/MapFilter';
import { ModalMapContextProvider } from '../context/ModalMapContextProvider';
import { UserContextProvider } from '../context/UserContextProvider';
import '../generated/fontello/css/hsl-icons.css';
import { createGraphqlClient } from '../graphql';
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
  const graphqlClient = createGraphqlClient();
  return (
    <SafeHydrate>
      <ApolloProvider client={graphqlClient}>
        <UserContextProvider>
          <ModalMapContextProvider>
            <MapEditorContextProvider>
              <MapFilterContextProvider>
                <Router />
                <Toaster />
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...pageProps} />
              </MapFilterContextProvider>
            </MapEditorContextProvider>
          </ModalMapContextProvider>
        </UserContextProvider>
      </ApolloProvider>
    </SafeHydrate>
  );
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
