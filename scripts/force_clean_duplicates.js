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

async function forceClearDuplicates() {
  try {
    console.log('🔍 BUSCA AGRESSIVA POR DUPLICATAS...\n');
    
    const products = await client.fetch(`*[_type == "product"] { 
      _id, 
      title, 
      _createdAt,
      brand,
      category,
      price 
    } | order(_createdAt asc)`);
    
    console.log(`📊 Total de produtos: ${products.length}`);
    
    // Agrupa por título exato (case-insensitive)
    const groups = {};
    products.forEach(product => {
      const key = product.title.toLowerCase().trim();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(product);
    });
    
    // Encontra grupos com duplicatas
    const duplicates = Object.entries(groups).filter(([title, products]) => products.length > 1);
    
    console.log(`❌ ${duplicates.length} grupos de produtos duplicados encontrados:`);
    
    if (duplicates.length === 0) {
      console.log('✅ Nenhuma duplicata encontrada!');
      return;
    }
    
    let totalRemoved = 0;
    
    for (const [title, products] of duplicates) {
      console.log(`\n📦 "${products[0].title}" (${products.length} cópias):`);
      
      // Ordena por data de criação (mais antigo primeiro)
      products.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
      
      // Mantém o primeiro (mais antigo), remove os outros
      const [keep, ...remove] = products;
      
      console.log(`   👑 MANTER: ${keep._id} (${new Date(keep._createdAt).toLocaleDateString('pt-BR')})`);
      
      for (const product of remove) {
        try {
          console.log(`   ❌ REMOVENDO: ${product._id} (${new Date(product._createdAt).toLocaleDateString('pt-BR')})`);
          
          await client.delete(product._id);
          totalRemoved++;
          
          console.log(`   ✅ Removido!`);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`   ❌ ERRO ao remover ${product._id}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎯 RESUMO DA LIMPEZA:`);
    console.log(`   • Produtos antes: ${products.length}`);
    console.log(`   • Produtos removidos: ${totalRemoved}`);
    console.log(`   • Produtos restantes: ${products.length - totalRemoved}`);
    console.log(`   • Grupos duplicados limpos: ${duplicates.length}`);
    
    console.log('\n✅ Limpeza concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

forceClearDuplicates(); 