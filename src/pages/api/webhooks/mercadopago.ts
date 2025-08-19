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
    const { type, data, action, id, user_id, live_mode } = req.body;
    
    if (type === 'payment') {
      console.log('💳 Notificação de pagamento:', {
        payment_id: data?.id,
        action: action,
        live_mode: live_mode
      });
      
      // Aqui você pode processar a notificação do pagamento
      // Por exemplo: atualizar status do pedido no banco de dados
      
    } else if (type === 'merchant_order') {
      console.log('📦 Notificação de pedido (merchant_order):', {
        merchant_order_id: data?.id,
        action: action,
        live_mode: live_mode
      });
      
      // Processar notificação de pedido
      
    } else if (type === 'topic_merchant_order_wh') {
      console.log('📦 Notificação de pedido comercial (topic_merchant_order_wh):', {
        resource_id: id,
        action: action,
        user_id: user_id,
        live_mode: live_mode,
        data: data
      });
      
      // Processar notificação de pedido comercial
      // Este é o tipo que está sendo enviado pelo Mercado Pago
      
    } else {
      console.log('ℹ️ Tipo de notificação não reconhecido:', {
        type: type,
        action: action,
        id: id,
        live_mode: live_mode
      });
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