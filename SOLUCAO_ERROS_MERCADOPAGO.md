# 🔧 Solução para Erros do MercadoPago.js

## 📋 Problema Identificado

Você está enfrentando os seguintes erros no console do navegador:

```
MercadoPago.js - Error updating cardNumber settings. Length should be a number between 8 and 19.
MercadoPago.js - invalid property settings for expirationDate. Only available for securityCode and cardNumber
```

## 🔍 Análise do Problema

### Causa Raiz
O seu projeto **OCEPowerHouse** está configurado corretamente para usar apenas o **Checkout Redirect** do MercadoPago, mas há scripts do **MercadoPago.js SDK** sendo carregados desnecessariamente no navegador. Estes scripts estão tentando inicializar componentes de **Checkout Transparente** (CardForm) que não existem na sua aplicação.

### Por que isso acontece?
1. **Checkout Redirect**: Seu projeto redireciona para o MercadoPago (correto)
2. **Scripts desnecessários**: Algum script do `sdk.mercadopago.com` está sendo carregado
3. **Conflito**: O SDK tenta encontrar elementos de formulário que não existem

## ✅ Soluções

### Solução 1: Verificar Scripts Externos

1. **Abra o DevTools** (F12) no navegador
2. **Vá para a aba Network**
3. **Recarregue a página**
4. **Procure por**: `sdk.mercadopago.com` ou `mercadopago.js`
5. **Se encontrar**, identifique de onde está vindo o script

### Solução 2: Verificar Plugins/Extensões

1. **Desative todas as extensões** do navegador temporariamente
2. **Teste o checkout** novamente
3. **Se os erros sumirem**, reative uma extensão por vez para identificar a culpada

### Solução 3: Verificar Código de Terceiros

1. **Procure por scripts** em:
   - Google Tag Manager
   - Google Analytics
   - Pixels do Facebook
   - Outros scripts de tracking

2. **Verifique se algum deles** está carregando o MercadoPago.js

### Solução 4: Bloquear Scripts Desnecessários

Adicione este código no `<head>` do seu layout principal:

```html
<script>
// Previne carregamento desnecessário do MercadoPago.js
if (typeof window !== 'undefined') {
  // Bloqueia inicialização automática se não estivermos na página de checkout
  const currentPath = window.location.pathname;
  const isCheckoutPage = currentPath.includes('/checkout') || currentPath.includes('/payment');
  
  if (!isCheckoutPage && window.MercadoPago) {
    console.log('🚫 MercadoPago.js bloqueado - não necessário nesta página');
    window.MercadoPago = undefined;
  }
}
</script>
```

### Solução 5: Verificar Temas/Templates

Se você estiver usando algum tema ou template:

1. **Verifique os arquivos** do tema
2. **Procure por**: `<script src="https://sdk.mercadopago.com`
3. **Remova ou comente** essas linhas

## 🛡️ Medidas Preventivas

### 1. Content Security Policy (CSP)

Adicione no seu `next.config.js`:

```javascript
const nextConfig = {
  // ... outras configurações
  async headers() {
    return [
      {
        source: '/((?!api/checkout|api/payment).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; object-src 'none';"
          }
        ]
      }
    ]
  }
}
```

### 2. Verificação de Scripts

Crie um utilitário para monitorar scripts:

```javascript
// utils/scriptMonitor.js
export const monitorScripts = () => {
  if (typeof window !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'SCRIPT' && node.src && node.src.includes('mercadopago')) {
            console.warn('⚠️ Script MercadoPago detectado:', node.src);
            console.trace('Stack trace do carregamento:');
          }
        });
      });
    });
    
    observer.observe(document.head, { childList: true, subtree: true });
    observer.observe(document.body, { childList: true, subtree: true });
  }
};
```

## 🔍 Como Verificar se Foi Resolvido

1. **Abra o DevTools** (F12)
2. **Vá para Console**
3. **Recarregue a página**
4. **Teste o checkout**
5. **Verifique se não há mais erros** do MercadoPago.js

## 📞 Próximos Passos

1. ✅ **Implemente a Solução 1** primeiro (verificar Network)
2. ✅ **Se não resolver**, tente a Solução 2 (extensões)
3. ✅ **Implemente as medidas preventivas**
4. ✅ **Teste completamente** o fluxo de checkout

## 🎯 Resultado Esperado

Após aplicar essas soluções:
- ❌ **Sem erros** do MercadoPago.js no console
- ✅ **Checkout funcionando** normalmente
- ✅ **Performance melhorada** (menos scripts desnecessários)
- ✅ **Experiência do usuário** sem interferências

---

**💡 Dica**: O seu sistema de checkout redirect está funcionando corretamente. Esses erros são apenas "ruído" de scripts desnecessários e não afetam a funcionalidade real do pagamento.