import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllProductsAlternative } from '../../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const products = await getAllProductsAlternative();
    return res.status(200).json({ products });
  } catch (error: any) {
    console.error('❌ [/api/products/all] Erro ao buscar produtos:', error?.message || error);
    return res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}