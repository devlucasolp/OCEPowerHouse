# 🛒 Guia de Configuração - Mercado Pago

## 📋 **Configuração Inicial**

### 1. **Criar Conta no Mercado Pago**
1. Acesse [developers.mercadopago.com](https://developers.mercadopago.com)
2. Faça login ou crie uma conta
3. Crie uma nova aplicação
4. Anote o `Access Token` e `Public Key`

### 2. **Configurar Variáveis de Ambiente**

Crie/edite o arquivo `.env.local` na raiz do projeto:

```bash
# Configuração do Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-834693252311167-072414-601382743fe246f2f08174abd919e166-2579741776
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=APP_USR-56f8a6e5-0db5-436e-8498-168f6c82592c

# URLs do ambiente
NEXT_PUBLIC_BASE_URL=https://powerhousebrasil.com.br
```

### 3. **Onde Encontrar as Credenciais**

1. **Dashboard** → Sua aplicação → **Credenciais**
2. **Sandbox (Teste)**: Para desenvolvimento
3. **Produção**: Para ambiente live

---

## 🔧 **Funcionalidades Implementadas**

### ✅ **API de Checkout** (`/api/checkout`)
- Cria preferência de pagamento no Mercado Pago
- Aceita múltiplos itens do carrinho
- Calcula total automaticamente
- Redireciona para checkout do Mercado Pago

### ✅ **Páginas de Retorno**
- **`/checkout/success`** - Pagamento aprovado
- **`/checkout/failure`** - Pagamento rejeitado  
- **`/checkout/pending`** - Pagamento pendente

### ✅ **Métodos de Pagamento Suportados**
- 💳 Cartão de crédito (até 12x)
- 💳 Cartão de débito
- 🔥 PIX (aprovação instantânea)
- 📄 Boleto bancário

---

## 📱 **Como Testar**

### 1. **Usar Credenciais de Sandbox**
```bash
# Exemplo de credenciais de teste
MERCADO_PAGO_ACCESS_TOKEN=TEST-1234567890-123456-abcdef...
```

### 2. **Cartões de Teste**
```bash
# Visa (Aprovado)
4013540682746260

# Mastercard (Rejeitado)  
5031433215406351

# CVV: 123
# Vencimento: 11/25
```

### 3. **Fluxo de Teste**
1. Adicione produtos ao carrinho
2. Acesse `/checkout`
3. Clique em "Finalizar Compra"
4. Complete o pagamento no Mercado Pago
5. Verifique as páginas de retorno

---

## 🎨 **UX Implementada**

### 💡 **Melhorias na Interface**
- ✅ Loading states durante processamento
- ✅ Mensagens de erro amigáveis
- ✅ Informações sobre métodos de pagamento
- ✅ Indicadores de segurança
- ✅ Animações suaves com Framer Motion

### 🔒 **Segurança**
- ✅ Validação server-side
- ✅ Tratamento de erros robusto
- ✅ Criptografia SSL
- ✅ Dados processados pelo Mercado Pago

---

## 🚀 **Deploy em Produção**

### 1. **Configurar Credenciais de Produção**
```bash
# No Vercel/Netlify/etc
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890-123456-abcdef...
NEXT_PUBLIC_BASE_URL=https://seudominio.com
```

### 2. **Configurar Webhooks (Opcional)**
Para receber notificações de pagamento:
- URL: `https://seudominio.com/api/webhooks/mercadopago`
- Eventos: `payment`, `merchant_order`

### 3. **Homologação**
- Teste com cartões reais em ambiente sandbox
- Verifique todos os fluxos de pagamento
- Valide redirecionamentos e URLs de retorno

---

## 📊 **Monitoramento**

### **Logs Importantes**
- ✅ Erros de API no console
- ✅ IDs de transação salvos
- ✅ Status de pagamentos registrados

### **Métricas a Acompanhar**
- Taxa de conversão no checkout
- Métodos de pagamento mais usados
- Tempo médio de finalização

---

## 🔧 **Customizações Possíveis**

### **Checkout**
- Modificar cores e layout
- Adicionar campos personalizados
- Configurar métodos de pagamento

### **Integrações**
- Webhook para atualizar estoque
- Envio de emails automatizados
- Integração com CRM/ERP

---

## 📞 **Suporte**

### **Documentação Oficial**
- [Mercado Pago Developers](https://developers.mercadopago.com)
- [API Reference](https://developers.mercadopago.com/reference)

### **Troubleshooting Comum**
1. **Token inválido**: Verifique credenciais
2. **CORS Error**: Configure domínios autorizados
3. **Webhook não funciona**: Verifique SSL/HTTPS

---

## ✨ **Próximos Passos**

- [ ] Implementar webhook para confirmação automática
- [ ] Adicionar sistema de cupons de desconto
- [ ] Integrar com sistema de estoque
- [ ] Implementar split de pagamentos (se aplicável)
- [ ] Adicionar relatórios de vendas