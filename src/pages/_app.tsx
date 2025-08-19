import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { initRecaptchaFix } from '@/utils/recaptchaFix';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  
  useEffect(() => {
    // Inicializa o sistema de correção do reCAPTCHA
    initRecaptchaFix();
  }, []);
  
  // A página inicial tem sua própria estrutura
  if (router.pathname === '/') {
    return <Component {...pageProps} />;
  }
  
  // Outras páginas usam o layout padrão
  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  );
};

export default MyApp;