import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Páginas que já têm seu próprio layout (incluem PageLayout internamente)
  const pagesWithOwnLayout = [
    '/',
    '/ajuda',
    '/faq', 
    '/politica-privacidade',
    '/termos-uso'
  ];
  
  if (pagesWithOwnLayout.includes(router.pathname)) {
    return (
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    );
  }
  
  // Outras páginas usam o layout padrão com Header e Footer
  return (
    <div className={inter.className}>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </div>
  );
}

export default MyApp;