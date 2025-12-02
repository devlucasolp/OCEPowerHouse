import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const coachType = defineType({
  name: 'coach',
  title: 'Coach',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Coach',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'role',
      title: 'Função/Título',
      type: 'string',
      description: 'Ex: Fundador & Coach World Class, Coach Especialista, etc.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Foto do Coach',
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
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'bio',
      title: 'Biografia Resumida',
      type: 'text',
      rows: 4,
      description: 'Biografia que aparece na página de listagem de coaches',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'cardsEstatisticas',
      title: 'Cards de Estatísticas (3 cards)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icone',
              title: 'Ícone',
              type: 'string',
              options: {
                list: [
                  {title: 'Calendário', value: 'calendar'},
                  {title: 'Troféu', value: 'trophy'},
                  {title: 'Usuários', value: 'users'},
                  {title: 'Medalha', value: 'medal'},
                  {title: 'Alvo', value: 'target'},
                  {title: 'Estrela', value: 'star'},
                  {title: 'Coração', value: 'heart'},
                  {title: 'Fogo', value: 'fire'},
                  {title: 'Raio', value: 'zap'},
                  {title: 'Bicicleta', value: 'bike'},
                  {title: 'Cronômetro', value: 'timer'},
                  {title: 'Bandeira', value: 'flag'}
                ],
                layout: 'dropdown'
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'numero',
              title: 'Número/Texto Principal',
              type: 'string',
              description: 'Ex: "3+", "200+", "1000+"',
              validation: Rule => Rule.required()
            },
            {
              name: 'subtexto',
              title: 'Subtexto',
              type: 'string',
              description: 'Ex: "Anos OCE", "Competições", "Atletas"',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'numero',
              subtitle: 'subtexto',
              icone: 'icone'
            },
            prepare(selection) {
              const {title, subtitle, icone} = selection
              return {
                title: `${title} - ${subtitle}`,
                subtitle: `Ícone: ${icone}`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.max(3).min(3).error('Deve ter exatamente 3 cards de estatísticas'),
      description: 'Adicione exatamente 3 cards de estatísticas que aparecerão no header do coach'
    }),
    defineField({
      name: 'badges',
      title: 'Badges/Conquistas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'titulo',
              title: 'Título do Badge',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'cor',
              title: 'Cor do Badge',
              type: 'string',
              options: {
                list: [
                  {title: 'Amarelo', value: 'yellow'},
                  {title: 'Azul', value: 'blue'},
                  {title: 'Verde', value: 'green'},
                  {title: 'Roxo', value: 'purple'},
                  {title: 'Rosa', value: 'pink'},
                  {title: 'Laranja', value: 'orange'},
                  {title: 'Vermelho', value: 'red'},
                  {title: 'Cinza', value: 'gray'},
                ],
                layout: 'dropdown'
              },
              initialValue: 'yellow'
            }
          ],
          preview: {
            select: {
              title: 'titulo',
              subtitle: 'cor'
            }
          }
        }
      ]
    }),
    defineField({
      name: 'secoesDinamicas',
      title: 'Seções Dinâmicas do Perfil',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'secaoTexto',
          title: 'Seção de Texto',
          fields: [
            {
              name: 'tipo',
              title: 'Tipo de Seção',
              type: 'string',
              options: {
                list: [
                  {title: 'Texto Normal', value: 'texto'},
                  {title: 'Lista de Tópicos', value: 'topicos'},
                  {title: 'Tópicos Divididos (2 colunas)', value: 'topicos-divididos'}
                ],
                layout: 'radio'
              },
              initialValue: 'texto',
              validation: Rule => Rule.required()
            },
            {
              name: 'titulo',
              title: 'Título da Seção',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'icone',
              title: 'Ícone da Seção',
              type: 'string',
              options: {
                list: [
                  {title: 'Livro Aberto', value: 'book-open'},
                  {title: 'Troféu', value: 'trophy'},
                  {title: 'Graduação', value: 'graduation-cap'},
                  {title: 'Certificado', value: 'award'},
                  {title: 'Estrela', value: 'star'},
                  {title: 'Alvo', value: 'target'},
                  {title: 'Coração', value: 'heart'},
                  {title: 'Usuários', value: 'users'},
                  {title: 'Bicicleta', value: 'bike'},
                  {title: 'Bandeira', value: 'flag'},
                  {title: 'Raio', value: 'zap'},
                  {title: 'Fogo', value: 'fire'}
                ],
                layout: 'dropdown'
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'bordaAmarela',
              title: 'Mostrar Borda Amarela à Esquerda',
              type: 'boolean',
              description: 'Adiciona uma borda amarela à esquerda da seção para destaque',
              initialValue: true
            },
            {
              name: 'conteudoTexto',
              title: 'Conteúdo (Texto)',
              type: 'array',
              of: [{type: 'block'}],
              hidden: ({parent}) => parent?.tipo !== 'texto',
              validation: Rule => Rule.custom((value, context) => {
                const parent = context.parent as any
                if (parent?.tipo === 'texto' && (!value || !Array.isArray(value) || value.length === 0)) {
                  return 'Conteúdo de texto é obrigatório para seções de texto'
                }
                return true
              })
            },
            {
              name: 'topicos',
              title: 'Lista de Tópicos',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'texto',
                      title: 'Texto do Tópico',
                      type: 'string',
                      validation: Rule => Rule.required()
                    }
                  ],
                  preview: {
                    select: {
                      title: 'texto'
                    }
                  }
                }
              ],
              hidden: ({parent}) => parent?.tipo === 'texto',
              validation: Rule => Rule.custom((value, context) => {
                const parent = context.parent as any
                if (parent?.tipo !== 'texto' && (!value || !Array.isArray(value) || value.length === 0)) {
                  return 'Lista de tópicos é obrigatória para seções de tópicos'
                }
                return true
              })
            },
            {
               name: 'tituloColuna1',
               title: 'Título da Primeira Coluna',
               type: 'string',
               hidden: ({parent}) => parent?.tipo !== 'topicos-divididos',
               description: 'Título que aparecerá acima da primeira coluna de tópicos'
             },
             {
               name: 'tituloColuna2',
               title: 'Título da Segunda Coluna',
               type: 'string',
               hidden: ({parent}) => parent?.tipo !== 'topicos-divididos',
               description: 'Título que aparecerá acima da segunda coluna de tópicos'
             },
             {
               name: 'topicosColuna2',
               title: 'Tópicos da Segunda Coluna',
               type: 'array',
               of: [
                 {
                   type: 'object',
                   fields: [
                     {
                       name: 'texto',
                       title: 'Texto do Tópico',
                       type: 'string',
                       validation: Rule => Rule.required()
                     }
                   ],
                   preview: {
                     select: {
                       title: 'texto'
                     }
                   }
                 }
               ],
               hidden: ({parent}) => parent?.tipo !== 'topicos-divididos',
               description: 'Tópicos que aparecerão na segunda coluna (lado direito)'
             }
          ],
          preview: {
            select: {
              title: 'titulo',
              tipo: 'tipo',
              icone: 'icone'
            },
            prepare(selection) {
              const {title, tipo, icone} = selection
              const tipoLabel = tipo === 'texto' ? 'Texto' : tipo === 'topicos' ? 'Tópicos' : 'Tópicos Divididos'
              return {
                title: title,
                subtitle: `${tipoLabel} - Ícone: ${icone}`
              }
            }
          }
        }
      ],
      description: 'Adicione seções personalizadas para o perfil do coach (formação, certificações, conquistas, etc.)'
    }),
    defineField({
      name: 'link',
      title: 'Link Personalizado',
      type: 'url',
      description: 'Link para onde o botão "Ver Perfil" deve levar (se não preenchido, usará a página do coach)'
    }),
    defineField({
      name: 'redesSociais',
      title: 'Redes Sociais',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url'
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url'
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url'
        }
      ]
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem em que o coach aparece na página (menor número = primeiro)',
      initialValue: 0
    }),
    defineField({
      name: 'ativo',
      title: 'Coach Ativo',
      type: 'boolean',
      description: 'Desmarque para ocultar o coach do site',
      initialValue: true
    }),
    defineField({
      name: 'destaque',
      title: 'Coach em Destaque',
      type: 'boolean',
      description: 'Marque para destacar este coach na página',
      initialValue: false
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
      ativo: 'ativo',
      destaque: 'destaque'
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
      title: 'Nome A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}]
    }
  ]
})