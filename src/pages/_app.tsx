import type { AppProps } from 'next/app';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Main } from '../components/Main';
import { Router } from '../components/Router';
import '../styles/globals.css';
import { initStore } from '../redux/store';

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
      <Provider store={initStore()}>
        <Main>
          <Router />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Main>
      </Provider>
    </SafeHydrate>
  );
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
