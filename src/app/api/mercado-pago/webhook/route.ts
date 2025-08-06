// app/api/mercado-pago/webhook/route.ts

import { NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import mpClient, { verifyMercadoPagoSignature } from '@/app/lib/mercado-pago';
import { handleMercadoPagoPayment } from '@/app/server/mercado-pago/handle-payment';

export async function POST(request: Request) {
  try {
    console.log('Webhook received from MercadoPago');
    verifyMercadoPagoSignature(request);

    const body = await request.json();
    console.log('Webhook body:', JSON.stringify(body, null, 2));

    const { type, data } = body;
    
    if (!type || !data) {
      console.error('Invalid webhook payload:', body);
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }
    
    console.log(`Processing webhook of type: ${type}, data:`, data);

    switch (type) {
      case 'payment':
        try {
          console.log(`Fetching payment data for ID: ${data.id}`);
          const payment = new Payment(mpClient);
          const paymentData = await payment.get({ id: data.id });
          
          console.log('Payment data received:', {
            id: paymentData.id,
            status: paymentData.status,
            date_approved: paymentData.date_approved,
            payment_method: paymentData.payment_method_id,
            external_reference: paymentData.external_reference
          });
          
          if (
            paymentData.status === 'approved' || // Pagamento por cartão OU
            paymentData.date_approved !== null // Pagamento por Pix
          ) {
            console.log('Payment approved, processing...');
            await handleMercadoPagoPayment(paymentData);
            console.log('Payment processed successfully');
          } else {
            console.log(`Payment not approved. Status: ${paymentData.status}`);
          }
        } catch (paymentError) {
          console.error('Error processing payment webhook:', paymentError);
        }
        break;
        
      case 'merchant_order':
        console.log('Merchant order event received:', data);
        break;
        
      default:
        console.log('Unhandled event type:', type);
    }

    // Sempre retornar 200 para o MercadoPago, mesmo se houver erros internos
    // Isso evita que o MercadoPago continue tentando reenviar o webhook
    return NextResponse.json({ received: true, success: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    // Mesmo com erro, retornamos 200 para o MercadoPago
    // para evitar tentativas repetidas de envio
    return NextResponse.json(
      { received: true, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 200 }
    );
  }
}
