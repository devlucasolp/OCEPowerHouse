/**
 * Script para migrar categorias de produtos de string para referência
 * 
 * Este script busca todos os produtos no Sanity que têm categorias como string
 * e atualiza para usar referências às categorias correspondentes.
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Configure o cliente Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN2, // Usando SANITY_TOKEN2 que deve ter permissões de escrita
  apiVersion: '2023-05-03', // Use a versão da API que você está usando
  useCdn: false
});

// Mapeamento de nomes de categorias para slugs
const categoryNameToSlugMap = {
  'vestuário': 'vestuario',
  'suplemento': 'suplementos',
  'equipamento': 'equipamento',
  'equipamentos': 'equipamento',
  'componentes': 'componentes',
  'bolsas': 'bolsas',
  'bikes': 'bikes',
  'livro': 'livro',
  'livros': 'livro',
  'acessórios': 'equipamento',
  'acessorios': 'equipamento',
  'nutrição': 'suplementos',
  'nutricao': 'suplementos',
  'nutrição & géis': 'suplementos',
  'comestíveis': 'suplementos',
  'nutricao & geis': 'suplementos',
  'comestiveis': 'suplementos',
  'geis': 'suplementos',
  'ciclismo': 'bikes',
  'bike': 'bikes',
  'acessorios de bike': 'equipamento',
  'bike_acessorios': 'equipamento',
  'pneus': 'bikes',
  'pneus de bike': 'bikes',
  'bike_pneus': 'bikes',
};

async function migrateProductCategories() {
  try {
    console.log('🔄 Iniciando migração de categorias de produtos...');
    
    // 1. Buscar todas as categorias existentes
    const categories = await client.fetch(`*[_type == "category"] {
      _id,
      title,
      slug
    }`);
    
    console.log(`📋 Encontradas ${categories.length} categorias no Sanity`);
    
    // Criar um mapa de slug para ID da categoria
    const categorySlugToIdMap = {};
    categories.forEach(category => {
      const slug = category.slug.current;
      categorySlugToIdMap[slug] = category._id;
      console.log(`  - ${category.title} (${slug}): ${category._id}`);
    });
    
    // 2. Buscar produtos com categoria como string
    const allProducts = await client.fetch(`*[_type == "product"] {
      _id,
      title,
      category
    }`);
    
    // Filtrar produtos com categorias como strings no JavaScript
    const products = allProducts.filter(product => 
      typeof product.category === 'string' && product.category !== '');
    
    console.log(`\n🔍 Encontrados ${products.length} produtos com categoria como string`);
    
    // 3. Atualizar cada produto
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (const product of products) {
      try {
        const categoryName = product.category.toLowerCase().trim();
        let categorySlug = categoryNameToSlugMap[categoryName] || categoryName;
        
        // Verificar se temos um ID de categoria para este slug
        const categoryId = categorySlugToIdMap[categorySlug];
        
        if (!categoryId) {
          console.log(`⚠️ Não foi encontrada categoria para "${product.category}" (slug: ${categorySlug}) no produto "${product.title}". Pulando...`);
          skippedCount++;
          continue;
        }
        
        // Atualizar o produto com a referência à categoria
        await client
          .patch(product._id)
          .set({
            category: {
              _type: 'reference',
              _ref: categoryId
            }
          })
          .commit();
        
        console.log(`✅ Produto "${product.title}" atualizado: categoria "${product.category}" → referência para "${categorySlug}"`);
        successCount++;
      } catch (error) {
        console.error(`❌ Erro ao atualizar produto "${product.title}": ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('\n📊 Resumo da migração:');
    console.log(`  - Total de produtos processados: ${products.length}`);
    console.log(`  - Atualizados com sucesso: ${successCount}`);
    console.log(`  - Pulados (categoria não encontrada): ${skippedCount}`);
    console.log(`  - Erros: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar a migração
migrateProductCategories();