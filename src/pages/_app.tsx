import type { AppProps } from 'next/app';
import PageLayout from '../components/PageLayout';
import '../styles/globals.css';
import WhatsAppFloatButton from '../components/WhatsAppFloatButton';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <PageLayout>
    <Component {...pageProps} />
    <WhatsAppFloatButton />
  </PageLayout>
);

export default MyApp;
