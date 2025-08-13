import type { NextApiRequest, NextApiResponse } from 'next';
import { getCouponByCode, getAllCoupons } from '../../lib/sanity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Listar todos os cupons
      const allCoupons = await getAllCoupons();
      
      return res.status(200).json({
        success: true,
        coupons: allCoupons,
        count: allCoupons.length
      });
    }
    
    if (req.method === 'POST') {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Código do cupom é obrigatório' });
      }
      
      // Buscar cupom específico
      const coupon = await getCouponByCode(code);
      
      if (!coupon) {
        return res.status(404).json({ error: 'Cupom não encontrado' });
      }
      
      return res.status(200).json({
        success: true,
        coupon: coupon
      });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
    
  } catch (error) {
    console.error('❌ Erro no teste de cupom:', error);
    
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
} 