# Guia do Sanity CMS - OCE PowerHouse

## 🚀 Configuração Atualizada (Seguindo Melhores Práticas)

### 1. Configuração das Variáveis de Ambiente

Primeiro, crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Configuração do Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=seu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-17
SANITY_TOKEN=seu_token_de_escrita

# Configuração do Stripe (para e-commerce)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Para obter essas informações:

1. Acesse [sanity.io](https://sanity.io)
2. Faça login na sua conta
3. Acesse o projeto
4. Vá em "API" para pegar o Project ID
5. Crie um token em "API" > "Tokens" com permissões de **Editor**

### 2. Acessando o Studio

Com o projeto rodando (`npm run dev`), acesse:

```
http://localhost:3000/studio
```

## 📋 Estrutura Melhorada do CMS

O Studio agora tem uma organização aprimorada:

### 📝 **Blog**

- Posts
- Autores
- Categorias

### 🛒 **E-commerce**

- Produtos
- Produtos em Destaque (filtrados automaticamente)
- Produtos por Categoria

### 🏕️ **Eventos**

- Powercamps
- Eventos em Destaque
- Eventos por Ano (2024, 2025)

## 🛠️ Tipos de Conteúdo (Com Validações)

### 1. **Posts (Blog)**

**Campos disponíveis:**

- **Título**: Título do post (obrigatório)
- **Slug**: URL amigável (gerada automaticamente)
- **Imagem Principal**: Imagem de destaque com texto alternativo
- **Autor**: Referência ao autor
- **Data de Publicação**: Data de publicação
- **Conteúdo**: Texto rico com formatação
- **Categorias**: Múltiplas categorias

### 2. **Produtos (Loja)**

**Campos disponíveis:**

- **Título**: Nome do produto (obrigatório)
- **Slug**: URL amigável
- **Imagem**: Foto do produto com texto alternativo (obrigatório)
- **Preço**: Valor em reais (mínimo: 0)
- **Categoria**: Dropdown com opções predefinidas:
  - Vestuário
  - Acessórios
  - Equipamentos
  - Suplementos
- **Descrição**: Descrição detalhada (mínimo 10 caracteres)
- **Produto em Destaque**: Checkbox para destacar
- **Em Estoque**: Status de disponibilidade

### 3. **Powercamps (Eventos)**

**Campos disponíveis:**

- **Título**: Nome do evento (obrigatório)
- **Slug**: URL amigável
- **Imagem**: Foto do evento com texto alternativo
- **Data do Evento**: Data de realização (obrigatório)
- **Descrição**: Descrição do evento (mínimo 10 caracteres)
- **Ano**: Ano de realização (2020-2030)
- **Local**: Local do evento
- **Evento em Destaque**: Checkbox para destacar

## 🔍 Funções de Query Disponíveis

O projeto agora tem funções robustas em `src/lib/sanity.ts`:

### Posts

```typescript
// Buscar todos os posts
const posts = await getAllPosts();

// Buscar post por slug
const post = await getPostBySlug('meu-post');

// Buscar posts em destaque
const featuredPosts = await getFeaturedPosts(3);
```

### Produtos

```typescript
// Buscar todos os produtos
const products = await getAllProducts();

// Buscar produto por slug
const product = await getProductBySlug('meu-produto');

// Buscar produtos em destaque
const featuredProducts = await getFeaturedProducts(6);

// Buscar produtos por categoria
const products = await getProductsByCategory('vestuario');
```

### Powercamps

```typescript
// Buscar todos os powercamps
const powercamps = await getAllPowercamps();

// Buscar powercamp por slug
const powercamp = await getPowercampBySlug('meu-evento');

// Buscar powercamps em destaque
const featuredPowercamps = await getFeaturedPowercamps(3);

// Buscar powercamps por ano
const powercamps2024 = await getPowercampsByYear(2024);
```

### Utilidades

```typescript
// Buscar todas as categorias
const categories = await getAllCategories();

// Buscar todos os autores
const authors = await getAllAuthors();

// Busca global
const results = await searchContent('ciclismo');
```

## 🚀 Deploy e Convite de Editores

### 1. Deploy do Studio

Para fazer deploy do Studio no Vercel:

```bash
# Build do projeto
npm run build

# Deploy no Vercel
vercel --prod
```

### 2. Configurando Domínio no Sanity

1. Acesse o [painel do Sanity](https://sanity.io)
2. Vá em **API** > **CORS Origins**
3. Adicione seus domínios:
   - `http://localhost:3000` (desenvolvimento)
   - `https://seudominio.com` (produção)
   - `https://seudominio.vercel.app` (se usando Vercel)

### 3. Convidando Editores

1. No painel do Sanity, vá em **Members**
2. Clique em **Invite members**
3. Adicione o email da pessoa
4. Escolha a permissão:
   - **Administrator**: Acesso total
   - **Editor**: Pode criar/editar conteúdo
   - **Viewer**: Apenas visualizar

### 4. Variáveis no Vercel

Configure as mesmas variáveis do `.env.local` no painel do Vercel:

1. Acesse o projeto no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione todas as variáveis:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_TOKEN`

## ✨ Melhorias Implementadas

### 🔒 **Validações de Dados**

- Campos obrigatórios marcados
- Validação de preços (mínimo 0)
- Validação de anos (2020-2030)
- Textos mínimos para descrições

### 🎨 **Interface Melhorada**

- Ícones para cada tipo de conteúdo
- Organização hierárquica do Studio
- Filtros automáticos (destacados, categorias)
- Preview customizado com preços formatados

### 🔍 **Queries Otimizadas**

- GROQ queries seguindo melhores práticas
- Busca global entre todos os tipos
- Queries específicas para destacados
- Performance otimizada

### 🛡️ **Segurança**

- Vision tool apenas em desenvolvimento
- Validação de environment variables
- CORS configurado corretamente

## 📚 Links Úteis

- [Documentação do Sanity](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Estrutura do Studio](https://www.sanity.io/docs/structure-builder-cheat-sheet)
- [Deploy Guide](https://www.sanity.io/docs/deployment)

## 🆘 Troubleshooting

### Problema: Studio não carrega

**Solução:** Verifique as variáveis de ambiente e reinicie o servidor

### Problema: Imagens não aparecem

**Solução:** Configure CORS no painel do Sanity

### Problema: Não consegue editar

**Solução:** Verifique se o token tem permissões de Editor

### Problema: Build falha no Vercel

**Solução:** Certifique-se que todas as env vars estão configuradas
