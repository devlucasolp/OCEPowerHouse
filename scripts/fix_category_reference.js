/**
 * Script para corrigir a referência de categoria no produto problemático
 * que está referenciando uma versão draft da categoria de equipamentos
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Configure o cliente Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN2, // Usando token com permissões de escrita
  apiVersion: '2023-05-03',
  useCdn: false
});

async function main() {
  try {
    console.log('🔍 Iniciando correção de referência de categoria...');
    
    // 1. Buscar a categoria de equipamentos publicada (não draft)
    const equipmentCategories = await client.fetch(`*[_type == "category" && slug.current == "equipamento" && !(_id in path("drafts.**"))] {
      _id,
      title,
      slug
    }`);
    
    if (equipmentCategories.length === 0) {
      console.log('❌ Categoria de equipamentos publicada não encontrada!');
      return;
    }
    
    const publishedCategoryId = equipmentCategories[0]._id;
    console.log(`📋 Categoria de equipamentos publicada encontrada: ${publishedCategoryId}`);
    
    // 2. Buscar o produto problemático
    const productId = '1341c249-4e42-4c81-96f8-5088029efa5c';
    const product = await client.getDocument(productId);
    
    if (!product) {
      console.log(`❌ Produto com ID ${productId} não encontrado!`);
      return;
    }
    
    console.log(`📋 Produto encontrado: ${product.title}`);
    console.log(`  - Categoria atual: ${product.category?._ref || 'Nenhuma'}`);
    
    // 3. Atualizar a referência da categoria para a versão publicada
    const result = await client
      .patch(productId)
      .set({
        category: {
          _type: 'reference',
          _ref: publishedCategoryId
        }
      })
      .commit();
    
    console.log(`✅ Produto atualizado com sucesso!`);
    console.log(`  - Nova categoria: ${result.category._ref}`);
    
    // 4. Verificar se há outros produtos com o mesmo problema
    const draftCategoryId = 'drafts.TFq394igozlHjZYkEIuqg9';
    const otherProducts = await client.fetch(`*[_type == "product" && category._ref == "${draftCategoryId}"] {
      _id,
      title
    }`);
    
    if (otherProducts.length > 0) {
      console.log(`\n⚠️ Encontrados ${otherProducts.length} outros produtos com a mesma referência problemática:`);
      
      // 5. Corrigir todos os outros produtos
      for (const prod of otherProducts) {
        console.log(`  - Corrigindo: ${prod.title} (${prod._id})`);
        
        await client
          .patch(prod._id)
          .set({
            category: {
              _type: 'reference',
              _ref: publishedCategoryId
            }
          })
          .commit();
      }
      
      console.log(`✅ Todos os produtos foram corrigidos!`);
    } else {
      console.log(`\n✅ Não há outros produtos com o mesmo problema.`);
    }
    
    // 6. Tentar excluir o rascunho da categoria se não houver mais referências
    try {
      const checkRefs = await client.fetch(`*[references("${draftCategoryId}")] { _id }`);
      
      if (checkRefs.length === 0) {
        console.log(`\n🗑️ Tentando excluir o rascunho da categoria: ${draftCategoryId}`);
        await client.delete(draftCategoryId);
        console.log(`✅ Rascunho da categoria excluído com sucesso!`);
      } else {
        console.log(`\n⚠️ Ainda existem ${checkRefs.length} documentos referenciando o rascunho da categoria.`);
        console.log(`   Não é possível excluir o rascunho neste momento.`);
      }
    } catch (err) {
      console.log(`❌ Erro ao tentar excluir o rascunho da categoria: ${err.message}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

main();