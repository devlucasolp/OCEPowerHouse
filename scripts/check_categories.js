const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function checkCategories() {
  try {
    console.log('🔍 Verificando categorias na Sanity...');
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
    
    const categories = await client.fetch('*[_type == "category"]');
    
    console.log(`\n📊 Categorias encontradas: ${categories.length}`);
    
    if (categories.length > 0) {
      console.log('\n📋 Lista de categorias:');
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.title} (slug: ${cat.slug?.current || 'sem slug'})`);
        console.log(`   - Cor: ${cat.color || 'não definida'}`);
        console.log(`   - Ícone: ${cat.icon || 'não definido'}`);
        console.log(`   - Ativa: ${cat.isActive !== false ? 'Sim' : 'Não'}`);
        console.log(`   - Ordem: ${cat.order || 0}`);
        console.log('');
      });
    } else {
      console.log('\n❌ Nenhuma categoria encontrada!');
      console.log('\n💡 Para criar categorias:');
      console.log('1. Acesse o Sanity Studio em: http://localhost:3333');
      console.log('2. Vá em "Categoria de Produto"');
      console.log('3. Clique em "Create" para adicionar novas categorias');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar categorias:', error.message);
    
    if (error.message.includes('projectId')) {
      console.log('\n💡 Verifique se as variáveis de ambiente estão configuradas:');
      console.log('- NEXT_PUBLIC_SANITY_PROJECT_ID');
      console.log('- NEXT_PUBLIC_SANITY_DATASET');
    }
  }
}

checkCategories();