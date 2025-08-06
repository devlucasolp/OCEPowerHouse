import { MercadoPagoConfig } from 'mercadopago';
import crypto from 'crypto';

const accessToken = process.env.MERCADO_PAGO_ACESS_TOKEN;
const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

if (!accessToken) {
  throw new Error('MERCADO_PAGO_ACESS_TOKEN is not defined');
}

const mpClient = new MercadoPagoConfig({ accessToken });

export function verifyMercadoPagoSignature(request: Request) {
  try {
    // Se não tivermos o segredo do webhook configurado, pulamos a verificação
    // Isso é útil para ambientes de desenvolvimento
    if (!webhookSecret) {
      console.warn('MERCADO_PAGO_WEBHOOK_SECRET não está definido. Pulando verificação de assinatura.');
      return true;
    }
    
    // Em produção, implementar a verificação de assinatura conforme documentação:
    // https://www.mercadopago.com.br/developers/pt/docs/checkout-api/webhooks/validate-signature
    
    // Exemplo de implementação (descomente e adapte quando tiver o segredo do webhook):
    /*
    const signature = request.headers.get('x-signature');
    if (!signature) {
      console.error('Assinatura do webhook não encontrada no cabeçalho');
      throw new Error('Assinatura do webhook não encontrada');
    }
    
    // Obter o corpo da requisição como string
    const bodyText = await request.text();
    
    // Criar o HMAC usando o segredo do webhook
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(bodyText);
    const calculatedSignature = hmac.digest('hex');
    
    // Comparar a assinatura calculada com a recebida
    if (calculatedSignature !== signature) {
      console.error('Assinatura do webhook inválida');
      throw new Error('Assinatura do webhook inválida');
    }
    */
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar assinatura do webhook:', error);
    return false;
  }
}

export default mpClient;
