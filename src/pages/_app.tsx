import { ApolloProvider } from '@apollo/client';
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js';
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
import { reactPlugin } from './AppInsights';

function SafeHydrate({ children }: { children: JSX.Element }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
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
    </AppInsightsContext.Provider>
  );
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
