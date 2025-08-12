// Serviços principais
export { CheckoutService } from './checkout/checkout.service';
export type { CheckoutRequest, CheckoutResponse } from './checkout/checkout.service';

// Serviços do Mercado Pago
export { 
  MercadoPagoService,
  MercadoPagoConfig,
  ItemProcessor,
  ImageProcessor,
  PreferenceBuilder 
} from './mercadopago';

export type { 
  MercadoPagoItem, 
  PaymentStatus, 
  PreferenceConfig, 
  ProcessedItem, 
  PreferenceResponse 
} from './mercadopago'; 