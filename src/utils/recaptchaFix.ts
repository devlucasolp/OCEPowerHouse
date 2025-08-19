/**
 * Utilitário para resolver problemas de conectividade do reCAPTCHA
 * Redireciona requisições de www.google.com para www.recaptcha.net quando necessário
 */

export const initRecaptchaFix = () => {
  if (typeof window === 'undefined') return;

  // Intercepta requisições fetch para redirecionar reCAPTCHA
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Redireciona requisições do reCAPTCHA para o domínio alternativo
    if (url.includes('www.google.com/recaptcha/')) {
      const newUrl = url.replace('www.google.com/recaptcha/', 'www.recaptcha.net/recaptcha/');
      console.log('🔄 Redirecionando reCAPTCHA:', url, '->', newUrl);
      
      if (typeof input === 'string') {
        return originalFetch.call(this, newUrl, init);
      } else if (input instanceof URL) {
        return originalFetch.call(this, new URL(newUrl), init);
      } else {
        return originalFetch.call(this, { ...input, url: newUrl }, init);
      }
    }
    
    return originalFetch.call(this, input, init);
  };

  // Intercepta XMLHttpRequest para redirecionar reCAPTCHA
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    if (urlString.includes('www.google.com/recaptcha/')) {
      const newUrl = urlString.replace('www.google.com/recaptcha/', 'www.recaptcha.net/recaptcha/');
      console.log('🔄 Redirecionando reCAPTCHA XHR:', urlString, '->', newUrl);
      return originalXHROpen.call(this, method, newUrl, ...args);
    }
    
    return originalXHROpen.call(this, method, url, ...args);
  };

  // Monitora erros de rede relacionados ao reCAPTCHA
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('recaptcha')) {
      console.warn('⚠️ Erro detectado no reCAPTCHA:', event.message);
      console.log('💡 Tentativa de usar domínio alternativo www.recaptcha.net');
    }
  });

  // Monitora erros de recursos não carregados
  window.addEventListener('error', (event) => {
    const target = event.target as HTMLElement;
    if (target && target.tagName === 'SCRIPT') {
      const src = (target as HTMLScriptElement).src;
      if (src && src.includes('www.google.com/recaptcha/')) {
        console.warn('⚠️ Falha ao carregar script do reCAPTCHA:', src);
        console.log('💡 Considere usar www.recaptcha.net como alternativa');
      }
    }
  }, true);

  console.log('✅ Sistema de correção do reCAPTCHA inicializado');
};

/**
 * Verifica se o reCAPTCHA está funcionando corretamente
 */
export const checkRecaptchaHealth = async (): Promise<boolean> => {
  try {
    // Testa conectividade com www.google.com
    const googleResponse = await fetch('https://www.google.com/recaptcha/api.js', {
      method: 'HEAD',
      mode: 'no-cors'
    });
    
    console.log('✅ Conectividade com www.google.com: OK');
    return true;
  } catch (error) {
    console.warn('⚠️ Problema de conectividade com www.google.com:', error);
    
    try {
      // Testa conectividade com www.recaptcha.net
      const recaptchaResponse = await fetch('https://www.recaptcha.net/recaptcha/api.js', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      console.log('✅ Conectividade com www.recaptcha.net: OK');
      return true;
    } catch (recaptchaError) {
      console.error('❌ Problema de conectividade com ambos os domínios:', recaptchaError);
      return false;
    }
  }
};

/**
 * Força o uso do domínio alternativo do reCAPTCHA
 */
export const forceRecaptchaAlternativeDomain = () => {
  if (typeof window === 'undefined') return;

  // Substitui scripts do Google reCAPTCHA pelo domínio alternativo
  const scripts = document.querySelectorAll('script[src*="www.google.com/recaptcha"]');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    const oldSrc = script.getAttribute('src') || '';
    const newSrc = oldSrc.replace('www.google.com/recaptcha/', 'www.recaptcha.net/recaptcha/');
    
    newScript.src = newSrc;
    newScript.async = true;
    
    // Copia outros atributos
    Array.from(script.attributes).forEach((attr) => {
      if (attr.name !== 'src') {
        newScript.setAttribute(attr.name, attr.value);
      }
    });
    
    script.parentNode?.replaceChild(newScript, script);
    console.log('🔄 Script reCAPTCHA substituído:', oldSrc, '->', newSrc);
  });
};