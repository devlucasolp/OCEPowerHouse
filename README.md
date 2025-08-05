# Power House Brasil — Plataforma de Ciclismo

Plataforma moderna para a Power House Brasil, referência nacional em produtos, conteúdo e comunidade para ciclistas urbanos e esportivos. O projeto oferece vitrine de produtos, blog integrado, checkout seguro com Stripe e arquitetura pronta para escalar.

---

## 🚀 Stack

- **Next.js** (React, SSR/SSG, API Routes)
- **TypeScript** (tipagem forte e segura)
- **TailwindCSS** (Design System, responsividade e performance)
- **Zustand** (gerenciamento de estado do carrinho)
- **Stripe** (checkout e pagamentos, modo dev)
- **Sanity CMS** (pré-configurado para blog e produtos)
- **ESLint & Prettier** (qualidade e padronização)

---

## 📦 Scripts

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Gera build de produção
npm run start     # Inicia o servidor em produção
npm run lint      # Lint nos arquivos do projeto
npm run format    # Formata o código com Prettier
npm run sitemap   # Gera sitemap.xml automaticamente
```

---

## ⚙️ Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/powerhousebrasil.git
   cd powerhousebrasil
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz:

   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   SANITY_PROJECT_ID=xxxxxx
   SANITY_DATASET=production
   SANITY_API_VERSION=2023-07-03
   SANITY_TOKEN=xxxxxx
   ```

   > Para testar Stripe, use as chaves de teste do dashboard Stripe.

4. **Imagens:**
   - Todas as imagens devem estar em `/public` (ex: `/public/img/static/hero.jpg`).
   - Se usar imagens externas, adicione os domínios em `next.config.js`.

---

## 🛒 Stripe (Checkout)

- Integração pronta para pagamentos (modo teste).
- Checkout seguro via Stripe.
- Configure as chaves no `.env.local` e no painel da Vercel.

---

## 📝 Sanity CMS

- Pré-configurado para blog e produtos.
- Para conectar ao Sanity real, configure as variáveis e schemas no projeto Sanity.

---

## ☁️ Deploy na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Importe o repositório do projeto
3. Configure as variáveis de ambiente no painel do projeto
4. Deploy automático será feito
5. (Opcional) Configure domínio customizado

---

## 📄 Licença

MIT

---

**Desenvolvido com ♥ por Power House Brasil e comunidade open source.**
