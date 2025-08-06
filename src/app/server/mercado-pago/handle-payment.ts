import 'server-only';

import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  try {
    console.log('Handling approved payment:', {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
      payment_method_id: paymentData.payment_method_id,
      payment_type_id: paymentData.payment_type_id,
      transaction_amount: paymentData.transaction_amount
    });
    
    // Extrair metadados do pagamento
    const metadata = paymentData.metadata || {};
    const userEmail = metadata.user_email || paymentData.payer?.email || paymentData.external_reference; 
    const testeId = metadata.teste_id;
    
    console.log('Payment metadata:', { userEmail, testeId });
    
    // Aqui você pode implementar ações como:
    // 1. Atualizar status do pedido no banco de dados
    // 2. Enviar email de confirmação para o cliente
    // 3. Liberar acesso a conteúdo digital
    // 4. Notificar sistemas internos sobre a venda
    
    // Exemplo de log para demonstrar o processamento
    console.log(`Pagamento processado com sucesso para o email: ${userEmail}`);
    console.log(`Valor da transação: ${paymentData.transaction_amount} ${paymentData.currency_id}`);
    console.log(`Método de pagamento: ${paymentData.payment_method_id} (${paymentData.payment_type_id})`);
    
    return true;
  } catch (error) {
    console.error('Erro ao processar pagamento aprovado:', error);
    throw error;
  }
}
