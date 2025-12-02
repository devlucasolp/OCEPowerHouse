#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN2,
});

async function detectSubtleDuplicates() {
  try {
    console.log('🔍 DETECTANDO DUPLICATAS SUTIS...\n');
    
    const products = await client.fetch(`*[_type == "product"] { 
      _id, 
      title, 
      _createdAt,
      brand,
      category,
      price,
      slug
    } | order(title asc)`);
    
    console.log(`📊 Total de produtos: ${products.length}\n`);
    
    // Vamos procurar por grupos de produtos similares
    const suspiciousPatterns = [
      'Óculos Scicon Aeroshade Kunken',
      'Óculos Scicon Vertec',
      'Pack de 2 Camaras',
      'Camera Ar Reinforced',
      'KIT REPARO',
      'Pneu Fusion 5',
      'Palatinose Gel'
    ];
    
    console.log('🔍 PROCURANDO PADRÕES SUSPEITOS:\n');
    
    for (const pattern of suspiciousPatterns) {
      const matches = products.filter(p => p.title.includes(pattern));
      
      if (matches.length > 1) {
        console.log(`🚨 POSSÍVEL DUPLICATA: "${pattern}" (${matches.length} produtos):`);
        
        matches.forEach((product, index) => {
          const date = new Date(product._createdAt).toLocaleDateString('pt-BR');
          const price = product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sem preço';
          
          console.log(`   ${index + 1}. "${product.title}"`);
          console.log(`      ID: ${product._id} | ${price} | ${date} | ${product.brand || 'Sem marca'}`);
        });
        console.log();
      }
    }
    
    // Agora vamos fazer uma análise mais detalhada por título exato
    console.log('🔍 ANÁLISE POR TÍTULO EXATO:\n');
    
    const titleGroups = {};
    products.forEach(product => {
      const title = product.title.trim();
      if (!titleGroups[title]) {
        titleGroups[title] = [];
      }
      titleGroups[title].push(product);
    });
    
    const exactDuplicates = Object.entries(titleGroups).filter(([title, products]) => products.length > 1);
    
    if (exactDuplicates.length > 0) {
      console.log(`❌ ${exactDuplicates.length} títulos com duplicatas exatas:\n`);
      
      exactDuplicates.forEach(([title, products], index) => {
        console.log(`${index + 1}. "${title}" (${products.length} cópias):`);
        
        products.forEach((product, i) => {
          const date = new Date(product._createdAt).toLocaleDateString('pt-BR');
          const price = product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sem preço';
          
          console.log(`   ${i + 1}. ID: ${product._id.substring(0, 12)} | ${price} | ${date}`);
        });
        console.log();
      });
    } else {
      console.log('✅ Nenhuma duplicata exata de título encontrada.\n');
    }
    
    // Análise por slug também
    console.log('🔍 ANÁLISE POR SLUG:\n');
    
    const slugGroups = {};
    products.forEach(product => {
      if (product.slug && product.slug.current) {
        const slug = product.slug.current;
        if (!slugGroups[slug]) {
          slugGroups[slug] = [];
        }
        slugGroups[slug].push(product);
      }
    });
    
    const slugDuplicates = Object.entries(slugGroups).filter(([slug, products]) => products.length > 1);
    
    if (slugDuplicates.length > 0) {
      console.log(`❌ ${slugDuplicates.length} slugs duplicados:\n`);
      
      slugDuplicates.forEach(([slug, products], index) => {
        console.log(`${index + 1}. Slug: "${slug}" (${products.length} produtos):`);
        
        products.forEach((product, i) => {
          console.log(`   ${i + 1}. "${product.title}" | ID: ${product._id.substring(0, 12)}`);
        });
        console.log();
      });
    } else {
      console.log('✅ Nenhum slug duplicado encontrado.\n');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

detectSubtleDuplicates(); 