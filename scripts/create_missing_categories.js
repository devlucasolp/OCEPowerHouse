const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN2
});

// Categorias que precisam ser criadas baseadas nos produtos existentes
const categoriesToCreate = [
  {
    title: 'Equipamentos',
    slug: 'equipamento',
    description: 'Equipamentos e acessórios para ciclismo',
    color: '#3B82F6', // Azul
    icon: '🛠️',
    order: 1,
    isActive: true
  },
  {
    title: 'Componentes',
    slug: 'componentes',
    description: 'Componentes e peças para bicicletas',
    color: '#EF4444', // Vermelho
    icon: '⚙️',
    order: 2,
    isActive: true
  },
  {
    title: 'Vestuário',
    slug: 'vestuario',
    description: 'Roupas e vestuário para ciclismo',
    color: '#10B981', // Verde
    icon: '👕',
    order: 3,
    isActive: true
  },
  {
    title: 'Suplementos',
    slug: 'suplementos',
    description: 'Suplementos e nutrição esportiva',
    color: '#F59E0B', // Amarelo
    icon: '💊',
    order: 4,
    isActive: true
  },
  {
    title: 'Bolsas',
    slug: 'bolsas',
    description: 'Bolsas e mochilas para ciclismo',
    color: '#8B5CF6', // Roxo
    icon: '🎒',
    order: 5,
    isActive: true
  },
  {
    title: 'Livros',
    slug: 'livro',
    description: 'Livros e materiais educativos',
    color: '#6B7280', // Cinza
    icon: '📚',
    order: 6,
    isActive: true
  }
];

async function createCategories() {
  try {
    console.log('🏷️ Criando categorias no Sanity...');
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
    
    if (!process.env.SANITY_TOKEN) {
      console.error('❌ Token do Sanity não configurado!');
      console.log('💡 Configure a variável SANITY_TOKEN no arquivo .env.local');
      return;
    }

    // Verifica categorias existentes
    const existingCategories = await client.fetch('*[_type == "category"]');
    console.log(`\n📊 Categorias existentes: ${existingCategories.length}`);
    
    const existingSlugs = existingCategories.map(cat => cat.slug?.current).filter(Boolean);
    console.log('Slugs existentes:', existingSlugs);

    let created = 0;
    let skipped = 0;

    for (const category of categoriesToCreate) {
      if (existingSlugs.includes(category.slug)) {
        console.log(`⏭️ Categoria "${category.title}" já existe, pulando...`);
        skipped++;
        continue;
      }

      console.log(`\n🔄 Criando categoria: ${category.title}`);
      
      const doc = {
        _type: 'category',
        title: category.title,
        slug: {
          _type: 'slug',
          current: category.slug
        },
        description: category.description,
        color: category.color,
        icon: category.icon,
        order: category.order,
        isActive: category.isActive
      };

      try {
        const result = await client.create(doc);
        console.log(`✅ Categoria "${category.title}" criada com sucesso!`);
        console.log(`   ID: ${result._id}`);
        created++;
      } catch (error) {
        console.error(`❌ Erro ao criar categoria "${category.title}":`, error.message);
      }
    }

    console.log(`\n🎉 RESUMO:`);
    console.log(`✅ Categorias criadas: ${created}`);
    console.log(`⏭️ Categorias puladas: ${skipped}`);
    console.log(`📊 Total de categorias: ${created + skipped}`);
    
    if (created > 0) {
      console.log('\n🌐 Acesse o Sanity Studio para ver as novas categorias:');
      console.log(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio/`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar categorias:', error.message);
    
    if (error.message.includes('projectId')) {
      console.log('\n💡 Verifique se as variáveis de ambiente estão configuradas:');
      console.log('- NEXT_PUBLIC_SANITY_PROJECT_ID');
      console.log('- NEXT_PUBLIC_SANITY_DATASET');
      console.log('- SANITY_TOKEN');
    }
  }
}

createCategories();