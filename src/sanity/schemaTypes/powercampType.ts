export default {
  name: 'powercamp',
  title: 'Powercamp',
  type: 'document',
  fields: [
    { 
      name: 'order', 
      title: 'Ordem de Exibição', 
      type: 'number',
      description: 'Número para controlar a ordem de exibição (menor número aparece primeiro)',
      validation: (Rule: any) => Rule.required().min(0)
    },
    { name: 'title', title: 'Título', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { 
      name: 'image', 
      title: 'Imagem', 
      type: 'image', 
      options: { 
        hotspot: true 
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
          description: 'Importante para SEO e acessibilidade.',
        }
      ]
    },
    { name: 'date', title: 'Data do Evento', type: 'date' },
    { 
      name: 'description', 
      title: 'Descrição', 
      type: 'blockContent',
      description: 'Descrição completa do evento com formatação rica (títulos, negrito, etc.)'
    },
    { name: 'year', title: 'Ano', type: 'number' },
    { name: 'featured', title: 'Destaque', type: 'boolean', description: 'Marcar como evento em destaque' },
    { name: 'location', title: 'Localização', type: 'text', description: 'Endereço completo do evento' },
    { name: 'registrationLink', title: 'Link de Inscrição', type: 'url', description: 'Link para formulário de inscrição' },
  ],
}