import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { SimpleLanguageChooser } from '../components/SimpleLanguageChooser';
import '../i18n';
import styles from '../styles/Home.module.css';

// eslint-disable-next-line import/no-default-export
export default function Index() {
  const { t } = useTranslation();
  return (
    <div>
      <Head>
        <title>Jore4 UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SimpleLanguageChooser />
      <footer className={styles.footer}>
        <p>{t('version', { version: process.env.NEXT_PUBLIC_GIT_HASH })}</p>
      </footer>
    </div>
  );
}
