#!/usr/bin/env node
/**
 * Script para verificar produtos na Sanity via CLI
 * Lista todos os produtos e verifica se os 36 produtos corretos foram enviados
 */

// Carrega variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

// Configuração do cliente Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN2,
});

class SanityProductChecker {
  constructor() {
    this.products = [];
  }

  async getAllProducts() {
    try {
      console.log('🔍 Buscando todos os produtos na Sanity...');
      
      const products = await client.fetch(
        `*[_type == "product"] {
          _id,
          title,
          slug,
          category,
          price,
          inStock,
          featured,
          brand,
          _createdAt,
          "hasImage": defined(image),
          "imageId": image.asset._ref
        } | order(_createdAt desc)`
      );
      
      console.log(`✅ ${products.length} produtos encontrados na Sanity\n`);
      this.products = products;
      
      return products;
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return [];
    }
  }

  async checkProductsByCategory() {
    console.log('📂 PRODUTOS POR CATEGORIA:');
    console.log('=' * 60);

    const categories = {};
    this.products.forEach(product => {
      const cat = product.category || 'sem-categoria';
      if (!categories[cat]) {
        categories[cat] = [];
      }
      categories[cat].push(product);
    });

    for (const [category, products] of Object.entries(categories)) {
      console.log(`\n📁 ${category.toUpperCase()} (${products.length} produtos):`);
      console.log('─'.repeat(50));
      
      products.forEach((product, index) => {
        const price = product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sem preço';
        const image = product.hasImage ? '📷' : '❌';
        const brand = product.brand || 'Sem marca';
        const num = (index + 1).toString().padStart(2, ' ');
        
        console.log(`${num}. ${product.title} (${brand})`);
        console.log(`    ${image} ${price} | ID: ${product._id.substring(0, 8)}...`);
      });
    }
  }

  async checkRecentProducts() {
    console.log('\n🕐 PRODUTOS MAIS RECENTES (últimos 20):');
    console.log('=' * 60);

    const recentProducts = this.products.slice(0, 20);
    
    recentProducts.forEach((product, index) => {
      const price = product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sem preço';
      const image = product.hasImage ? '📷' : '❌';
      const brand = product.brand || 'Sem marca';
      const date = new Date(product._createdAt).toLocaleString('pt-BR');
      const num = (index + 1).toString().padStart(2, ' ');
      
      console.log(`${num}. ${product.title}`);
      console.log(`    ${image} ${price} | ${brand} | ${date}`);
    });
  }

  async checkWordPressProducts() {
    console.log('\n🔍 VERIFICANDO PRODUTOS WORDPRESS (Power House Brasil):');
    console.log('=' * 60);

    const wpProducts = this.products.filter(p => 
      p.brand === 'Power House Brasil' || 
      p.title.includes('Scicon') || 
      p.title.includes('Look') || 
      p.title.includes('Hutchinson')
    );

    console.log(`📊 ${wpProducts.length} produtos WordPress encontrados:`);
    
    if (wpProducts.length > 0) {
      wpProducts.forEach((product, index) => {
        const price = product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sem preço';
        const image = product.hasImage ? '📷' : '❌';
        const num = (index + 1).toString().padStart(2, ' ');
        
        console.log(`${num}. ${product.title}`);
        console.log(`    ${image} ${price} | ${product.category} | ${product.brand || 'Sem marca'}`);
      });
    } else {
      console.log('❌ Nenhum produto WordPress encontrado');
    }

    return wpProducts;
  }

  async checkUploadStatus() {
    console.log('\n📊 RESUMO GERAL:');
    console.log('=' * 60);

    const totalProducts = this.products.length;
    const withImages = this.products.filter(p => p.hasImage).length;
    const withoutImages = totalProducts - withImages;
    
    console.log(`📦 Total de produtos: ${totalProducts}`);
    console.log(`📷 Com imagem: ${withImages}`);
    console.log(`❌ Sem imagem: ${withoutImages}`);
    
    // Verifica se temos pelo menos os 36 produtos esperados
    const wpProducts = await this.checkWordPressProducts();
    
    if (wpProducts.length >= 36) {
      console.log(`\n✅ SUCCESS: ${wpProducts.length} produtos WordPress encontrados (≥ 36 esperados)`);
    } else {
      console.log(`\n⚠️ ATENÇÃO: Apenas ${wpProducts.length} produtos WordPress encontrados (< 36 esperados)`);
    }

    // Estatísticas por categoria
    const categories = {};
    this.products.forEach(product => {
      const cat = product.category || 'sem-categoria';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    console.log('\n📂 Estatísticas por categoria:');
    for (const [cat, count] of Object.entries(categories)) {
      console.log(`   • ${cat}: ${count} produtos`);
    }
  }

  async run() {
    console.log('🚀 VERIFICAÇÃO DE PRODUTOS NA SANITY VIA CLI');
    console.log('=' * 60);
    console.log(`📍 Project ID: ${client.config().projectId}`);
    console.log(`🗂️ Dataset: ${client.config().dataset}`);
    
    if (!client.config().token) {
      console.error('❌ Token do Sanity não configurado!');
      return;
    }
    console.log(`🔑 Token configurado: ${client.config().token.substring(0, 10)}...\n`);

    await this.getAllProducts();
    
    if (this.products.length === 0) {
      console.log('❌ Nenhum produto encontrado na Sanity');
      return;
    }

    await this.checkProductsByCategory();
    await this.checkRecentProducts();
    await this.checkUploadStatus();

    console.log('\n🎯 Verificação concluída!');
    console.log(`🌐 Acesse o Sanity Studio: https://${client.config().projectId}.sanity.studio/`);
  }
}

// Executa o script
async function main() {
  const checker = new SanityProductChecker();
  await checker.run();
}

if (require.main === module) {
  main().catch(console.error);
} 