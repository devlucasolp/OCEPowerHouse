import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailService } from '../../../services/email/email.service';
import type { CartProduct } from '../../../lib/useCart';
import type { CustomerAddress } from '../../../lib/addressUtils';

export interface OrderConfirmationRequest {
  items: CartProduct[];
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument: string;
  customerDocumentType: 'cpf' | 'cnpj';
  customerAddress?: CustomerAddress | null;
  appliedCoupon?: {
    code: string;
    discountAmount: number;
  } | null;
  selectedShippingOption?: {
    id: string;
    name: string;
    price: number;
    deliveryTime: string;
    company: string;
  } | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const {
      items,
      subtotal,
      shippingCost,
      discountAmount = 0,
      total,
      deliveryType,
      customerName,
      customerEmail,
      customerPhone,        // ← ADICIONAR
      customerDocument,     // ← ADICIONAR  
      customerDocumentType, // ← ADICIONAR
      customerAddress,
      appliedCoupon,
      selectedShippingOption
    }: OrderConfirmationRequest = req.body;

    // Validações básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens inválidos ou carrinho vazio' });
    }

    if (!customerName?.trim() || !customerEmail?.trim()) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
    }

    if (deliveryType === 'delivery' && !customerAddress) {
      return res.status(400).json({ error: 'Endereço é obrigatório para entrega' });
    }

    // Gerar ID único para o pedido
    const orderId = `OCE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    console.log('📧 Enviando e-mail de confirmação de pedido:', {
      orderId,
      customerEmail,
      itemsCount: items.length,
      total,
      deliveryType
    });

    // Preparar dados do pedido para o e-mail
    const orderDetails = {
      orderId,
      customerEmail,
      customerName,
      customerPhone,
      customerDocument,
      customerDocumentType,
      items,
      subtotal,
      shippingCost,
      discountAmount,
      total,
      paymentStatus: 'pending',
      paymentMethod: 'Mercado Pago',
      shippingAddress: customerAddress ? {
        street: `${customerAddress.street}, ${customerAddress.number}`,
        neighborhood: customerAddress.neighborhood,
        city: customerAddress.city,
        state: customerAddress.state,
        zipCode: customerAddress.cep
      } : undefined,
      isPickup: deliveryType === 'pickup',
      selectedShippingOption: selectedShippingOption
    };

    // Instanciar serviço de e-mail
    const emailService = new EmailService();

    // Enviar e-mail de notificação para a equipe OCE
    await emailService.sendNewOrderNotificationToOCE(orderDetails);

    // Enviar e-mail de confirmação para o cliente
    await emailService.sendOrderConfirmation(orderDetails);

    console.log('✅ E-mails enviados com sucesso para OCE e cliente');

    return res.status(200).json({
      success: true,
      orderId,
      message: 'E-mail de confirmação enviado com sucesso'
    });

  } catch (error: any) {
    console.error('❌ Erro ao enviar e-mail de confirmação:', error);
    
    // Não falhar o processo por causa do e-mail
    return res.status(200).json({
      success: false,
      error: 'Erro ao enviar e-mail, mas pedido será processado',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}