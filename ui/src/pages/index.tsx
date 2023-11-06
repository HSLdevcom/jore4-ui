import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { UserProvider } from '../auth/UserProvider';
import { ApolloProvider } from '../graphql';
import { ReduxProvider } from '../redux';
import { Router } from '../router/Router';
import { Toaster } from '../uiComponents/Toaster';

const Index = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Head>
        <title>JORE4 Testiversio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider>
        <ReduxProvider>
          <UserProvider />
          <Router />
          <Toaster />
        </ReduxProvider>
      </ApolloProvider>
      <footer className="mt-6 flex justify-center">
        <p>{t('version', { version: process.env.NEXT_PUBLIC_GIT_HASH })}</p>
      </footer>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Index;
