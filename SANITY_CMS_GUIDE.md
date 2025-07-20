# Guia do Sanity CMS - OCE PowerHouse

## Como Acessar o Sanity Studio

### 1. Configuração das Variáveis de Ambiente

Primeiro, crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=seu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-17
SANITY_TOKEN=seu_token_de_escrita
```

Para obter essas informações:

1. Acesse [sanity.io](https://sanity.io)
2. Faça login na sua conta
3. Acesse o projeto
4. Vá em "API" para pegar o Project ID
5. Crie um token em "API" > "Tokens"

### 2. Acessando o Studio

Com o projeto rodando (`npm run dev`), acesse:

```
http://localhost:3000/studio
```

## Tipos de Conteúdo Disponíveis

### 1. **Posts (Blog)**

- **Título**: Título do post
- **Slug**: URL amigável (gerada automaticamente)
- **Imagem Principal**: Imagem de destaque do post
- **Autor**: Referência ao autor
- **Data de Publicação**: Data de publicação
- **Conteúdo**: Texto rico com formatação

### 2. **Produtos (Loja)**

- **Título**: Nome do produto
- **Slug**: URL amigável
- **Imagem**: Foto do produto
- **Preço**: Valor em reais
- **Categoria**: Categoria do produto (ex: "Vestuário", "Acessórios")
- **Descrição**: Descrição detalhada

### 3. **Powercamps (Eventos)**

- **Título**: Nome do evento
- **Slug**: URL amigável
- **Imagem**: Foto do evento
- **Data do Evento**: Data de realização
- **Descrição**: Descrição do evento
- **Ano**: Ano de realização

### 4. **Autores**

- **Nome**: Nome do autor
- **Slug**: URL amigável
- **Imagem**: Foto do autor
- **Bio**: Biografia

### 5. **Categorias**

- **Título**: Nome da categoria
- **Slug**: URL amigável
- **Descrição**: Descrição da categoria

## Como Adicionar Conteúdo

### Adicionando um Post

1. No Studio, clique em "Post"
2. Clique em "Create new Post"
3. Preencha:
   - **Title**: Título do seu post
   - **Slug**: Clique em "Generate" para gerar automaticamente
   - **Main image**: Upload da imagem principal
   - **Author**: Selecione ou crie um autor
   - **Published at**: Data de publicação
   - **Body**: Conteúdo do post usando o editor rich text

### Adicionando um Produto

1. No Studio, clique em "Produto"
2. Clique em "Create new Produto"
3. Preencha:
   - **Título**: Nome do produto
   - **Slug**: Clique em "Generate"
   - **Imagem**: Upload da foto do produto
   - **Preço**: Valor sem o símbolo R$ (ex: 129.90)
   - **Categoria**: Digite a categoria (ex: "Vestuário", "Acessórios")
   - **Descrição**: Descrição detalhada

### Adicionando um Powercamp

1. No Studio, clique em "Powercamp"
2. Clique em "Create new Powercamp"
3. Preencha todos os campos necessários

## Como o Conteúdo Aparece no Site

### Posts

- **Página do Blog**: `/blog` - Lista todos os posts
- **Post Individual**: `/blog/[slug]` - Página individual do post

### Produtos

- **Loja**: `/shop` - Lista todos os produtos
- **Produto Individual**: `/shop/[slug]` - Página do produto

### Powercamps

- **Página de Powercamps**: `/powercamps` - Lista todos os eventos

## Funções de Query Disponíveis

O projeto já tem funções prontas em `src/lib/sanity.ts`:

```typescript
// Buscar todos os posts
const posts = await getAllPosts();

// Buscar post por slug
const post = await getPostBySlug('meu-post');

// Buscar todos os produtos
const products = await getAllProducts();

// Buscar produto por slug
const product = await getProductBySlug('meu-produto');
```

## Dicas Importantes

### 1. **Slugs**

- Sempre gere slugs únicos
- Use apenas letras minúsculas, números e hífens
- Exemplo: "minha-primeira-postagem"

### 2. **Imagens**

- Use imagens de alta qualidade
- Formato recomendado: JPG ou PNG
- Tamanho recomendado: máximo 2MB

### 3. **Categorias de Produtos**

Categorias recomendadas:

- "Vestuário"
- "Acessórios"
- "Equipamentos"
- "Suplementos"

### 4. **Publicação**

- O conteúdo é publicado automaticamente quando salvo
- Para despublicar, delete o documento no Studio

## Troubleshooting

### Problema: "Missing environment variable"

**Solução**: Verifique se as variáveis de ambiente estão configuradas corretamente no `.env.local`

### Problema: "Unauthorized"

**Solução**: Verifique se o token do Sanity tem permissões de escrita

### Problema: Conteúdo não aparece no site

**Solução**:

1. Verifique se o documento foi salvo no Studio
2. Aguarde alguns segundos para a sincronização
3. Recarregue a página

## Comandos Úteis

```bash
# Rodar o projeto em desenvolvimento
npm run dev

# Acessar apenas o Studio do Sanity
npx sanity dev

# Fazer deploy do Studio
npx sanity deploy

# Verificar configuração do Sanity
npx sanity check
```

## Próximos Passos

1. **Configure as variáveis de ambiente**
2. **Acesse o Studio** em `/studio`
3. **Crie alguns posts de teste**
4. **Adicione produtos à loja**
5. **Configure autores e categorias**

Para mais informações, consulte a [documentação oficial do Sanity](https://www.sanity.io/docs).
