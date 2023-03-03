import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import NavMenu from '~/components/NavMenu';
import '~/styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => (
  <Fragment>
    <Head>
      <title>Maritime flash cards</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <NavMenu />
    <Component {...pageProps} />
  </Fragment>
);

export default App;
