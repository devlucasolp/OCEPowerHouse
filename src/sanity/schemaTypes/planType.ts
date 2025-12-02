import {CreditCardIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const planType = defineType({
  name: 'plan',
  title: 'Plano',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome do Plano',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'nome',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'valor',
      title: 'Valor do Plano',
      type: 'string',
      description: 'Ex: R$ 297,00 ou R$ 497,00/mês',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'valorNumerico',
      title: 'Valor Numérico',
      type: 'number',
      description: 'Valor em reais para ordenação e comparação',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'coach',
      title: 'Coach Responsável',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição do Plano',
      type: 'text',
      rows: 3,
      description: 'Breve descrição do que o plano oferece'
    }),
    defineField({
      name: 'beneficios',
      title: 'Benefícios do Plano',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'texto',
              title: 'Texto do Benefício',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'icone',
              title: 'Ícone',
              type: 'string',
              options: {
                list: [
                  {title: '✅ Check Verde', value: 'check'},
                  {title: '⭐ Estrela', value: 'star'},
                  {title: '🎯 Alvo', value: 'target'},
                  {title: '💪 Força', value: 'muscle'},
                  {title: '🏆 Troféu', value: 'trophy'},
                  {title: '📚 Livro', value: 'book'},
                  {title: '🎥 Vídeo', value: 'video'},
                  {title: '👥 Grupo', value: 'group'},
                  {title: '📞 Suporte', value: 'support'},
                  {title: '⚡ Raio', value: 'lightning'},
                  {title: '🚲 Bike', value: 'bike'},
                  {title: '🛡️ Escudo', value: 'shield'},
                  {title: '👥 Time', value: 'team'},
                  {title: '📶 Sinal', value: 'signal'},
                  {title: '💬 Chat', value: 'chat'},
                  {title: '✉️ Carta', value: 'mail'},
                  {title: '❤️ Coração', value: 'heart'},
                  {title: '🏋️ Halter', value: 'dumbbell'},
                ],
                layout: 'dropdown'
              },
              initialValue: 'check'
            }
          ],
          preview: {
            select: {
              title: 'texto',
              subtitle: 'icone'
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'imagemPlano',
      title: 'Imagem do Plano',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo',
        }
      ]
    }),
    defineField({
      name: 'corDestaque',
      title: 'Cor de Destaque',
      type: 'string',
      options: {
        list: [
          {title: 'Amarelo OCE', value: '#FCD34D'},
          {title: 'Azul', value: '#3B82F6'},
          {title: 'Verde', value: '#10B981'},
          {title: 'Roxo', value: '#8B5CF6'},
          {title: 'Rosa', value: '#EC4899'},
          {title: 'Laranja', value: '#F97316'},
        ],
        layout: 'radio'
      },
      initialValue: '#FCD34D'
    }),
    defineField({
      name: 'planoDestaque',
      title: 'Plano em Destaque',
      type: 'boolean',
      description: 'Marque para destacar este plano na página',
      initialValue: false
    }),
    defineField({
      name: 'linkCompra',
      title: 'Link de Compra',
      type: 'url',
      description: 'URL para onde o botão "Quero Este Plano" deve levar'
    }),
    defineField({
      name: 'textoButton',
      title: 'Texto do Botão',
      type: 'string',
      initialValue: 'Quero Este Plano',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem em que o plano aparece na página (menor número = primeiro)',
      initialValue: 0
    }),
    defineField({
      name: 'ativo',
      title: 'Plano Ativo',
      type: 'boolean',
      description: 'Desmarque para ocultar o plano do site',
      initialValue: true
    }),
    defineField({
      name: 'mostrarTituloCoach',
      title: 'Mostrar Título "Coach"',
      type: 'boolean',
      description: 'Marque para mostrar o título "Coach" acima do nome do coach',
      initialValue: true
    }),
  ],
  preview: {
    select: {
      title: 'nome',
      subtitle: 'valor',
      media: 'imagemPlano',
      ativo: 'ativo',
      destaque: 'planoDestaque'
    },
    prepare(selection) {
      const {title, subtitle, media, ativo, destaque} = selection
      let displayTitle = title
      if (destaque) displayTitle += ' ⭐'
      if (!ativo) displayTitle += ' (Inativo)'
      
      return {
        title: displayTitle,
        subtitle: subtitle,
        media: media
      }
    }
  },
  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'ordemAsc',
      by: [{field: 'ordem', direction: 'asc'}]
    },
    {
      title: 'Valor (Menor para Maior)',
      name: 'valorAsc',
      by: [{field: 'valorNumerico', direction: 'asc'}]
    },
    {
      title: 'Valor (Maior para Menor)',
      name: 'valorDesc',
      by: [{field: 'valorNumerico', direction: 'desc'}]
    }
  ]
})