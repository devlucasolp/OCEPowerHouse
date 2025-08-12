import type { NextApiRequest, NextApiResponse } from 'next';
import { CheckoutService } from '../../../services/checkout/checkout.service';
import { PaymentStatus } from '../../../services/mercadopago';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { payment_id, external_reference } = req.query;

    if (!payment_id && !external_reference) {
      return res.status(400).json({ 
        error: 'É necessário fornecer payment_id ou external_reference' 
      });
    }

    const checkoutService = new CheckoutService();
    let payments: PaymentStatus[] = [];

    if (payment_id) {
      // Busca por ID do pagamento
      try {
        const payment = await checkoutService.getPaymentStatus(payment_id as string);
        payments = [payment];
      } catch (error) {
        console.error('Erro ao buscar pagamento por ID:', error);
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }
    } else if (external_reference) {
      // Busca por referência externa
      try {
        payments = await checkoutService.getPaymentsByReference(external_reference as string);
        
        if (payments.length === 0) {
          return res.status(404).json({ error: 'Nenhum pagamento encontrado para esta referência' });
        }
      } catch (error) {
        console.error('Erro ao buscar pagamento por referência:', error);
        return res.status(500).json({ error: 'Erro ao buscar pagamento' });
      }
    }

    // Formata a resposta
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      external_reference: payment.external_reference,
      payment_method: payment.payment_method_id,
      amount: payment.transaction_amount,
      date_created: payment.date_created,
      date_approved: payment.date_approved,
      status_label: getStatusLabel(payment.status),
      status_color: getStatusColor(payment.status)
    }));

    console.log('🔍 Consulta de status realizada:', {
      query_type: payment_id ? 'payment_id' : 'external_reference',
      query_value: payment_id || external_reference,
      payments_found: formattedPayments.length
    });

    return res.status(200).json({
      payments: formattedPayments,
      total_found: formattedPayments.length
    });

  } catch (error: any) {
    console.error('❌ Erro na consulta de status:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Retorna um label amigável para o status do pagamento
 */
function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    'approved': 'Aprovado',
    'pending': 'Pendente',
    'rejected': 'Rejeitado',
    'cancelled': 'Cancelado',
    'in_process': 'Em Processamento',
    'authorized': 'Autorizado',
    'refunded': 'Reembolsado',
    'charged_back': 'Chargeback'
  };

  return statusLabels[status] || 'Status Desconhecido';
}

/**
 * Retorna uma cor para o status do pagamento (para UI)
 */
function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'approved': 'green',
    'pending': 'yellow',
    'rejected': 'red',
    'cancelled': 'gray',
    'in_process': 'blue',
    'authorized': 'blue',
    'refunded': 'orange',
    'charged_back': 'red'
  };

  return statusColors[status] || 'gray';
} 