export default {
  name: 'coupon',
  title: 'Cupom de Desconto',
  type: 'document',
  fields: [
    {
      name: 'code',
      title: 'Código do Cupom',
      type: 'string',
      description: 'Código único do cupom (ex: DESCONTO10, PRIMEIRA-COMPRA)',
      validation: (Rule: any) => Rule.required().min(3).max(20)
    },
    {
      name: 'title',
      title: 'Nome do Cupom',
      type: 'string',
      description: 'Nome descritivo do cupom',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      description: 'Descrição do que o cupom oferece'
    },
    {
      name: 'discountType',
      title: 'Tipo de Desconto',
      type: 'string',
      options: {
        list: [
          { title: 'Percentual (%)', value: 'percentage' },
          { title: 'Valor Fixo (R$)', value: 'fixed' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'discountValue',
      title: 'Valor do Desconto',
      type: 'number',
      description: 'Se percentual: número de 1 a 100. Se fixo: valor em reais',
      validation: (Rule: any) => Rule.required().min(0)
    },
    {
      name: 'minPurchaseAmount',
      title: 'Valor Mínimo da Compra',
      type: 'number',
      description: 'Valor mínimo da compra para usar o cupom (opcional)',
      initialValue: 0
    },
    {
      name: 'maxDiscountAmount',
      title: 'Desconto Máximo (R$)',
      type: 'number',
      description: 'Valor máximo de desconto para cupons percentuais (opcional)'
    },
    {
      name: 'usageLimit',
      title: 'Limite de Uso',
      type: 'number',
      description: 'Quantas vezes o cupom pode ser usado (0 = ilimitado)',
      initialValue: 0
    },
    {
      name: 'usageCount',
      title: 'Vezes Usado',
      type: 'number',
      description: 'Quantas vezes o cupom já foi usado',
      initialValue: 0,
      readOnly: true
    },
    {
      name: 'startDate',
      title: 'Data de Início',
      type: 'datetime',
      description: 'Quando o cupom fica ativo'
    },
    {
      name: 'endDate',
      title: 'Data de Expiração',
      type: 'datetime',
      description: 'Quando o cupom expira'
    },
    {
      name: 'isActive',
      title: 'Ativo',
      type: 'boolean',
      description: 'Se o cupom está ativo e pode ser usado',
      initialValue: true
    },
    {
      name: 'applicableCategories',
      title: 'Categorias Aplicáveis',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Categorias onde o cupom pode ser usado (vazio = todas)',
      options: {
        list: [
          { title: 'Vestuário', value: 'vestuario' },
          { title: 'Acessórios', value: 'acessorios' },
          { title: 'Suplementos', value: 'suplementos' },
          { title: 'Nutrição & Géis', value: 'nutricao' },
          { title: 'Pneus de Bike', value: 'bike_pneus' },
          { title: 'Acessórios de Bike', value: 'bike_acessorios' }
        ]
      }
    },
    {
      name: 'excludedProducts',
      title: 'Produtos Excluídos',
      type: 'array',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'product' }] 
      }],
      description: 'Produtos que NÃO podem usar este cupom'
    }
  ],
  preview: {
    select: {
      title: 'code',
      subtitle: 'title',
      discountType: 'discountType',
      discountValue: 'discountValue',
      isActive: 'isActive'
    },
    prepare(selection: any) {
      const { title, subtitle, discountType, discountValue, isActive } = selection;
      const discountDisplay = discountType === 'percentage' 
        ? `${discountValue}%` 
        : `R$ ${discountValue?.toFixed(2) || '0,00'}`;
      
      return {
        title: title,
        subtitle: `${subtitle} - ${discountDisplay} ${isActive ? '✅' : '❌'}`
      };
    }
  }
} 