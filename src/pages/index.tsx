import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import '../i18n';

// eslint-disable-next-line import/no-default-export
export default function Index() {
  const { t } = useTranslation();
  return (
    <div>
      <Head>
        <title>Jore4 UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <footer className="flex justify-center mt-6">
        <p>{t('version', { version: process.env.NEXT_PUBLIC_GIT_HASH })}</p>
      </footer>
    </div>
  );
}
