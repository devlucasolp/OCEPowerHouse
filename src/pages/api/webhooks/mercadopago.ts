import type { NextApiRequest, NextApiResponse } from 'next';
import { CheckoutService } from '../../../services/checkout/checkout.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { type, data, action } = req.body;
    
    console.log('🔔 Webhook recebido:', {
      type,
      action,
      data: data?.id,
      timestamp: new Date().toISOString()
    });

    // Verifica se é uma notificação de pagamento
    if (type === 'payment' && data?.id) {
      const paymentId = data.id;
      
      try {
        // Usa o serviço para buscar detalhes do pagamento
        const checkoutService = new CheckoutService();
        const payment = await checkoutService.getPaymentStatus(paymentId);
        
        console.log('💳 Detalhes do pagamento:', {
          id: payment.id,
          status: payment.status,
          status_detail: payment.status_detail,
          external_reference: payment.external_reference,
          payment_method: payment.payment_method_id,
          amount: payment.transaction_amount,
          date_created: payment.date_created,
          date_approved: payment.date_approved
        });

        // Processa o pagamento com base no status
        await processPaymentStatus(payment);

      } catch (error) {
        console.error('❌ Erro ao processar pagamento:', error);
        return res.status(500).json({ error: 'Erro ao processar pagamento' });
      }
    }

    // Responde OK para o Mercado Pago
    return res.status(200).json({ 
      message: 'Webhook processado com sucesso',
      received: true
    });

  } catch (error: any) {
    console.error('❌ Erro no webhook:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Processa o status do pagamento e executa ações necessárias
 */
async function processPaymentStatus(payment: any) {
  const { status, external_reference, id, transaction_amount } = payment;

  switch (status) {
    case 'approved':
      console.log('✅ Pagamento aprovado!', {
        payment_id: id,
        order_ref: external_reference,
        amount: transaction_amount
      });
      
      // TODO: Implementar ações para pagamento aprovado:
      // - Atualizar status do pedido no banco de dados
      // - Enviar email de confirmação
      // - Atualizar estoque
      // - Gerar nota fiscal
      // - Notificar sistemas integrados
      
      // Exemplo de implementação:
      // await updateOrderStatus(external_reference, 'paid');
      // await sendConfirmationEmail(external_reference);
      // await updateInventory(external_reference);
      
      break;
      
    case 'pending':
      console.log('⏳ Pagamento pendente', {
        payment_id: id,
        order_ref: external_reference,
        status_detail: payment.status_detail
      });
      
      // TODO: Implementar ações para pagamento pendente:
      // - Manter pedido como "aguardando pagamento"
      // - Enviar email informando sobre pendência
      
      break;
      
    case 'rejected':
      console.log('❌ Pagamento rejeitado', {
        payment_id: id,
        order_ref: external_reference,
        status_detail: payment.status_detail
      });
      
      // TODO: Implementar ações para pagamento rejeitado:
      // - Marcar pedido como "pagamento rejeitado"
      // - Enviar email informando sobre rejeição
      // - Liberar estoque (se aplicável)
      
      break;
      
    case 'cancelled':
      console.log('🚫 Pagamento cancelado', {
        payment_id: id,
        order_ref: external_reference
      });
      
      // TODO: Implementar ações para pagamento cancelado:
      // - Marcar pedido como cancelado
      // - Liberar estoque
      // - Enviar email de cancelamento
      
      break;
      
    default:
      console.log('❓ Status desconhecido:', {
        status,
        payment_id: id,
        order_ref: external_reference
      });
  }
} 