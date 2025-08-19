# 🛒 Fluxo Completo de Pagamento - PowerHouse Brasil

## 📋 Visão Geral

Este documento detalha todo o processo de pagamento da aplicação PowerHouse Brasil, desde a seleção do produto até a confirmação do pagamento pelo cliente.

---

## 🎯 Passo a Passo Completo

### 1. 🛍️ Seleção de Produtos

**Localização:** `/src/pages/shop.tsx` e páginas de produtos individuais

**Processo:**
1. Cliente navega pela loja
2. Visualiza produtos disponíveis
3. Clica em "Adicionar ao Carrinho"
4. Produto é adicionado ao contexto do carrinho (`useCart`)

**Arquivos Envolvidos:**
- `src/contexts/CartContext.tsx` - Gerenciamento do estado do carrinho
- `src/components/ProductCard.tsx` - Componente de produto
- `src/hooks/useCart.ts` - Hook para manipulação do carrinho

---

### 2. 🛒 Gerenciamento do Carrinho

**Localização:** Componente de carrinho e contexto

**Funcionalidades:**
- ✅ Adicionar produtos
- ✅ Remover produtos
- ✅ Atualizar quantidades
- ✅ Calcular subtotal
- ✅ Aplicar cupons de desconto
- ✅ Calcular frete
- ✅ Calcular total final

**Arquivos Principais:**
- `src/contexts/CartContext.tsx`
- `src/components/CartSidebar.tsx`
- `src/hooks/useCart.ts`

---

### 3. 📝 Página de Checkout

**Localização:** `/src/pages/checkout.tsx`

**Processo:**
1. Cliente acessa a página de checkout
2. Visualiza resumo do pedido:
   - Lista de produtos
   - Quantidades
   - Preços individuais
   - Subtotal
   - Valor do frete
   - Desconto (se houver cupom)
   - **Total final**

3. Clica em "Finalizar Compra"
4. Sistema inicia processo de pagamento

**Validações:**
- ✅ Carrinho não pode estar vazio
- ✅ Todos os produtos devem ter preço válido
- ✅ Quantidades devem ser positivas

---

### 4. 🔄 Criação da Preferência no MercadoPago

**Localização:** `/src/pages/api/checkout.ts`

**Processo Detalhado:**

#### 4.1 Recebimento dos Dados
```javascript
const { items, subtotal, shippingCost, appliedCoupon, total } = req.body;
```

#### 4.2 Validações
- ✅ Método deve ser POST
- ✅ Items deve ser array não vazio
- ✅ Token do MercadoPago deve estar configurado
- ✅ URL base deve ser válida

#### 4.3 Configuração da Preferência
```javascript
const preferenceData = {
  items: [...], // Produtos formatados
  back_urls: {
    success: `${baseUrl}/checkout/success`,
    failure: `${baseUrl}/checkout/failure`,
    pending: `${baseUrl}/checkout/pending`
  },
  auto_return: 'approved',
  notification_url: `${baseUrl}/api/webhooks/mercadopago`,
  external_reference: `powerhouse_${timestamp}_${random}`,
  // ... outras configurações
};
```

#### 4.4 Envio para MercadoPago
- **Endpoint:** `https://api.mercadopago.com/checkout/preferences`
- **Método:** POST
- **Headers:** Authorization Bearer + Content-Type JSON
- **Body:** Dados da preferência

#### 4.5 Resposta
```javascript
{
  url: preference.init_point, // URL para redirecionamento
  id: preference.id,
  external_reference: preference.external_reference,
  total: finalTotal,
  is_test: boolean
}
```

---

### 5. 🌐 Redirecionamento para MercadoPago

**Processo:**
1. Frontend recebe URL do MercadoPago
2. `window.location.href = data.url` redireciona o cliente
3. Cliente é levado para a página de pagamento do MercadoPago
4. Cliente escolhe método de pagamento:
   - 💳 Cartão de crédito
   - 💰 PIX
   - 🏦 Boleto bancário
   - 💳 Cartão de débito

---

### 6. 💳 Processamento do Pagamento

**No MercadoPago:**
1. Cliente preenche dados de pagamento
2. MercadoPago processa a transação
3. Resultado pode ser:
   - ✅ **Aprovado** - Pagamento confirmado
   - ❌ **Rejeitado** - Pagamento negado
   - ⏳ **Pendente** - Aguardando confirmação

---

### 7. 🔄 Retorno do Cliente

**URLs de Retorno Configuradas:**

#### 7.1 Pagamento Aprovado
- **URL:** `/checkout/success`
- **Arquivo:** `src/pages/checkout/success.tsx`
- **Ações:**
  - ✅ Limpa o carrinho automaticamente
  - ✅ Exibe mensagem de sucesso
  - ✅ Informa próximos passos
  - ✅ Oferece botões para continuar comprando

#### 7.2 Pagamento Rejeitado
- **URL:** `/checkout/failure`
- **Arquivo:** `src/pages/checkout/failure.tsx`
- **Ações:**
  - ❌ Exibe motivos possíveis da rejeição
  - 🔄 Oferece opção de tentar novamente
  - 📞 Disponibiliza contato para suporte

#### 7.3 Pagamento Pendente
- **URL:** `/checkout/pending`
- **Arquivo:** `src/pages/checkout/pending.tsx`
- **Ações:**
  - ⏳ Informa que pagamento está sendo processado
  - 📧 Orienta sobre recebimento de email
  - ⏰ Informa tempos de processamento por método

---

### 8. 🔔 Webhooks e Notificações

**Localização:** `/src/pages/api/webhooks/mercadopago.ts`

**Processo:**
1. MercadoPago envia notificações para: `${baseUrl}/api/webhooks/mercadopago`
2. Sistema recebe e processa notificações:
   - 💳 `type: 'payment'` - Atualizações de pagamento
   - 📦 `type: 'merchant_order'` - Atualizações de pedido

**Dados Recebidos:**
```javascript
{
  type: 'payment',
  data: { id: 'payment_id' },
  action: 'payment.created' | 'payment.updated'
}
```

**Ações do Webhook:**
- ✅ Log detalhado da notificação
- ✅ Identificação do tipo de evento
- ✅ Resposta HTTP 200 (obrigatória)
- 🔄 Processamento futuro: atualizar status no banco de dados

---

### 9. 📊 Consulta de Status de Pagamento

**Localização:** `/src/pages/api/payment/status.ts`

**Funcionalidades:**
- 🔍 Busca por ID do pagamento
- 🔍 Busca por referência externa
- 📋 Retorna status detalhado do pagamento

**Parâmetros de Consulta:**
- `payment_id` - ID específico do pagamento
- `external_reference` - Referência externa do pedido

---

## 🛠️ Arquivos e Serviços Principais

### Frontend
- `src/pages/checkout.tsx` - Página principal de checkout
- `src/pages/checkout/success.tsx` - Página de sucesso
- `src/pages/checkout/failure.tsx` - Página de falha
- `src/pages/checkout/pending.tsx` - Página de pendente
- `src/contexts/CartContext.tsx` - Contexto do carrinho

### Backend/API
- `src/pages/api/checkout.ts` - Criação de preferência
- `src/pages/api/webhooks/mercadopago.ts` - Processamento de webhooks
- `src/pages/api/payment/status.ts` - Consulta de status

### Serviços
- `src/services/checkout/checkout.service.ts` - Serviço de checkout
- `src/services/mercadopago/mercadopago.service.ts` - Integração MercadoPago
- `src/services/mercadopago/config.ts` - Configurações MercadoPago

---

## 🔧 Configurações Necessárias

### Variáveis de Ambiente
```env
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui
NEXT_PUBLIC_BASE_URL=https://seudominio.com.br
```

### URLs de Retorno
- ✅ Success: `${baseUrl}/checkout/success`
- ❌ Failure: `${baseUrl}/checkout/failure`
- ⏳ Pending: `${baseUrl}/checkout/pending`
- 🔔 Webhook: `${baseUrl}/api/webhooks/mercadopago`

---

## 🎯 Fluxo Resumido

```
1. Cliente seleciona produtos → Carrinho
2. Cliente vai para checkout → Visualiza resumo
3. Cliente clica "Finalizar" → API cria preferência MP
4. Sistema redireciona → MercadoPago processa pagamento
5. Cliente paga → MercadoPago retorna resultado
6. Cliente é redirecionado → Página de resultado (success/failure/pending)
7. MercadoPago envia webhook → Sistema processa notificação
8. Sistema atualiza status → Cliente recebe confirmação
```

---

## ✅ Status Atual

- ✅ **Seleção de produtos** - Funcionando
- ✅ **Carrinho** - Funcionando (adicionar, remover, atualizar)
- ✅ **Checkout** - Funcionando (cálculos, validações)
- ✅ **Integração MercadoPago** - Funcionando (criação de preferência)
- ✅ **Redirecionamento** - Funcionando
- ✅ **Páginas de retorno** - Funcionando (success, failure, pending)
- ✅ **Webhooks** - Configurado (logs funcionando)
- ✅ **Consulta de status** - Disponível

---

## 🚀 Próximos Passos (Melhorias Futuras)

1. **Banco de Dados**
   - Salvar pedidos no banco
   - Histórico de transações
   - Status de pedidos

2. **Notificações**
   - Email de confirmação
   - SMS de status
   - Notificações push

3. **Dashboard Admin**
   - Visualizar pedidos
   - Gerenciar status
   - Relatórios de vendas

4. **Melhorias UX**
   - Loading states
   - Feedback visual
   - Validações em tempo real

---

**📅 Última atualização:** $(date)
**🔧 Versão da aplicação:** Next.js 15.3.5
**💳 Versão MercadoPago:** API v1