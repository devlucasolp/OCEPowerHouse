# 🔄 Conversor CSV para Sanity JSON

Este script Python converte dados de produtos em formato CSV para JSON compatível com o Sanity Studio.

## 📋 Formato do CSV

O CSV deve conter as seguintes colunas (algumas são obrigatórias, outras opcionais):

### Colunas Obrigatórias:
- `title` - Nome do produto
- `price` - Preço do produto (aceita "R$ 166,50" ou "166.50")

### Colunas Opcionais:
- `description` - Descrição do produto
- `category` - Categoria (vestuario, acessorios, suplementos, nutricao, bike_pneus, bike_acessorios)
- `image_filename` - Nome do arquivo de imagem
- `variants` - Variantes separadas por vírgula (ex: "Morango, Vanilla, Chocolate")
- `tags` - Tags separadas por vírgula
- `featured` - Se é produto destacado (true/false)
- `inStock` - Se está em estoque (true/false)
- `brand` - Marca do produto
- `weight` - Peso em gramas
- `salePrice` - Preço promocional
- `stockQuantity` - Quantidade em estoque
- `rating` - Avaliação (0-5)

## 📄 Exemplo de CSV

```csv
title,description,price,category,image_filename,variants,featured,inStock,brand
"Palatinose Gel (Box c/15 sachês)","Palatinose é a fonte de carboidrato mais eficiente","R$ 166,50","suplementos","palatinose.png","Morango, Vanilla",false,true,"PowerHouse"
"Whey Protein 1kg","Proteína de alta qualidade","R$ 89,90","suplementos","whey.jpg","Chocolate, Morango, Vanilla",true,true,"PowerHouse"
"Camiseta Dri-Fit","Camiseta para treino","R$ 45,00","vestuario","camiseta.jpg","P, M, G, GG",false,true,"Nike"
```

## 🚀 Como Usar

1. **Execute o script:**
```bash
python csv_to_sanity.py
```

2. **Digite o caminho do seu arquivo CSV:**
```
📂 Digite o caminho do arquivo CSV: meus_produtos.csv
```

3. **Escolha o nome do arquivo de saída (opcional):**
```
📁 Nome do arquivo de saída (deixe vazio para automático): produtos_sanity.json
```

## 📊 Resultado

O script gerará um arquivo JSON com a estrutura correta para importar no Sanity:

```json
[
  {
    "_createdAt": "2025-08-13T00:00:00.000Z",
    "_id": "44f0dba4-a1b9-4284-9d30-326dbbc7c0ec",
    "_rev": "e706a741-9937-4df6-9782-0422825e73d5",
    "_type": "product",
    "_updatedAt": "2025-08-13T00:00:00.000Z",
    "title": "Palatinose Gel (Box c/15 sachês)",
    "slug": {
      "_type": "slug",
      "current": "palatinose-gel-box-c15-saches"
    },
    "description": "Palatinose é a fonte de carboidrato mais eficiente...",
    "price": 166.5,
    "category": "suplementos",
    "image": {
      "_type": "image",
      "alt": "palatinose",
      "asset": {
        "_ref": "image-palatinose-12345678-1080x1080-png",
        "_type": "reference"
      }
    },
    "variants": [
      {
        "_key": "7c86ff02f1ff",
        "_type": "variant",
        "name": "Morango",
        "priceModifier": 0,
        "inStock": true
      },
      {
        "_key": "49d0de00f153",
        "_type": "variant",
        "name": "Vanilla",
        "priceModifier": 0,
        "inStock": true
      }
    ],
    "featured": false,
    "inStock": true,
    "brand": "PowerHouse"
  }
]
```

## 📸 Upload de Imagens

⚠️ **Importante**: As referências de imagem são geradas automaticamente, mas você precisa:

1. **Fazer upload das imagens** para o Sanity Studio manualmente
2. **Copiar os IDs reais** das imagens após o upload
3. **Substituir** os IDs fictícios no JSON pelos IDs reais

Ou use a ferramenta de importação do Sanity que pode fazer isso automaticamente.

## 🔧 Personalização

Para adaptar o script às suas necessidades:

1. **Modifique o mapeamento de categorias** na função `get_category_value()`
2. **Ajuste o formato de slug** na função `generate_slug()`
3. **Adicione novos campos** seguindo o padrão existente

## 🏷️ Categorias Suportadas

- `vestuario` - Vestuário
- `acessorios` - Acessórios
- `suplementos` - Suplementos
- `nutricao` - Nutrição & Géis
- `bike_pneus` - Pneus de Bike
- `bike_acessorios` - Acessórios de Bike

## 🐛 Solução de Problemas

### Erro de encoding:
Se tiver problemas com acentos, salve o CSV com encoding UTF-8.

### Preços não reconhecidos:
O script aceita vários formatos:
- `166.50`
- `R$ 166,50`
- `166,50`

### Colunas não encontradas:
O script é flexível - colunas ausentes serão ignoradas e valores padrão serão usados.

## 📝 Exemplo Completo

Arquivo `produtos.csv`:
```csv
title,description,price,category,variants,featured,inStock
"Palatinose Gel","Energia equilibrada",166.50,suplementos,"Morango,Vanilla",false,true
"Whey Protein","Proteína premium",89.90,suplementos,"Chocolate,Morango",true,true
"Camiseta Treino","Camiseta respirável",45.00,vestuario,"P,M,G",false,true
```

Comando:
```bash
python csv_to_sanity.py
# Digite: produtos.csv
# Resultado: produtos_sanity.json
```

## ✅ Próximos Passos

1. **Execute** o script para converter seu CSV
2. **Revise** o JSON gerado
3. **Faça upload** das imagens no Sanity Studio
4. **Atualize** as referências de imagem se necessário
5. **Importe** o JSON no Sanity usando a ferramenta de importação 