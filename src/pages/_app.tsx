import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Link from 'next/link';
import styles from '@/styles/App.module.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.container}>
      <h1>
        <Link href="/">Rezepte</Link>
      </h1>
      <hr></hr>
      <Component {...pageProps} />
    </div>
  );
}
