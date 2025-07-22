import type { AppProps } from 'next/app';
import PageLayout from '../components/PageLayout';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <PageLayout>
    <Component {...pageProps} />
  </PageLayout>
);

export default MyApp;
