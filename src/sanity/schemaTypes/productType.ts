export default {
  name: 'product',
  title: 'Produto',
  type: 'document',
  fields: [
    { name: 'title', title: 'Título', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'image', title: 'Imagem', type: 'image', options: { hotspot: true } },
    { name: 'price', title: 'Preço', type: 'number' },
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
          { title: 'Bikes', value: 'bikes' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    { name: 'description', title: 'Descrição', type: 'text' },
    
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