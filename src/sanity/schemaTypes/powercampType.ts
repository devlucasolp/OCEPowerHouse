export default {
  name: 'powercamp',
  title: 'Powercamp',
  type: 'document',
  fields: [
    { name: 'title', title: 'Título', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'image', title: 'Imagem', type: 'image', options: { hotspot: true } },
    { name: 'date', title: 'Data do Evento', type: 'date' },
    { name: 'description', title: 'Descrição', type: 'text' },
    { name: 'year', title: 'Ano', type: 'number' },
  ],
};
