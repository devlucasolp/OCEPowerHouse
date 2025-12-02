import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Categoria de Produto',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nome da Categoria',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(50)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Cor da Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'Amarelo', value: '#FCD34D'},
          {title: 'Azul', value: '#3B82F6'},
          {title: 'Verde', value: '#10B981'},
          {title: 'Roxo', value: '#8B5CF6'},
          {title: 'Rosa', value: '#EC4899'},
          {title: 'Laranja', value: '#F97316'},
          {title: 'Vermelho', value: '#EF4444'},
          {title: 'Cinza', value: '#6B7280'},
        ],
        layout: 'radio'
      },
      initialValue: '#FCD34D'
    }),
    defineField({
      name: 'icon',
      title: 'Ícone da Categoria',
      type: 'string',
      options: {
        list: [
          {title: '👕 Vestuário', value: 'shirt'},
          {title: '💊 Suplementos', value: 'pill'},
          {title: '⚙️ Equipamentos', value: 'gear'},
          {title: '🔧 Componentes', value: 'wrench'},
          {title: '🎒 Bolsas', value: 'bag'},
          {title: '🚴 Bikes', value: 'bike'},
          {title: '📚 Livros', value: 'book'},
          {title: '🏆 Outros', value: 'trophy'},
        ],
        layout: 'dropdown'
      },
      initialValue: 'gear'
    }),
    defineField({
      name: 'order',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem em que a categoria aparece no filtro (menor número = primeiro)',
      initialValue: 0
    }),
    defineField({
      name: 'isActive',
      title: 'Categoria Ativa',
      type: 'boolean',
      description: 'Desmarque para ocultar a categoria do site',
      initialValue: true
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      isActive: 'isActive'
    },
    prepare(selection) {
      const {title, subtitle, isActive} = selection
      return {
        title: `${title}${!isActive ? ' (Inativa)' : ''}`,
        subtitle: subtitle
      }
    }
  },
  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}]
    },
    {
      title: 'Nome A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}]
    }
  ]
})
