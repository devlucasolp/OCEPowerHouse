# Configuração de Variáveis de Ambiente

Para usar o Sanity CMS, você precisa configurar as seguintes variáveis de ambiente:

## Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Configuração do Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=seu_project_id_aqui
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-17
SANITY_TOKEN=seu_token_de_escrita_aqui

# Configuração do Stripe (para e-commerce)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Como obter as informações do Sanity:

1. **Project ID**:
   - Acesse [sanity.io](https://sanity.io)
   - Faça login e acesse seu projeto
   - Vá em "API" e copie o Project ID

2. **Token**:
   - No mesmo painel "API"
   - Clique em "Tokens"
   - Crie um novo token com permissões de "Editor"
   - Copie o token gerado

3. **Dataset**:
   - Geralmente é "production"
   - Pode verificar no painel "Datasets"

## Depois de configurar:

1. Reinicie o servidor de desenvolvimento
2. Acesse `/studio` para usar o CMS
3. Teste criando um post ou produto

⚠️ **Importante**: Nunca commite o arquivo `.env.local` no Git!
