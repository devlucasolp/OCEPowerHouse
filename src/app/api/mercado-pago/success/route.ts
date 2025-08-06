import { NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import mpClient from '@/app/lib/mercado-pago';
import { handleMercadoPagoPayment } from '@/app/server/mercado-pago/handle-payment';

export async function GET(request: Request) {
  try {
    console.log('Mercado Pago success payment callback received');
    
    // Rota para lidar com pagamentos aprovados do Mercado Pago
    const { searchParams } = new URL(request.url);
    console.log('Success params:', Object.fromEntries(searchParams.entries()));
    
    // Pegamos o ID do pagamento no Mercado Pago
    const paymentId = searchParams.get('payment_id');
    // Pegamos o ID do pagamento do nosso sistema
    const externalReference = searchParams.get('external_reference');
    // Status do pagamento (deve ser 'approved')
    const status = searchParams.get('status');
    
    console.log(`Success callback: ID=${paymentId}, Reference=${externalReference}, Status=${status}`);

    if (!paymentId) {
      console.error('Missing payment_id in success callback URL');
      return NextResponse.redirect(new URL(`/?status=erro&message=pagamento-invalido`, request.url));
    }

    try {
      console.log(`Fetching payment data for ID: ${paymentId}`);
      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: paymentId });
      
      console.log('Payment data received:', {
        id: paymentData.id,
        status: paymentData.status,
        date_approved: paymentData.date_approved,
        payment_method: paymentData.payment_method_id,
        external_reference: paymentData.external_reference
      });
      
      if (paymentData.status === 'approved' || paymentData.date_approved !== null) {
        // Pagamento aprovado. Processamos e redirecionamos para a página de sucesso
        console.log('Payment is approved, processing...');
        await handleMercadoPagoPayment(paymentData);
        return NextResponse.redirect(new URL(`/?status=sucesso&payment_id=${paymentId}`, request.url));
      } else {
        // Status inesperado para uma rota de sucesso
        console.log(`Unexpected payment status in success route: ${paymentData.status}`);
        return NextResponse.redirect(new URL(`/?status=${paymentData.status}&payment_id=${paymentId}`, request.url));
      }
    } catch (paymentError) {
      console.error('Error fetching payment data in success route:', paymentError);
      return NextResponse.redirect(new URL(`/?status=erro&message=erro-ao-verificar-pagamento`, request.url));
    }
  } catch (error) {
    console.error('Error in success payment handler:', error);
    return NextResponse.redirect(new URL(`/?status=erro&message=erro-interno`, request.url));
  }
}