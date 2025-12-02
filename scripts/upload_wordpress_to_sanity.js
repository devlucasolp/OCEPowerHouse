#!/usr/bin/env node
/**
 * Script para fazer upload de produtos WordPress para o Sanity
 * Lê os JSONs dos produtos WordPress e faz upload das imagens e produtos
 */

// Carrega variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configuração do cliente Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN2, // Usa o token com permissões de editor
});

class WordPressSanityUploader {
  constructor() {
    this.wpProductsDir = 'wp-products';
    this.imagesDir = 'public/img/products/wordpress';
    this.uploadedImages = new Map(); // Cache de imagens já enviadas
    this.latestFiles = this.findLatestFiles();
  }

  findLatestFiles() {
    /**
     * Encontra os arquivos mais recentes baseado no timestamp
     */
    try {
      const files = fs.readdirSync(this.wpProductsDir);
      
      // Procura o arquivo principal mais recente
      const mainFiles = files.filter(f => f.startsWith('produtos_wordpress_html_para_sanity_'));
      const mappingFiles = files.filter(f => f.startsWith('wordpress_image_mapping_'));
      
      if (!mainFiles.length || !mappingFiles.length) {
        throw new Error('Arquivos necessários não encontrados');
      }

      // Ordena por timestamp (mais recente primeiro)
      mainFiles.sort((a, b) => b.localeCompare(a));
      mappingFiles.sort((a, b) => b.localeCompare(a));

      const latest = {
        main: path.join(this.wpProductsDir, mainFiles[0]),
        mapping: path.join(this.wpProductsDir, mappingFiles[0])
      };

      console.log('📁 Arquivos encontrados:');
      console.log(`   • Produtos: ${latest.main}`);
      console.log(`   • Mapeamento: ${latest.mapping}`);

      return latest;
    } catch (error) {
      console.error('❌ Erro ao encontrar arquivos:', error.message);
      throw error;
    }
  }

  async loadFiles() {
    try {
      console.log('📁 Carregando arquivos...');
      
      // Carrega produtos
      const productsData = fs.readFileSync(this.latestFiles.main, 'utf8');
      this.products = JSON.parse(productsData);
      console.log(`✅ ${this.products.length} produtos WordPress carregados`);

      // Carrega mapeamento de imagens
      const mappingData = fs.readFileSync(this.latestFiles.mapping, 'utf8');
      this.imageMapping = JSON.parse(mappingData);
      console.log(`✅ ${Object.keys(this.imageMapping).length} mapeamentos de imagem carregados`);

      return true;
    } catch (error) {
      console.error('❌ Erro ao carregar arquivos:', error.message);
      return false;
    }
  }

  async uploadImage(imagePath, productTitle) {
    try {
      // Remove o prefixo "/img/products/" do caminho e adiciona o diretório local
      const relativePath = imagePath.replace('/img/products/', '');
      const fullPath = path.join('public/img/products', relativePath);
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ Arquivo de imagem não encontrado: ${fullPath}`);
        return null;
      }

      // Verifica se já foi enviada
      if (this.uploadedImages.has(fullPath)) {
        console.log(`♻️ Imagem já enviada: ${path.basename(fullPath)}`);
        return this.uploadedImages.get(fullPath);
      }

      console.log(`📤 Enviando imagem: ${path.basename(fullPath)}`);
      
      const imageBuffer = fs.readFileSync(fullPath);
      const asset = await client.assets.upload('image', imageBuffer, {
        filename: path.basename(fullPath),
        title: productTitle,
      });

      console.log(`✅ Imagem enviada: ${asset._id}`);
      
      // Cache da imagem enviada
      this.uploadedImages.set(fullPath, asset);
      
      return asset;
    } catch (error) {
      console.error(`❌ Erro ao enviar imagem ${imagePath}:`, error.message);
      return null;
    }
  }

  async createProduct(product) {
    try {
      console.log(`📦 Criando produto: ${product.title}`);

      // Prepara o documento do produto
      const productDoc = {
        _type: 'product',
        title: product.title,
        slug: product.slug,
        price: product.price,
        category: product.category,
        inStock: product.inStock,
        featured: product.featured,
        description: product.description,
        brand: product.brand || 'Power House Brasil',
      };

      // Adiciona imagem se disponível
      const imageMapping = this.imageMapping[product.title];
      if (imageMapping) {
        const asset = await this.uploadImage(imageMapping.local_path, product.title);
        if (asset) {
          productDoc.image = {
            _type: 'image',
            alt: product.title,
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          };
        }
      } else {
        console.warn(`⚠️ Sem imagem mapeada para: ${product.title}`);
      }

      // Adiciona variantes se existirem
      if (product.variants && product.variants.length > 0) {
        productDoc.variants = product.variants;
      }

      // Preserva metadados WordPress
      if (product._wordpress) {
        productDoc._wordpress = product._wordpress;
      }

      // Cria o produto no Sanity
      const createdProduct = await client.create(productDoc);
      console.log(`✅ Produto criado: ${createdProduct._id}`);
      
      return createdProduct;
    } catch (error) {
      console.error(`❌ Erro ao criar produto ${product.title}:`, error.message);
      return null;
    }
  }

  async uploadAllByCategory() {
    console.log('🚀 INICIANDO UPLOAD WORDPRESS PARA SANITY');
    console.log('=' * 50);

    // Verifica configuração
    console.log('🔧 Verificando configuração...');
    console.log(`📍 Project ID: ${client.config().projectId}`);
    console.log(`🗂️ Dataset: ${client.config().dataset}`);
    
    if (!client.config().token) {
      console.error('❌ Token do Sanity não configurado!');
      console.log('💡 Verifique se SANITY_TOKEN2 está no .env.local');
      return;
    }
    console.log(`🔑 Token configurado: ${client.config().token.substring(0, 10)}...`);

    // Carrega arquivos
    if (!await this.loadFiles()) {
      return;
    }

    const results = {
      success: [],
      failed: [],
      withoutImage: [],
      byCategory: {}
    };

    console.log(`\n📦 Processando ${this.products.length} produtos WordPress...\n`);

    // Organiza produtos por categoria
    const productsByCategory = {};
    this.products.forEach(product => {
      const category = product.category || 'equipamento';
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push(product);
    });

    // Processa por categoria
    for (const [category, categoryProducts] of Object.entries(productsByCategory)) {
      console.log(`\n📂 Processando categoria: ${category.toUpperCase()} (${categoryProducts.length} produtos)`);
      console.log('─'.repeat(60));

      results.byCategory[category] = {
        success: [],
        failed: []
      };

      for (const [index, product] of categoryProducts.entries()) {
        console.log(`\n[${index + 1}/${categoryProducts.length}] ${product.title}`);
        
        const createdProduct = await this.createProduct(product);
        
        if (createdProduct) {
          results.success.push(product.title);
          results.byCategory[category].success.push(product.title);
          
          // Verifica se tem imagem
          if (!this.imageMapping[product.title]) {
            results.withoutImage.push(product.title);
          }
        } else {
          results.failed.push(product.title);
          results.byCategory[category].failed.push(product.title);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`\n✅ Categoria ${category} concluída: ${results.byCategory[category].success.length} sucessos, ${results.byCategory[category].failed.length} falhas\n`);
    }

    this.printSummary(results);
  }

  printSummary(results) {
    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMO DO UPLOAD WORDPRESS → SANITY');
    console.log('='.repeat(70));
    console.log(`✅ Produtos criados: ${results.success.length}`);
    console.log(`❌ Falhas: ${results.failed.length}`);
    console.log(`⚠️ Sem imagem: ${results.withoutImage.length}`);
    console.log(`📷 Imagens enviadas: ${this.uploadedImages.size}`);

    // Estatísticas por categoria
    console.log('\n📂 Resultados por categoria:');
    for (const [category, stats] of Object.entries(results.byCategory)) {
      console.log(`   • ${category}: ${stats.success.length} sucessos, ${stats.failed.length} falhas`);
    }

    if (results.success.length > 0) {
      console.log('\n✅ Produtos criados com sucesso:');
      results.success.slice(0, 10).forEach(title => console.log(`   • ${title}`));
      
      if (results.success.length > 10) {
        console.log(`   ... e mais ${results.success.length - 10} produtos`);
      }
    }

    if (results.failed.length > 0) {
      console.log('\n❌ Produtos com falha:');
      results.failed.forEach(title => console.log(`   • ${title}`));
    }

    if (results.withoutImage.length > 0) {
      console.log('\n⚠️ Produtos sem imagem:');
      results.withoutImage.forEach(title => console.log(`   • ${title}`));
    }

    console.log('\n🎉 Upload concluído!');
    console.log('📝 Acesse o Sanity Studio para verificar os produtos WordPress.');
    console.log(`🌐 Studio URL: https://${client.config().projectId}.sanity.studio/`);
    console.log('\n💡 Dica: Os produtos WordPress têm prefixo "wp-" nas imagens para diferenciação.');
    console.log('='.repeat(70));
  }
}

// Executa o script
async function main() {
  const uploader = new WordPressSanityUploader();
  await uploader.uploadAllByCategory();
}

if (require.main === module) {
  main().catch(console.error);
} 