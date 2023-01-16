import type { AppProps } from 'next/app';
import '@/styles/globals.scss';
import Link from 'next/link';
import Head from 'next/head';
import styles from '@/styles/App.module.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rezepte</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <section className="section py-5">
        <div className="container is-max-desktop">
          <h1 className="title is-4">
            <Link href="/">Rezepte</Link>
          </h1>
        </div>
      </section>
      <hr className="my-0"></hr>
      <Component {...pageProps} />
    </div>
  );
}
