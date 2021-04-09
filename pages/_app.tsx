import type { AppProps } from 'next/app';
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
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </SafeHydrate>
  );
}

// eslint-disable-next-line import/no-default-export
export default MyApp;
