#!/usr/bin/env node
/**
 * Script para verificar e remover produtos duplicados na Sanity
 * Identifica duplicatas por título e oferece opção de limpeza
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

class DuplicatesCleaner {
  constructor() {
    this.products = [];
    this.duplicates = {};
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
          _updatedAt,
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

  findDuplicates() {
    console.log('🔍 PROCURANDO DUPLICATAS...');
    console.log('=' * 60);

    const titleGroups = {};
    
    // Agrupa produtos por título normalizado
    this.products.forEach(product => {
      const normalizedTitle = product.title.toLowerCase().trim();
      
      if (!titleGroups[normalizedTitle]) {
        titleGroups[normalizedTitle] = [];
      }
      titleGroups[normalizedTitle].push(product);
    });

    // Identifica grupos com mais de 1 produto (duplicatas)
    for (const [title, products] of Object.entries(titleGroups)) {
      if (products.length > 1) {
        this.duplicates[title] = products.sort((a, b) => 
          new Date(a._createdAt) - new Date(b._createdAt)
        );
      }
    }

    const duplicateCount = Object.keys(this.duplicates).length;
    const totalDuplicatedProducts = Object.values(this.duplicates)
      .reduce((sum, group) => sum + group.length, 0);

    console.log(`📊 RESULTADO DA BUSCA:`);
    console.log(`   • ${duplicateCount} produtos com duplicatas`);
    console.log(`   • ${totalDuplicatedProducts} produtos duplicados no total`);
    console.log(`   • ${this.products.length - totalDuplicatedProducts + duplicateCount} produtos únicos\n`);

    return duplicateCount > 0;
  }

  showDuplicates() {
    if (Object.keys(this.duplicates).length === 0) {
      console.log('✅ Nenhuma duplicata encontrada!');
      return;
    }

    console.log('📋 PRODUTOS DUPLICADOS ENCONTRADOS:');
    console.log('=' * 60);

    let index = 1;
    for (const [title, products] of Object.entries(this.duplicates)) {
      console.log(`\n${index}. "${products[0].title}" (${products.length} cópias):`);
      
      products.forEach((product, i) => {
        const date = new Date(product._createdAt).toLocaleString('pt-BR');
        const price = product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Sem preço';
        const image = product.hasImage ? '📷' : '❌';
        const isOldest = i === 0 ? '👑 MANTER' : '❌ REMOVER';
        
        console.log(`   ${isOldest} | ${image} ${price} | ${product.brand || 'Sem marca'} | ${date}`);
        console.log(`     ID: ${product._id}`);
      });
      
      index++;
    }
  }

  async removeDuplicates() {
    if (Object.keys(this.duplicates).length === 0) {
      console.log('✅ Nenhuma duplicata para remover!');
      return;
    }

    console.log('\n🗑️ REMOVENDO DUPLICATAS...');
    console.log('=' * 60);
    console.log('⚠️ Estratégia: Manter o produto MAIS ANTIGO, remover os demais\n');

    const results = {
      removed: [],
      failed: [],
      kept: []
    };

    for (const [title, products] of Object.entries(this.duplicates)) {
      const [keepProduct, ...removeProducts] = products;
      
      console.log(`\n📦 Processando: "${keepProduct.title}"`);
      console.log(`   👑 Mantendo: ${keepProduct._id} (${new Date(keepProduct._createdAt).toLocaleString('pt-BR')})`);
      
      results.kept.push(keepProduct);

      // Remove duplicatas (mantém apenas o mais antigo)
      for (const product of removeProducts) {
        try {
          console.log(`   ❌ Removendo: ${product._id} (${new Date(product._createdAt).toLocaleString('pt-BR')})`);
          
          await client.delete(product._id);
          results.removed.push(product);
          
          console.log(`   ✅ Removido com sucesso`);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`   ❌ Erro ao remover ${product._id}:`, error.message);
          results.failed.push(product);
        }
      }
    }

    this.printCleanupSummary(results);
  }

  printCleanupSummary(results) {
    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMO DA LIMPEZA DE DUPLICATAS');
    console.log('='.repeat(70));
    console.log(`✅ Produtos mantidos: ${results.kept.length}`);
    console.log(`🗑️ Produtos removidos: ${results.removed.length}`);
    console.log(`❌ Falhas na remoção: ${results.failed.length}`);
    
    if (results.removed.length > 0) {
      console.log('\n🗑️ Produtos removidos:');
      results.removed.forEach((product, index) => {
        const date = new Date(product._createdAt).toLocaleString('pt-BR');
        console.log(`   ${index + 1}. ${product.title} (${date})`);
      });
    }

    if (results.failed.length > 0) {
      console.log('\n❌ Falhas na remoção:');
      results.failed.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.title} (ID: ${product._id})`);
      });
    }

    const originalCount = this.products.length;
    const newCount = originalCount - results.removed.length;
    
    console.log(`\n📈 RESULTADO FINAL:`);
    console.log(`   • Produtos antes: ${originalCount}`);
    console.log(`   • Produtos depois: ${newCount}`);
    console.log(`   • Produtos removidos: ${results.removed.length}`);
    console.log(`   • Economia de espaço: ${((results.removed.length / originalCount) * 100).toFixed(1)}%`);
    
    console.log('\n🎯 Limpeza concluída!');
    console.log(`🌐 Acesse o Sanity Studio para verificar: https://${client.config().projectId}.sanity.studio/`);
    console.log('='.repeat(70));
  }

  async run() {
    console.log('🚀 VERIFICAÇÃO E LIMPEZA DE DUPLICATAS NA SANITY');
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

    const hasDuplicates = this.findDuplicates();
    
    if (!hasDuplicates) {
      console.log('✅ Nenhuma duplicata encontrada! Banco limpo.');
      return;
    }

    this.showDuplicates();
    
    console.log('\n⚠️ ATENÇÃO: Este script irá REMOVER produtos duplicados!');
    console.log('🔄 Estratégia: Manter o produto mais ANTIGO de cada grupo');
    console.log('📝 Confirme se deseja prosseguir...\n');
    
    // Auto-executa a limpeza (remova este comentário se quiser confirmação manual)
    await this.removeDuplicates();
  }
}

// Executa o script
async function main() {
  const cleaner = new DuplicatesCleaner();
  await cleaner.run();
}

if (require.main === module) {
  main().catch(console.error);
} 