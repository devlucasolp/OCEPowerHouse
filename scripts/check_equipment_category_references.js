/**
 * Script para verificar quais produtos estão referenciando a categoria de equipamentos
 * e identificar possíveis problemas com referências
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Configure o cliente Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN2, // Usando token com permissões de leitura
  apiVersion: '2023-05-03',
  useCdn: false
});

async function main() {
  try {
    console.log('🔍 Verificando referências à categoria de equipamentos...');
    
    // 1. Buscar a categoria de equipamentos
    const equipmentCategories = await client.fetch(`*[_type == "category" && slug.current == "equipamento"] {
      _id,
      _type,
      title,
      slug,
      _rev
    }`);
    
    if (equipmentCategories.length === 0) {
      console.log('❌ Categoria de equipamentos não encontrada!');
      return;
    }
    
    console.log('📋 Categoria de equipamentos encontrada:');
    equipmentCategories.forEach(cat => {
      console.log(`  - ID: ${cat._id}, Título: ${cat.title}, Slug: ${cat.slug.current}, Revisão: ${cat._rev}`);
      
      // Verificar se é um rascunho
      if (cat._id.startsWith('drafts.')) {
        console.log(`  ⚠️ ATENÇÃO: Esta categoria está como RASCUNHO!`);
      }
    });
    
    // 2. Buscar produtos que referenciam esta categoria
    const equipmentCategoryIds = equipmentCategories.map(cat => cat._id);
    
    for (const categoryId of equipmentCategoryIds) {
      console.log(`\n🔍 Buscando produtos que referenciam a categoria ID: ${categoryId}`);
      
      const products = await client.fetch(`*[_type == "product" && references("${categoryId}")] {
        _id,
        title,
        "categoryRef": category._ref
      }`);
      
      console.log(`📊 Encontrados ${products.length} produtos referenciando esta categoria`);
      
      if (products.length > 0) {
        console.log('\nPrimeiros 10 produtos:');
        products.slice(0, 10).forEach(product => {
          console.log(`  - ${product.title} (ID: ${product._id}, Ref: ${product.categoryRef})`);
        });
      }
    }
    
    // 3. Verificar se há documentos referenciando o ID específico mencionado no erro
    const errorDocumentId = 'drafts.TFq394igozlHjZYkEIuqg9';
    const referencingDocs = await client.fetch(`*[references("${errorDocumentId}")] {
      _id,
      _type,
      title
    }`);
    
    console.log(`\n🔍 Documentos referenciando o ID específico do erro (${errorDocumentId}):`);
    console.log(`📊 Encontrados ${referencingDocs.length} documentos`);
    
    if (referencingDocs.length > 0) {
      referencingDocs.forEach(doc => {
        console.log(`  - Tipo: ${doc._type}, Título: ${doc.title || 'Sem título'}, ID: ${doc._id}`);
      });
    }
    
    // 4. Verificar o documento específico mencionado no erro como referenciador
    const referencingDocId = '1341c249-4e42-4c81-96f8-5088029efa5c';
    try {
      const referencingDoc = await client.getDocument(referencingDocId);
      console.log(`\n📄 Documento que está referenciando (${referencingDocId}):`);
      console.log(`  - Tipo: ${referencingDoc._type}`);
      console.log(`  - Título: ${referencingDoc.title || 'Sem título'}`);
      console.log(`  - Campos:`, Object.keys(referencingDoc).filter(key => !key.startsWith('_')));
      
      // Se for um produto, verificar a categoria
      if (referencingDoc._type === 'product' && referencingDoc.category) {
        console.log(`  - Categoria referenciada: ${referencingDoc.category._ref}`);
      }
    } catch (err) {
      console.log(`❌ Erro ao buscar documento ${referencingDocId}: ${err.message}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

main();