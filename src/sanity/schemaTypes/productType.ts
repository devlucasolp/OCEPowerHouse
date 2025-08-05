import { defineType, defineField } from 'sanity';
import { TagIcon } from '@sanity/icons';

export const productType = defineType({
  name: 'product',
  title: 'Produto',
  type: 'document',
  icon: TagIcon,
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
      name: 'price',
      title: 'Preço',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Vestuário', value: 'vestuario' },
          { title: 'Acessórios', value: 'acessorios' },
          { title: 'Equipamentos', value: 'equipamentos' },
          { title: 'Suplementos', value: 'suplementos' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      validation: (Rule) => Rule.required().min(10),
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
      name: 'featured',
      title: 'Produto em Destaque',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'Em Estoque',
      type: 'boolean',
      initialValue: true,
    }),
    // Campo opcional para variantes (ex: sabor, cor, etc)
    defineField({
      name: 'variants',
      title: 'Variações',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Nome da Variação', validation: (Rule) => Rule.required() },
            { name: 'image', type: 'image', title: 'Imagem da Variação', options: { hotspot: true } },
            { name: 'price', type: 'number', title: 'Preço (opcional)' },
            { name: 'stock', type: 'number', title: 'Estoque (opcional)' },
          ]
        }
      ],
      description: 'Adicione variações como sabor, cor, etc. Deixe vazio se o produto não tiver variantes.'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      media: 'image',
    },
    prepare(selection) {
      const { title, price, media } = selection;
      return {
        title,
        subtitle: price ? `R$ ${price.toFixed(2)}` : 'Preço não definido',
        media,
      };
    },
  },
});

export default productType;
