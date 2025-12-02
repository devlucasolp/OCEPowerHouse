import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllProducts, sanityClient } from '../../lib/sanity';
import { projectId, dataset, apiVersion } from '../../sanity/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('🔍 Testando conexão com Sanity...');
    
    // Log das configurações
    const config = {
      projectId,
      dataset,
      apiVersion,
      hasToken: !!process.env.SANITY_TOKEN,
      envVars: {
        NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
        SANITY_TOKEN: !!process.env.SANITY_TOKEN
      }
    };
    
    console.log('📊 Configuração:', config);

    // Teste básico de conexão
    const testQuery = await sanityClient.fetch('*[_type == "product"][0...3]{_id, title, price}');
    console.log('✅ Teste básico:', testQuery);

    // Buscar todos os produtos
    const products = await getAllProducts();
    console.log('📦 Produtos encontrados:', products?.length || 0);

    res.status(200).json({
      success: true,
      config,
      testQuery,
      productsCount: products?.length || 0,
      products: products || []
    });

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    res.status(500).json({
      error: 'Erro ao conectar com Sanity',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
} 