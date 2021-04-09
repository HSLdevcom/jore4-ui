import Head from 'next/head';
import '../i18n';
import styles from '../styles/Home.module.css';

// eslint-disable-next-line import/no-default-export
export default function Index() {
  return (
    <div>
      <Head>
        <title>Jore4 UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <footer className={styles.footer}>
        <p>{`Version: ${process.env.NEXT_PUBLIC_GIT_HASH}`}</p>
      </footer>
    </div>
  );
}
