import Head from 'next/head';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/no-default-export
export default function Index() {
  const { t } = useTranslation();
  return (
    <div>
      <Head>
        <title>Jore4 UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <footer
        className="flex justify-center"
        /* 
          Set fixed height and margin manually, so height is known 
          and can used to calculate desired height for map component in MapPage.tsx
        */
        style={{
          height: 'var(--footer-height)',
          marginTop: 'var(--footer-margin-top)',
        }}
      >
        <p>{t('version', { version: process.env.NEXT_PUBLIC_GIT_HASH })}</p>
      </footer>
    </div>
  );
}
