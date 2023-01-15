import type { AppProps } from 'next/app';
import '@/styles/globals.scss';
import Link from 'next/link';
import Head from 'next/head';
import styles from '@/styles/App.module.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rezepte</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1 className="title is-4">
        <Link href="/">Rezepte</Link>
      </h1>
      <hr></hr>
      <Component {...pageProps} />
    </div>
  );
}
