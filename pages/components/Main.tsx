import styles from '../styles/Home.module.css';

export function Main() {
  return (
    <div>
      <main>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.ts</code>
        </p>
      </main>
    </div>
  );
}
