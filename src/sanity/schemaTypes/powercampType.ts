import { defineType, defineField } from 'sanity';
import { CalendarIcon } from '@sanity/icons';

export const powercampType = defineType({
  name: 'powercamp',
  title: 'Powercamp',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Data do Evento',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'blockContent',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'registrationLink',
      title: 'Link de Cadastro',
      type: 'url',
      description: 'Link para o formulário ou página de inscrição do Powercamp',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'year',
      title: 'Ano',
      type: 'number',
      validation: (Rule) => Rule.required().min(2020).max(2030),
    }),
    defineField({
      name: 'location',
      title: 'Local',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Evento em Destaque',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
    },
    prepare(selection) {
      const { title, date, media } = selection;
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString('pt-BR') : 'Data não definida',
        media,
      };
    },
  },
});

export default powercampType;
