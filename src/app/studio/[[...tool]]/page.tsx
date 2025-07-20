/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Removido dynamic = 'force-static' que causava problemas com o Studio

export default function StudioPage() {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Solução definitiva: remove TODOS os query params problemáticos
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      
      // Se a URL tem intent ou outros params problemáticos, limpa completamente
      if (currentUrl.includes('intent=') || currentUrl.includes('perspective=')) {
        const baseUrl = window.location.origin + window.location.pathname;
        
        // Redireciona para URL base limpa
        window.history.replaceState({}, '', baseUrl);
        
        // Força reload para garantir estado limpo
        setTimeout(() => {
          setShouldRender(true);
        }, 100);
      } else {
        setShouldRender(true);
      }
    }
  }, []);

  if (!shouldRender) {
    return (
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f1f3f4',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          color: '#333'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '10px' }}>🔧</div>
          <div>Preparando Sanity Studio...</div>
        </div>
      </div>
    );
  }

  // Configuração limpa para evitar problemas
  const cleanConfig = {
    ...config,
    // Desabilita features problemáticas temporariamente
    __experimental: {
      // Força modo compatível
      legacyBrowser: true
    }
  };

  return <NextStudio config={cleanConfig} />;
}
