export default {
  name: 'product',
  title: 'Produto',
  type: 'document',
  fields: [
    { name: 'title', title: 'Título', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'image', title: 'Imagem', type: 'image', options: { hotspot: true } },
    {
      name: 'additionalImages',
      title: 'Imagens Adicionais',
      type: 'array',
      description: 'Imagens extras do produto que aparecerão como miniaturas clicáveis',
      of: [{
        type: 'image',
        options: { hotspot: true }
      }],
      validation: (Rule: any) => Rule.max(6).warning('Recomendamos no máximo 6 imagens adicionais')
    },
    { name: 'price', title: 'Preço', type: 'number' },
    
    // CAMPOS DE PROMOÇÃO
    { 
      name: 'isOnSale', 
      title: 'Em Promoção', 
      type: 'boolean',
      description: 'Marcar se este produto está em promoção',
      initialValue: false
    },
    { 
      name: 'originalPrice', 
      title: 'Preço Original', 
      type: 'number',
      description: 'Preço original do produto (usado quando em promoção)',
      hidden: ({ document }: any) => !document?.isOnSale
    },
    { 
      name: 'salePrice', 
      title: 'Preço Promocional', 
      type: 'number',
      description: 'Preço com desconto aplicado',
      hidden: ({ document }: any) => !document?.isOnSale,
      validation: (Rule: any) => Rule.custom((salePrice: number, context: any) => {
        const { document } = context;
        if (document?.isOnSale && !salePrice) {
          return 'Preço promocional é obrigatório quando o produto está em promoção';
        }
        if (document?.isOnSale && document?.originalPrice && salePrice >= document.originalPrice) {
          return 'Preço promocional deve ser menor que o preço original';
        }
        return true;
      })
    },
    { 
      name: 'saleEndDate', 
      title: 'Data de Fim da Promoção', 
      type: 'datetime',
      description: 'Data e hora em que a promoção expira (opcional)',
      hidden: ({ document }: any) => !document?.isOnSale
    },
    { 
      name: 'shippingCost', 
      title: 'Frete', 
      type: 'number', 
      initialValue: 30.00,
      description: 'Valor do frete em reais (padrão: R$ 25,00)'
    },
    { 
      name: 'category', 
      title: 'Categoria', 
      type: 'string',
      options: {
        list: [
          { title: 'Vestuário', value: 'vestuario' },
          { title: 'Suplemento', value: 'suplementos' },
          { title: 'Equipamento', value: 'equipamento' },
          { title: 'Bolsas', value: 'bolsas' },
          { title: 'Bikes', value: 'bikes' },
          { title: 'Livro', value: 'livro' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    { name: 'description', title: 'Descrição', type: 'text' },
    
    // CAMPOS PARA CÁLCULO DE FRETE - MELHOR ENVIO
    {
      name: 'shippingDimensions',
      title: 'Dimensões para Frete',
      type: 'object',
      description: 'Dimensões e peso do produto para cálculo de frete via Melhor Envio',
      fields: [
        {
          name: 'weight',
          title: 'Peso (kg)',
          type: 'number',
          description: 'Peso do produto em quilogramas (kg)',
          validation: (Rule: any) => Rule.min(0.001).error('Peso deve ser maior que 0')
        },
        {
          name: 'width',
          title: 'Largura (cm)',
          type: 'number',
          description: 'Largura do produto em centímetros (cm)',
          validation: (Rule: any) => Rule.min(1).error('Largura deve ser maior que 0')
        },
        {
          name: 'height',
          title: 'Altura (cm)',
          type: 'number',
          description: 'Altura do produto em centímetros (cm)',
          validation: (Rule: any) => Rule.min(1).error('Altura deve ser maior que 0')
        },
        {
          name: 'length',
          title: 'Comprimento (cm)',
          type: 'number',
          description: 'Comprimento do produto em centímetros (cm)',
          validation: (Rule: any) => Rule.min(1).error('Comprimento deve ser maior que 0')
        }
      ],
      options: {
        collapsible: true,
        collapsed: false
      }
    },
    
    // CAMPO DE CUPONS ANEXADOS AO PRODUTO
    {
      name: 'applicableCoupons',
      title: 'Cupons Aplicáveis',
      type: 'array',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'coupon' }] 
      }],
      description: 'Cupons que podem ser usados especificamente neste produto'
    },
    
    { 
      name: 'featured', 
      title: 'Produto em Destaque', 
      type: 'boolean',
      description: 'Marcar se este produto deve aparecer em destaque'
    },
    { 
      name: 'inStock', 
      title: 'Em Estoque', 
      type: 'boolean',
      description: 'Indicar se o produto está disponível para compra',
      initialValue: true
    },
    {
      name: 'variants',
      title: 'Variantes do Produto',
      type: 'array',
      description: 'Diferentes versões do produto (sabores, cores, tamanhos, etc.)',
      of: [
        {
          type: 'object',
          name: 'variant',
          title: 'Variante',
          fields: [
            {
              name: 'name',
              title: 'Nome da Variante',
              type: 'string',
              description: 'Ex: Morango, Azul, Tamanho M'
            },
            {
              name: 'image',
              title: 'Imagem da Variante',
              type: 'image',
              options: { hotspot: true },
              description: 'Imagem específica desta variante (opcional)'
            },
            {
              name: 'priceModifier',
              title: 'Modificador de Preço',
              type: 'number',
              description: 'Valor a ser adicionado/subtraído do preço base (opcional)',
              initialValue: 0
            },
            {
              name: 'inStock',
              title: 'Em Estoque',
              type: 'boolean',
              description: 'Se esta variante específica está em estoque',
              initialValue: true
            }
          ],
          preview: {
            select: {
              title: 'name',
              media: 'image'
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      shippingCost: 'shippingCost',
      media: 'image',
      inStock: 'inStock'
    },
    prepare(selection: any) {
      const { title, price, shippingCost, inStock } = selection;
      const shipping = shippingCost || 25.00;
      return {
        title: title,
        subtitle: `R$ ${price ? price.toFixed(2) : '0,00'} + frete R$ ${shipping.toFixed(2)} ${inStock === false ? '(Fora de estoque)' : ''}`
      };
    }
  }
}