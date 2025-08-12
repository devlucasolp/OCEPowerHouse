import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  
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