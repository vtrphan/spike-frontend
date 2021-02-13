import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactComponent as NxLogo } from '../public/nx-logo-white.svg';
import './styles.css';

const queryClient = new QueryClient();
function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Spike Frontend Test</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <div className="app">
        <header className="flex">
          <NxLogo width="75" height="50" />
          <h1>Spike Frontend</h1>
        </header>
        <main>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen />
          </QueryClientProvider>
        </main>
      </div>
    </>
  );
}

export default CustomApp;
