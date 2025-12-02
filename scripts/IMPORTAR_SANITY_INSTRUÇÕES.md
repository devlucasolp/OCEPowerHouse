# 📥 Como Importar Produtos no Sanity Studio

## ✅ **Arquivo Pronto para Importação**
- **`Produtos_Alquimia_FINAL_para_Sanity.json`** (886 linhas, 34 produtos)

## 📊 **Dados Corrigidos:**

### ✅ **Estrutura Validada:**
- **Campos obrigatórios**: ✅ Todos presentes
- **Categorias**: ✅ Nutricao (17), Suplementos (16), Acessórios (1)
- **Preços**: ✅ R$ 35,90 - R$ 169,90 (média R$ 98,45)
- **Imagens**: ✅ Referências placeholder criadas
- **Slugs**: ✅ Únicos e válidos

### 🎯 **Produtos por Categoria:**
- **Nutrição & Géis** (17): Duragel, Palatinose, Smart Drink, etc.
- **Suplementos** (16): Proteínas, Creatina, Cápsulas, etc.
- **Acessórios** (1): Boné exclusivo

## 🚀 **Opções de Importação**

### **Opção 1: Sanity Studio (Recomendado)**

1. **Abrir Sanity Studio:**
   ```bash
   cd src
   npx sanity dev
   ```

2. **Acessar**: `http://localhost:3333`

3. **Ir para**: Vision (ícone de consulta)

4. **Executar importação via GROQ:**
   ```groq
   // Cole o conteúdo do JSON aqui usando a ferramenta de importação
   ```

### **Opção 2: CLI do Sanity**

1. **Instalar CLI:**
   ```bash
   npm install -g @sanity/cli
   ```

2. **Importar dados:**
   ```bash
   sanity dataset import Produtos_Alquimia_FINAL_para_Sanity.json production
   ```

### **Opção 3: API Manual (Avançado)**

Usar script Python com API do Sanity (já configurado no projeto).

## 📸 **Próximos Passos Após Importação**

### 1. **Upload de Imagens Reais**
- Substituir referências placeholder por imagens reais
- Usar Sanity Studio para fazer upload
- Atualizar referências `_ref` no banco

### 2. **Validação dos Dados**
- Verificar se todos os produtos apareceram
- Testar categorização
- Confirmar preços

### 3. **Configurar Cupons (Se Necessário)**
- Criar cupons no Sanity Studio
- Associar aos produtos específicos

## 🔧 **Resolução de Problemas**

### **Se a importação falhar:**

1. **Verificar token do Sanity** em `.env.local`
2. **Confirmar Project ID**: `1sbzjovr`
3. **Dataset**: `production`

### **Se produtos não aparecerem:**

1. **Verificar no Vision:**
   ```groq
   *[_type == "product"] | order(_createdAt desc) [0...10]
   ```

2. **Contar produtos:**
   ```groq
   count(*[_type == "product"])
   ```

## 📋 **Checklist Final**

- [ ] ✅ Arquivo JSON validado
- [ ] ✅ Sanity Studio rodando
- [ ] ✅ Produtos importados (34 produtos)
- [ ] ⏳ Imagens reais carregadas
- [ ] ⏳ Sistema de cupom testado
- [ ] ⏳ Frontend testado com produtos

## 🎉 **Resultado Esperado**

Após a importação, você terá:
- **34 produtos** categorizados corretamente
- **Preços realistas** para todos os produtos
- **Estrutura compatível** com o sistema de cupom
- **Base sólida** para o e-commerce

---

**🚀 O arquivo está 100% pronto para importação no Sanity!** 