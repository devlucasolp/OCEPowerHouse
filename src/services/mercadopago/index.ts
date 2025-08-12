// Serviço principal
export { MercadoPagoService } from './mercadopago.service';

// Tipos
export type { 
  MercadoPagoItem, 
  PaymentStatus, 
  PreferenceConfig, 
  ProcessedItem, 
  PreferenceResponse 
} from './types';

// Configuração
export { MercadoPagoConfig } from './config';

// Processadores
export { ItemProcessor } from './processors/item.processor';
export { ImageProcessor } from './processors/image.processor';

// Construtores
export { PreferenceBuilder } from './builders/preference.builder'; 