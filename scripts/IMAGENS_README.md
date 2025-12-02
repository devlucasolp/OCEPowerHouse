# 📸 Imagens dos Produtos - Alquimia da Saúde

## ✅ Status do Download

**29 de 34 imagens baixadas com sucesso (85%)**

### 📊 Estatísticas:
- ✅ **29 imagens baixadas** com match perfeito (100%)
- ❌ **5 produtos sem match** no HTML fornecido
- 📁 **Organizadas por categoria** (nutricao, suplementos, acessorios)
- 📋 **Mapeamento JSON criado** em `product_image_mapping.json`

---

## 📂 Estrutura de Arquivos

```
public/img/products/
├── nutricao/ (15 imagens)
│   ├── duragel-box-27g-15-sachês.png
│   ├── duragel-box-40g-15-sachês.png  
│   ├── duragel-box-50g-15-sachês.png
│   ├── palatinose-box-15-sachês.png
│   ├── palatinose-em-pó-300g.png
│   ├── palatinose-em-pó-smart-carb-300g.png
│   ├── smart-drink-hydro-750g.png
│   ├── smart-drink-hydro-laranja-hortelã-350g.png
│   ├── smart-drink-hydro-limão-hortelã-350g.png
│   ├── smart-drink-hydro-pink-lemonade-750g-outlet.png
│   ├── energia-performance-nitro-600-390g.png
│   ├── energia-performance-uva-orgânica-beterraba-e-cacau-300g.png
│   ├── energia-day-use-smoothie-frutas-silvestres-350g.jpg
│   ├── manteiga-ghee-500g.png
│   └── óleo-de-coco-em-pó-250g.png
├── suplementos/ (13 imagens)
│   ├── creatina-monohidratada-300-g.png
│   ├── recover-físico-60-cápsulas-vegetais.png
│   ├── clean-protein-cacau-675g.png
│   ├── clean-protein-banana-canela-675g.png
│   ├── clean-protein.png
│   ├── pólen-protein-smoothie-açaí-banana-350g.png
│   ├── pólen-protein-smoothie-frutas-vermelhas-350g.png
│   ├── nac-n-acetil-l-cisteína-500mg-120-cápsulas-vegetais.png
│   ├── nac-n-acetil-cisteína-500mg-outlet.png
│   ├── co-q10-coenzima-q10-60-cápsulas-vegetais.png
│   ├── açafrão-blend-termogênico-60-cápsulas-vegetais.png
│   ├── spirulina-110-cápsulas-vegetais.png
│   └── ora-pro-nóbis-orgânica-500mg-60-cápsulas-vegetais.png
└── acessorios/ (1 imagem)
    └── boné-exclusivo-alquimia-da-saúde.png
```

---

## ❌ Produtos Sem Imagem (5 produtos)

Estes produtos não foram encontrados no HTML fornecido:

1. **Impulse - Box 15 sachês** (nutricao)
2. **Hydro Salts - Box 10 unidades** (nutricao)  
3. **Cúrcuma - 60 Cápsulas Vegetais** (suplementos)
4. **Detox Supergreens - 90 Cápsulas Vegetais** (suplementos)
5. **Digestivo Ayurvédico - 60 Cápsulas Vegetais** (suplementos)

**⚠️ Ação necessária:** Encontrar imagens para estes produtos manualmente.

---

## 🚀 Como Usar no Sanity Studio

### 1. Upload das Imagens

1. **Acesse o Sanity Studio:**
   ```bash
   cd src/sanity
   npm run dev
   ```

2. **Para cada categoria, faça o upload:**
   - Vá para "Assets" no Sanity Studio
   - Faça upload de todas as imagens da pasta correspondente
   - Use nomes descritivos para facilitar a busca

### 2. Associar Imagens aos Produtos

Use o arquivo `product_image_mapping.json` como referência para associar cada imagem ao produto correto:

```json
{
  "Duragel Box 27g (15 sachês)": {
    "local_path": "/img/products/nutricao/duragel-box-27g-15-sachês.png",
    "category": "nutricao",
    "original_url": "https://cdn.awsli.com.br/600x600/..."
  }
}
```

### 3. Atualizar o JSON Final

Substitua as referências placeholder no `Produtos_Alquimia_FINAL_para_Sanity.json` pelas referências reais do Sanity após o upload.

**Exemplo de substituição:**
```json
// ANTES (placeholder)
"image": {
  "_type": "image",
  "alt": "Duragel Box 27g (15 sachês)",
  "asset": {
    "_ref": "image-duragel-box-27g-15-s-feac7dea-800x600-jpg",
    "_type": "reference"
  }
}

// DEPOIS (referência real do Sanity)
"image": {
  "_type": "image", 
  "alt": "Duragel Box 27g (15 sachês)",
  "asset": {
    "_ref": "image-abc123def456...", // ID real gerado pelo Sanity
    "_type": "reference"
  }
}
```

---

## 📋 Arquivo de Mapeamento

O arquivo `product_image_mapping.json` contém:
- **local_path**: Caminho da imagem no projeto
- **category**: Categoria do produto
- **original_url**: URL original da imagem (CDN Alquimia)

Este arquivo pode ser usado para:
- Automatizar a associação no Sanity via API
- Verificar quais produtos têm imagens
- Fazer backup das URLs originais

---

## 🔧 Scripts Disponíveis

### `html_photo_extractor.py`
- **Função**: Extrai URLs de imagens do HTML e faz download
- **Uso**: `python html_photo_extractor.py`
- **Output**: Imagens organizadas + `product_image_mapping.json`

### `Produtos_Alquimia_FINAL_para_Sanity.json`
- **Função**: JSON pronto para importação no Sanity
- **Status**: ✅ Pronto (com placeholders de imagem)
- **Próximo passo**: Substituir placeholders por referências reais

---

## ✅ Checklist Final

- [x] ✅ Extrair URLs das imagens do HTML
- [x] ✅ Baixar 29 imagens com sucesso
- [x] ✅ Organizar por categoria
- [x] ✅ Criar mapeamento JSON
- [x] ✅ Gerar JSON final para Sanity
- [ ] ⏳ Upload das imagens no Sanity Studio
- [ ] ⏳ Associar imagens aos produtos
- [ ] ⏳ Encontrar imagens para os 5 produtos sem match
- [ ] ⏳ Testar a importação completa

---

## 🎯 Próximos Passos

1. **Fazer upload das 29 imagens** no Sanity Studio
2. **Associar cada imagem** ao produto correspondente
3. **Buscar manualmente** as 5 imagens em falta
4. **Testar a importação** do JSON final
5. **Validar** se tudo está funcionando no frontend

---

## 🔍 Troubleshooting

### Problema: Imagem não aparece no frontend
- **Verificar**: Se a referência no JSON está correta
- **Solução**: Conferir o ID da imagem no Sanity Studio

### Problema: Qualidade da imagem ruim
- **Causa**: Imagem original em baixa resolução
- **Solução**: Buscar imagem em maior resolução ou editar

### Problema: Nome do arquivo inválido
- **Causa**: Caracteres especiais no nome
- **Solução**: Renomear seguindo padrão: `produto-categoria-tamanho.extensao`

---

**📝 Criado em:** $(date)
**🤖 Gerado por:** HTML Photo Extractor Script
**📊 Taxa de sucesso:** 85% (29/34 produtos) 