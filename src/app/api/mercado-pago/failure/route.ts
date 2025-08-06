import { NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import mpClient from '@/app/lib/mercado-pago';

export async function GET(request: Request) {
  try {
    console.log('Mercado Pago failure payment callback received');
    
    // Rota para lidar com pagamentos rejeitados do Mercado Pago
    const { searchParams } = new URL(request.url);
    console.log('Failure params:', Object.fromEntries(searchParams.entries()));
    
    // Pegamos o ID do pagamento no Mercado Pago
    const paymentId = searchParams.get('payment_id');
    // Pegamos o ID do pagamento do nosso sistema
    const externalReference = searchParams.get('external_reference');
    // Status do pagamento (deve ser 'rejected' ou similar)
    const status = searchParams.get('status');
    // Código de erro (se disponível)
    const errorCode = searchParams.get('error') || searchParams.get('error_code');
    
    console.log(`Failure callback: ID=${paymentId}, Reference=${externalReference}, Status=${status}, Error=${errorCode}`);

    // Mesmo sem payment_id, redirecionamos para a página de falha
    if (!paymentId) {
      console.error('Missing payment_id in failure callback URL');
      return NextResponse.redirect(new URL(`/?status=falha&message=pagamento-rejeitado`, request.url));
    }

    try {
      // Se temos um ID de pagamento, tentamos obter mais informações
      console.log(`Fetching payment data for ID: ${paymentId}`);
      const payment = new Payment(mpClient);
      const paymentData = await payment.get({ id: paymentId });
      
      console.log('Payment data received:', {
        id: paymentData.id,
        status: paymentData.status,
        payment_method: paymentData.payment_method_id,
        external_reference: paymentData.external_reference
      });
      
      // Redirecionamos para a página inicial com informações sobre a falha
      return NextResponse.redirect(new URL(`/?status=falha&reason=${paymentData.status}&payment_id=${paymentId}`, request.url));
    } catch (paymentError) {
      console.error('Error fetching payment data in failure route:', paymentError);
      // Mesmo com erro ao buscar dados, redirecionamos para a página de falha
      return NextResponse.redirect(new URL(`/?status=falha&message=pagamento-rejeitado`, request.url));
    }
  } catch (error) {
    console.error('Error in failure payment handler:', error);
    return NextResponse.redirect(new URL(`/?status=erro&message=erro-interno`, request.url));
  }
}