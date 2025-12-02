#!/usr/bin/env node
/**
 * Script para migrar categorias dos produtos no Sanity
 * Converte das categorias antigas para as novas
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
  token: process.env.SANITY_TOKEN2, // Usa o token com permissões de editor
});

// Mapeamento das categorias antigas para as novas
const categoryMapping = {
  // Categorias antigas -> Novas categorias
  'acessorios': 'equipamento',           // Acessórios -> Equipamento
  'suplementos': 'suplementos',          // Suplementos -> Suplemento (mantém)
  'nutricao': 'suplementos',             // Nutrição & Géis -> Suplemento
  'bike_pneus': 'bikes',                 // Pneus de Bike -> Bikes
  'bike_acessorios': 'equipamento',      // Acessórios de Bike -> Equipamento
  'vestuario': 'vestuario',              // Vestuário -> Vestuário (mantém)
  
  // Caso não mapeado, vai para equipamento como padrão
  'default': 'equipamento'
};

class CategoryMigrator {
  constructor() {
    this.processedCount = 0;
    this.errorCount = 0;
    this.results = [];
  }

  async getAllProducts() {
    try {
      console.log('📱 Buscando todos os produtos...');
      
      const products = await client.fetch(
        `*[_type == "product"] {
          _id,
          title,
          category
        }`
      );
      
      console.log(`✅ ${products.length} produtos encontrados`);
      return products || [];
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return [];
    }
  }

  mapCategory(oldCategory) {
    const newCategory = categoryMapping[oldCategory] || categoryMapping.default;
    return newCategory;
  }

  async updateProductCategory(productId, oldCategory, newCategory) {
    try {
      await client
        .patch(productId)
        .set({ category: newCategory })
        .commit();
      
      return true;
    } catch (error) {
      console.error(`❌ Erro ao atualizar produto ${productId}:`, error);
      return false;
    }
  }

  async migrateAllCategories() {
    console.log('🚀 INICIANDO MIGRAÇÃO DE CATEGORIAS');
    console.log('=' * 50);

    // Verifica configuração
    console.log('🔧 Verificando configuração...');
    console.log(`📍 Project ID: ${client.config().projectId}`);
    console.log(`🗂️ Dataset: ${client.config().dataset}`);
    
    if (!client.config().token) {
      console.error('❌ Token do Sanity não configurado!');
      return;
    }

    // Busca todos os produtos
    const products = await this.getAllProducts();
    if (!products.length) {
      console.log('⚠️ Nenhum produto encontrado');
      return;
    }

    console.log(`\n📦 Processando ${products.length} produtos...\n`);

    // Processa cada produto
    for (const [index, product] of products.entries()) {
      console.log(`[${index + 1}/${products.length}] ${product.title}`);
      console.log(`   📂 Categoria atual: ${product.category}`);
      
      const newCategory = this.mapCategory(product.category);
      console.log(`   🔄 Nova categoria: ${newCategory}`);
      
      if (product.category === newCategory) {
        console.log(`   ✅ Categoria já correta, pulando...`);
        this.results.push({
          product: product.title,
          action: 'skipped',
          oldCategory: product.category,
          newCategory: newCategory
        });
      } else {
        const success = await this.updateProductCategory(product._id, product.category, newCategory);
        
        if (success) {
          console.log(`   ✅ Categoria atualizada!`);
          this.processedCount++;
          this.results.push({
            product: product.title,
            action: 'updated',
            oldCategory: product.category,
            newCategory: newCategory
          });
        } else {
          console.log(`   ❌ Falha na atualização`);
          this.errorCount++;
          this.results.push({
            product: product.title,
            action: 'error',
            oldCategory: product.category,
            newCategory: newCategory
          });
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA MIGRAÇÃO');
    console.log('='.repeat(60));
    
    const skipped = this.results.filter(r => r.action === 'skipped').length;
    
    console.log(`✅ Atualizados: ${this.processedCount}`);
    console.log(`⏭️ Pulados: ${skipped}`);
    console.log(`❌ Erros: ${this.errorCount}`);
    console.log(`📊 Total: ${this.results.length}`);

    if (this.processedCount > 0) {
      console.log('\n✅ Produtos atualizados:');
      this.results
        .filter(r => r.action === 'updated')
        .forEach(r => {
          console.log(`   • ${r.product}: ${r.oldCategory} → ${r.newCategory}`);
        });
    }

    if (this.errorCount > 0) {
      console.log('\n❌ Produtos com erro:');
      this.results
        .filter(r => r.action === 'error')
        .forEach(r => {
          console.log(`   • ${r.product}: ${r.oldCategory} → ${r.newCategory}`);
        });
    }

    console.log('\n🎯 Mapeamento usado:');
    Object.entries(categoryMapping).forEach(([old, new_]) => {
      if (old !== 'default') {
        console.log(`   • ${old} → ${new_}`);
      }
    });

    console.log('\n🎉 Migração concluída!');
    console.log('📝 Acesse o Sanity Studio para verificar as alterações.');
    console.log(`🌐 Studio URL: https://${client.config().projectId}.sanity.studio/`);
  }
}

// Executa o script
async function main() {
  const migrator = new CategoryMigrator();
  await migrator.migrateAllCategories();
}

if (require.main === module) {
  main().catch(console.error);
} 