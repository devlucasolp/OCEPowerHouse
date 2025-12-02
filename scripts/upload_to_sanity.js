#!/usr/bin/env node
/**
 * Script para fazer upload de produtos e imagens para o Sanity
 * Lê o JSON dos produtos e o mapeamento de imagens, faz upload das imagens primeiro
 * e depois cria os produtos com as referências corretas das imagens
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
  token: process.env.SANITY_TOKEN2, // Usa o token 2 que tem permissões de editor
});

class SanityUploader {
  constructor() {
    this.productsFile = 'Produtos_Alquimia_FINAL_para_Sanity.json';
    this.mappingFile = 'product_image_mapping.json';
    this.imagesDir = 'public/img/products';
    this.uploadedImages = new Map(); // Cache de imagens já enviadas
  }

  async loadFiles() {
    try {
      console.log('📁 Carregando arquivos...');
      
      // Carrega produtos
      const productsData = fs.readFileSync(this.productsFile, 'utf8');
      this.products = JSON.parse(productsData);
      console.log(`✅ ${this.products.length} produtos carregados`);

      // Carrega mapeamento de imagens
      const mappingData = fs.readFileSync(this.mappingFile, 'utf8');
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
      const fullPath = path.join(this.imagesDir, imagePath.replace('/img/products/', ''));
      
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
        brand: product.brand || 'Alquimia da Saúde',
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

      // Cria o produto no Sanity
      const createdProduct = await client.create(productDoc);
      console.log(`✅ Produto criado: ${createdProduct._id}`);
      
      return createdProduct;
    } catch (error) {
      console.error(`❌ Erro ao criar produto ${product.title}:`, error.message);
      return null;
    }
  }

  async uploadAll() {
    console.log('🚀 INICIANDO UPLOAD PARA SANITY');
    console.log('=' * 50);

    // Verifica configuração
    console.log('🔧 Verificando configuração...');
    console.log(`📍 Project ID: ${client.config().projectId}`);
    console.log(`🗂️ Dataset: ${client.config().dataset}`);
    
    if (!client.config().token) {
      console.error('❌ Token do Sanity não configurado!');
      console.log('💡 Verifique se SANITY_TOKEN está no .env.local');
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
    };

    console.log(`\n📦 Processando ${this.products.length} produtos...\n`);

    // Processa cada produto
    for (const [index, product] of this.products.entries()) {
      console.log(`\n[${index + 1}/${this.products.length}] ${product.title}`);
      
      const createdProduct = await this.createProduct(product);
      
      if (createdProduct) {
        results.success.push(product.title);
        
        // Verifica se tem imagem
        if (!this.imageMapping[product.title]) {
          results.withoutImage.push(product.title);
        }
      } else {
        results.failed.push(product.title);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.printSummary(results);
  }

  printSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DO UPLOAD');
    console.log('='.repeat(60));
    console.log(`✅ Produtos criados: ${results.success.length}`);
    console.log(`❌ Falhas: ${results.failed.length}`);
    console.log(`⚠️ Sem imagem: ${results.withoutImage.length}`);
    console.log(`📷 Imagens enviadas: ${this.uploadedImages.size}`);

    if (results.success.length > 0) {
      console.log('\n✅ Produtos criados com sucesso:');
      results.success.forEach(title => console.log(`   • ${title}`));
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
    console.log('📝 Acesse o Sanity Studio para verificar os produtos criados.');
    console.log(`🌐 Studio URL: https://${client.config().projectId}.sanity.studio/`);
  }
}

// Executa o script
async function main() {
  const uploader = new SanityUploader();
  await uploader.uploadAll();
}

if (require.main === module) {
  main().catch(console.error);
} 