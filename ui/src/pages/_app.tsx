import 'maplibre-gl/dist/maplibre-gl.css';
import type { AppProps } from 'next/app';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import '../generated/fontello/css/hsl-icons.css';
import '../i18n';
import '../styles/globals.css';

const SafeHydrate: FC<PropsWithChildren> = ({ children }) => {
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
};

const Jore4App = ({ Component, pageProps }: AppProps) => {
  return (
    <SafeHydrate>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </SafeHydrate>
  );
};

// eslint-disable-next-line import/no-default-export
export default Jore4App;
