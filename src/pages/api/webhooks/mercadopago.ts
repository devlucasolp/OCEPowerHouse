import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('🔔 Webhook MercadoPago recebido:', {
      headers: req.headers,
      body: req.body,
      query: req.query
    });

    // Verificar se é uma notificação válida
    const { type, data, action } = req.body;
    
    if (type === 'payment') {
      console.log('💳 Notificação de pagamento:', {
        payment_id: data?.id,
        action: action
      });
      
      // Aqui você pode processar a notificação do pagamento
      // Por exemplo: atualizar status do pedido no banco de dados
      
    } else if (type === 'merchant_order') {
      console.log('📦 Notificação de pedido:', {
        merchant_order_id: data?.id,
        action: action
      });
      
      // Processar notificação de pedido
      
    } else {
      console.log('ℹ️ Tipo de notificação não reconhecido:', type);
    }

    // Responder com 200 para confirmar recebimento
    return res.status(200).json({ status: 'ok' });

  } catch (error) {
    console.error('❌ Erro no webhook MercadoPago:', error);
    
    // Ainda assim retornar 200 para evitar reenvios desnecessários
    return res.status(200).json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
} 