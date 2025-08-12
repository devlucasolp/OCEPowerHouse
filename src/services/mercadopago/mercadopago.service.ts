import { PaymentStatus, MercadoPagoItem } from './types';
import { MercadoPagoConfig } from './config';
import { ItemProcessor } from './processors/item.processor';
import { PreferenceBuilder } from './builders/preference.builder';

export class MercadoPagoService {
  private readonly accessToken: string;
  private readonly config: MercadoPagoConfig;
  private readonly itemProcessor: ItemProcessor;
  private readonly preferenceBuilder: PreferenceBuilder;

  constructor() {
    this.accessToken = this.getAccessToken();
    this.config = new MercadoPagoConfig();
    this.itemProcessor = new ItemProcessor();
    this.preferenceBuilder = new PreferenceBuilder(this.config);
  }

  private getAccessToken(): string {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!token) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado');
    }
    return token;
  }

  /**
   * Cria uma preferência de pagamento no Mercado Pago
   */
  async createPreference(cartItems: any[], baseUrl: string) {
    try {
      console.log('🔧 MercadoPagoService - Iniciando createPreference');
      
      // Processa e valida os itens
      const processedItems = this.itemProcessor.processCartItems(cartItems);
      
      // Constrói a preferência
      const preference = this.preferenceBuilder.buildPreference({
        items: processedItems,
        baseUrl,
        isTest: this.isTestEnvironment()
      });

      // Envia para o Mercado Pago
      const response = await this.sendToMercadoPago(preference);
      
      // Retorna resposta com external_reference preservado
      return {
        ...response,
        external_reference: preference.external_reference
      };
      
    } catch (error) {
      console.error('❌ Erro em createPreference:', error);
      throw error;
    }
  }

  /**
   * Busca informações de um pagamento pelo ID
   */
  async getPayment(paymentId: string): Promise<PaymentStatus> {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar pagamento: ${response.status}`);
    }

    const payment = await response.json();
    
    return {
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      external_reference: payment.external_reference,
      payment_method_id: payment.payment_method_id,
      transaction_amount: payment.transaction_amount,
      date_created: payment.date_created,
      date_approved: payment.date_approved
    };
  }

  /**
   * Busca informações de um pagamento pela referência externa
   */
  async getPaymentByExternalReference(externalReference: string): Promise<PaymentStatus[]> {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${externalReference}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar pagamento: ${response.status}`);
    }

    const result = await response.json();
    
    return result.results.map((payment: any) => ({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      external_reference: payment.external_reference,
      payment_method_id: payment.payment_method_id,
      transaction_amount: payment.transaction_amount,
      date_created: payment.date_created,
      date_approved: payment.date_approved
    }));
  }

  /**
   * Envia preferência para a API do Mercado Pago
   */
  private async sendToMercadoPago(preference: any) {
    console.log('🚀 Enviando preferência para Mercado Pago...');
    
    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Idempotency-Key': preference.external_reference
        },
        body: JSON.stringify(preference)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erro do Mercado Pago:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Trata erros específicos do Mercado Pago
        if (errorData.message && errorData.message.includes('back_urls')) {
          throw new Error(`Erro nas URLs de retorno: ${errorData.message}`);
        }
        
        throw new Error(`Erro do Mercado Pago (${response.status}): ${errorData.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      
      console.log('✅ Preferência criada no Mercado Pago:', {
        id: data.id,
        init_point: data.init_point ? 'presente' : 'ausente',
        sandbox_init_point: data.sandbox_init_point ? 'presente' : 'ausente'
      });
      
      return data;
      
    } catch (error) {
      console.error('❌ Erro na requisição para Mercado Pago:', error);
      throw error;
    }
  }

  /**
   * Verifica se estamos em ambiente de teste
   */
  isTestEnvironment(): boolean {
    return this.accessToken.startsWith('TEST-');
  }
} 