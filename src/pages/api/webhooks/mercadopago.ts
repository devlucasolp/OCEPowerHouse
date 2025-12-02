import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoService } from '../../../services/mercadopago/mercadopago.service';
import { EmailService, OrderDetails } from '../../../services/email/email.service';
import type { CartProduct } from '../../../lib/useCart';

interface WebhookPayload {
  type: string;
  data: {
    id: string;
  };
  action: string;
  id?: string;
  user_id?: string;
  live_mode?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // SEMPRE retornar 200 para evitar 502 - MercadoPago considera falha se não for 200
  const sendSuccessResponse = (message: string = 'ok', data: any = {}) => {
    return res.status(200).json({ status: 'success', message, ...data });
  };

  const sendErrorResponse = (message: string, error?: any) => {
    console.error('❌ Webhook error:', message, error);
    // IMPORTANTE: Sempre retornar 200 mesmo em caso de erro interno
    return res.status(200).json({ status: 'error', message });
  };

  try {
    // Validar método HTTP
    if (req.method !== 'POST') {
      return sendErrorResponse('Método não permitido - apenas POST aceito');
    }

    // Log detalhado para debugging
    console.log('🔔 Webhook MercadoPago recebido:', {
      method: req.method,
      headers: {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent'],
        'x-signature': req.headers['x-signature']
      },
      body: req.body,
      query: req.query,
      timestamp: new Date().toISOString()
    });

    // Validar payload
    if (!req.body || typeof req.body !== 'object') {
      return sendErrorResponse('Payload inválido ou vazio');
    }

    const payload: WebhookPayload = req.body;
    const { type, data, action, id: webhookId } = payload;
    
    // Validar campos obrigatórios
    if (!type || !data || !data.id) {
      return sendErrorResponse('Campos obrigatórios ausentes no payload');
    }

    console.log('📋 Processando webhook:', { type, action, dataId: data.id, webhookId });
    
    // Processar notificações de pagamento
    if (type === 'payment' && (action === 'payment.created' || action === 'payment.updated')) {
      await processPaymentNotification(data.id);
    } 
    // Processar notificações de merchant order
    else if (type === 'topic_merchant_order_wh' && action === 'update') {
      const merchantOrderId = webhookId || data.id;
      await processMerchantOrderNotification(merchantOrderId);
    } 
    // Log para tipos não processados
    else {
      console.log('ℹ️ Tipo de notificação não processado:', { type, action });
    }

    return sendSuccessResponse('Webhook processado com sucesso', {
      type,
      action,
      processed_at: new Date().toISOString()
    });

  } catch (error) {
    // Capturar qualquer erro não tratado
    return sendErrorResponse(
      'Erro interno no processamento do webhook',
      error instanceof Error ? error.message : 'Erro desconhecido'
    );
  }
}

/**
 * Processa notificações de pagamento de forma isolada
 */
async function processPaymentNotification(paymentId: string): Promise<void> {
  try {
    console.log('💳 Processando notificação de pagamento:', paymentId);
    
    const mercadoPagoService = new MercadoPagoService();
    const paymentDetails = await mercadoPagoService.getPayment(paymentId);
    
    console.log('📋 Detalhes do pagamento obtidos:', {
      id: paymentDetails.id,
      status: paymentDetails.status,
      amount: paymentDetails.transaction_amount
    });
    
    // Processar apenas pagamentos aprovados
    if (paymentDetails.status === 'approved') {
      await notifyTeamAboutPurchase(paymentDetails);
      console.log('✅ Pagamento aprovado processado:', paymentId);
    } else {
      console.log(`ℹ️ Pagamento ${paymentId} com status: ${paymentDetails.status} - não processado`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar notificação de pagamento:', paymentId, error);
    // NÃO relançar erro - webhook deve sempre retornar 200
  }
}

/**
 * Processa notificações de merchant order de forma isolada
 */
async function processMerchantOrderNotification(merchantOrderId: string): Promise<void> {
  try {
    console.log('🛒 Processando notificação de merchant order:', merchantOrderId);
    
    const mercadoPagoService = new MercadoPagoService();
    const merchantOrder = await mercadoPagoService.getMerchantOrder(merchantOrderId);
    
    console.log('📦 Detalhes da merchant order obtidos:', {
      id: merchantOrder.id,
      status: merchantOrder.status,
      payments_count: merchantOrder.payments?.length || 0
    });
    
    // Processar pagamentos da merchant order se estiver fechada
    if (merchantOrder.status === 'closed' && merchantOrder.payments?.length > 0) {
      for (const payment of merchantOrder.payments) {
        if (payment.status === 'approved') {
          try {
            const paymentDetails = await mercadoPagoService.getPayment(payment.id.toString());
            await notifyTeamAboutPurchase(paymentDetails);
            console.log('✅ Pagamento da merchant order processado:', payment.id);
          } catch (paymentError) {
            console.error('❌ Erro ao processar pagamento da merchant order:', payment.id, paymentError);
            // Continuar processando outros pagamentos
          }
        }
      }
    } else {
      console.log(`ℹ️ Merchant order ${merchantOrderId} não processada - status: ${merchantOrder.status}`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar notificação de merchant order:', merchantOrderId, error);
    // NÃO relançar erro - webhook deve sempre retornar 200
  }
}

/**
 * Notifica a equipe sobre nova compra aprovada
 */
async function notifyTeamAboutPurchase(paymentDetails: any) {
  try {
    console.log('🎉 Notificando equipe sobre compra aprovada:', paymentDetails.id);
    
    const orderDetails: OrderDetails = {
      orderId: paymentDetails.id,
      customerEmail: extractEmailFromPayment(paymentDetails),
      items: await extractItemsFromPayment(paymentDetails),
      subtotal: paymentDetails.transaction_amount,
      shippingCost: extractShippingCost(paymentDetails),
      total: paymentDetails.transaction_amount,
      paymentStatus: paymentDetails.status,
      paymentMethod: getPaymentMethodName(paymentDetails.payment_method_id),
    };
    
    // Enviar APENAS notificação para a equipe
    const emailService = new EmailService();
    await emailService.sendOrderNotificationToTeam(orderDetails);
    
    console.log('✅ Equipe notificada com sucesso sobre pedido:', paymentDetails.id);
    
  } catch (error) {
    console.error('❌ Erro ao notificar equipe:', error);
    // NÃO relançar o erro - webhook deve sempre retornar 200
    // O Mercado Pago tentará novamente se necessário
  }
}

/**
 * Extrai email do cliente dos dados do pagamento
 */
function extractEmailFromPayment(paymentDetails: any): string {
  return paymentDetails.payer?.email || 
         paymentDetails.additional_info?.payer?.email ||
         'cliente-nao-identificado@powerhousebrasil.com.br';
}

/**
 * Extrai custo de frete dos dados do pagamento
 */
function extractShippingCost(paymentDetails: any): number {
  // Buscar informações de frete nos metadados ou additional_info
  const shippingInfo = paymentDetails.additional_info?.shipments?.[0];
  return shippingInfo?.cost || 0;
}

/**
 * Extrai itens do pedido dos dados do pagamento
 */
async function extractItemsFromPayment(paymentDetails: any): Promise<CartProduct[]> {
  const items = paymentDetails.additional_info?.items || [];
  
  if (items.length === 0) {
    console.log('⚠️ Nenhum item encontrado em additional_info.items, usando fallback');
    // Fallback: criar item genérico com valor total
    return [{
      _id: 'unknown',
      title: 'Compra no site',
      price: paymentDetails.transaction_amount,
      quantity: 1,
      category: 'produto',
      description: `Pagamento ${paymentDetails.id}`,
      slug: 'compra-site',
    }];
  }
  
  return items.map((item: any) => ({
    _id: item.id || 'item-' + Math.random(),
    title: item.title || 'Produto',
    price: parseFloat(item.unit_price) || 0,
    quantity: parseInt(item.quantity) || 1,
    category: item.category_id || 'produto',
    description: item.description || '',
    slug: item.id || 'produto',
  }));
}

/**
 * Converte ID do método de pagamento para nome amigável
 */
function getPaymentMethodName(paymentMethodId: string): string {
  const methods: Record<string, string> = {
    'pix': 'PIX',
    'visa': 'Visa',
    'master': 'Mastercard',
    'elo': 'Elo',
    'bolbradesco': 'Boleto Bradesco',
    'pec': 'Boleto',
  };
  
  return methods[paymentMethodId] || paymentMethodId.toUpperCase();
}