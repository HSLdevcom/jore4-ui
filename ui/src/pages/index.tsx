import { Suspense } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import PulseLoader from 'react-spinners/PulseLoader';
import { UserProvider } from '../auth/UserProvider';
import { AsyncTaskListProvider } from '../components/common/AsyncTaskList';
import { theme } from '../generated/theme';
import { ApolloProvider } from '../graphql';
import { ReduxProvider } from '../redux';
import { Router } from '../router/Router';
import { CypressCoordinatesHelper } from '../uiComponents/CypressCoordinatesHelper';
import { Toaster } from '../uiComponents/Toaster';

const enableCypressCoordinateHelper = false;

const Index = () => {
  const { i18n } = useTranslation();

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <html lang={i18n.language} />
          <title>JORE4 Testiversio</title>
          <link rel="icon" href="/favicon.ico" />
        </Helmet>
        <ApolloProvider>
          <ReduxProvider>
            <Suspense
              fallback={
                <PulseLoader
                  color={theme.colors.brand}
                  size={25}
                  cssOverride={{
                    display: 'inline-block',
                    position: 'relative',
                    paddingTop: '2rem',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                  }}
                  speedMultiplier={0.7}
                />
              }
            >
              <UserProvider />
              <AsyncTaskListProvider>
                <Router />
              </AsyncTaskListProvider>
              <Toaster />
            </Suspense>
          </ReduxProvider>
        </ApolloProvider>

        {enableCypressCoordinateHelper && <CypressCoordinatesHelper />}
      </div>
    </HelmetProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default Index;
