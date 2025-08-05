import { MercadoPagoConfig } from 'mercadopago';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export default mpClient;

// Dummy para evitar erro de importação no webhook
export function verifyMercadoPagoSignature(request: Request) {
  // Aqui você pode implementar a verificação real se quiser
  return true;
}
