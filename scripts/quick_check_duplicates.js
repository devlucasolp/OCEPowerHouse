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

async function quickCheck() {
  try {
    console.log('🔍 Verificação rápida de duplicatas...\n');
    
    const products = await client.fetch(`*[_type == "product"] { 
      _id, 
      title, 
      _createdAt,
      brand,
      category,
      price 
    }`);
    
    console.log(`📊 Total de produtos: ${products.length}`);
    
    // Verifica duplicatas por título
    const titleGroups = {};
    products.forEach(product => {
      const title = product.title.toLowerCase().trim();
      if (!titleGroups[title]) {
        titleGroups[title] = [];
      }
      titleGroups[title].push(product);
    });
    
    const duplicates = Object.entries(titleGroups).filter(([title, products]) => products.length > 1);
    
    console.log(`🔄 Produtos com duplicatas: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log('\n❌ DUPLICATAS ENCONTRADAS:');
      duplicates.forEach(([title, products], index) => {
        console.log(`\n${index + 1}. "${products[0].title}" (${products.length} cópias):`);
        products.forEach((product, i) => {
          const date = new Date(product._createdAt).toLocaleDateString('pt-BR');
          const price = product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sem preço';
          console.log(`   ${i + 1}. ${product._id.substring(0, 12)} | ${price} | ${date}`);
        });
      });
      
      const totalDuplicatedItems = duplicates.reduce((sum, [title, products]) => sum + products.length, 0);
      const itemsToRemove = totalDuplicatedItems - duplicates.length;
      
      console.log(`\n📈 ESTATÍSTICAS:`);
      console.log(`   • Total de itens duplicados: ${totalDuplicatedItems}`);
      console.log(`   • Itens a serem removidos: ${itemsToRemove}`);
      console.log(`   • Produtos únicos após limpeza: ${products.length - itemsToRemove}`);
      
    } else {
      console.log('\n✅ Nenhuma duplicata encontrada! Banco limpo.');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

quickCheck(); 