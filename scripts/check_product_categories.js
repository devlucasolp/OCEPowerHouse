/**
 * Script para verificar produtos com categorias como string
 * 
 * Este script busca todos os produtos no Sanity que têm categorias como string
 * e lista quais categorias precisam ser criadas.
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Configure o cliente Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN, // Precisa de um token com permissões de leitura
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

async function checkProductCategories() {
  try {
    console.log('🔍 Verificando produtos com categorias como string...');
    
    // 1. Buscar todas as categorias existentes
    const categories = await client.fetch(`*[_type == "category"] {
      _id,
      title,
      slug
    }`);
    
    console.log(`📋 Encontradas ${categories.length} categorias no Sanity:`);
    categories.forEach(category => {
      console.log(`  - ${category.title} (${category.slug.current})`);
    });
    
    // Criar um conjunto de slugs de categorias existentes
    const existingCategorySlugs = new Set();
    categories.forEach(category => {
      existingCategorySlugs.add(category.slug.current);
    });
    
    // 2. Buscar produtos com categoria como string
    const allProducts = await client.fetch(`*[_type == "product"] {
      _id,
      title,
      category
    }`);
    
    // Filtrar produtos com categorias como strings no JavaScript
    const products = allProducts.filter(product => 
      typeof product.category === 'string' && product.category !== ''
    );
    
    console.log(`\n🔍 Encontrados ${products.length} produtos com categoria como string`);
    
    // 3. Analisar categorias necessárias
    const categoryCounts = {};
    const missingCategories = new Set();
    
    for (const product of products) {
      const categoryName = product.category.toLowerCase().trim();
      
      // Contar ocorrências de cada categoria
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      
      // Verificar se a categoria mapeada existe
      const categorySlug = categoryNameToSlugMap[categoryName] || categoryName;
      if (!existingCategorySlugs.has(categorySlug)) {
        missingCategories.add(categoryName);
      }
    }
    
    // 4. Exibir resultados
    console.log('\n📊 Distribuição de categorias (string):');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        const mappedSlug = categoryNameToSlugMap[category] || category;
        const exists = existingCategorySlugs.has(mappedSlug);
        console.log(`  - "${category}" → ${mappedSlug} (${count} produtos) ${exists ? '✅' : '❌'}`);
      });
    
    console.log('\n⚠️ Categorias que precisam ser criadas:');
    if (missingCategories.size === 0) {
      console.log('  Todas as categorias já existem no Sanity!');
    } else {
      Array.from(missingCategories).forEach(category => {
        const mappedSlug = categoryNameToSlugMap[category] || category;
        console.log(`  - "${category}" → ${mappedSlug}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

// Executar a verificação
checkProductCategories();