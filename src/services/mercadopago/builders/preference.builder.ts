import { MercadoPagoConfig } from '../config';
import { PreferenceConfig } from '../types';

export class PreferenceBuilder {
  private readonly config: MercadoPagoConfig;

  constructor(config: MercadoPagoConfig) {
    this.config = config;
  }

  /**
   * Constrói uma preferência completa para o Mercado Pago
   */
  buildPreference(params: PreferenceConfig) {
    const { items, baseUrl, isTest } = params;

    console.log('🔧 PreferenceBuilder - Parâmetros recebidos:', {
      baseUrl,
      items_count: items.length,
      isTest
    });

    // Valida URL base
    if (!this.config.isValidBaseUrl(baseUrl)) {
      console.error('❌ URL base inválida:', baseUrl);
      throw new Error(`URL base inválida: ${baseUrl}`);
    }

    // Calcula total
    const totalAmount = this.calculateTotal(items);
    if (totalAmount <= 0) {
      throw new Error('Valor total inválido');
    }

    // Gera referência única
    const externalReference = this.config.generateExternalReference();

    // Configurações base
    const defaultConfig = this.config.getDefaultPreferenceConfig(baseUrl);
    
    console.log('🔧 Configurações padrão geradas:', {
      back_urls: defaultConfig.back_urls,
      auto_return: defaultConfig.auto_return,
      baseUrl
    });

    // Valida se back_urls estão corretas
    if (!defaultConfig.back_urls || !defaultConfig.back_urls.success) {
      console.error('❌ back_urls.success não definida:', defaultConfig.back_urls);
      throw new Error('Configuração de back_urls inválida');
    }

    // Monta preferência final com back_urls PRIMEIRO
    const preference = {
      back_urls: defaultConfig.back_urls,
      auto_return: defaultConfig.auto_return,
      items,
      external_reference: externalReference,
      payment_methods: defaultConfig.payment_methods,
      shipments: defaultConfig.shipments,
      payer: defaultConfig.payer,
      statement_descriptor: defaultConfig.statement_descriptor,
      binary_mode: defaultConfig.binary_mode,
      expires: defaultConfig.expires,
      notification_url: defaultConfig.notification_url
    };

    // Validação final
    if (!this.validatePreference(preference)) {
      console.error('❌ Preferência inválida:', preference);
      throw new Error('Preferência construída é inválida');
    }

    // Log para debugging
    console.log('🚀 Preferência construída com sucesso:', {
      total: totalAmount,
      items_count: items.length,
      external_reference: externalReference,
      is_test: isTest,
      base_url: baseUrl,
      back_urls_success: preference.back_urls.success
    });

    console.log('🔧 Preferência completa:', JSON.stringify(preference, null, 2));

    return preference;
  }

  /**
   * Calcula o total dos itens
   */
  private calculateTotal(items: any[]): number {
    const total = items.reduce((total, item) => {
      const itemPrice = Number(item.unit_price) || 0;
      const itemQuantity = Math.max(0, Math.floor(Number(item.quantity) || 1));
      return total + (itemPrice * itemQuantity);
    }, 0);
    
    // Arredondamento consistente para evitar problemas de precisão
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }

  /**
   * Valida estrutura da preferência
   */
  validatePreference(preference: any): boolean {
    const isValid = !!(
      preference.items &&
      Array.isArray(preference.items) &&
      preference.items.length > 0 &&
      preference.external_reference &&
      preference.back_urls &&
      preference.back_urls.success &&
      preference.back_urls.failure &&
      preference.back_urls.pending &&
      preference.auto_return
    );

    if (!isValid) {
      console.error('❌ Validação da preferência falhou:', {
        has_items: !!preference.items,
        items_is_array: Array.isArray(preference.items),
        items_length: preference.items?.length,
        has_external_reference: !!preference.external_reference,
        has_back_urls: !!preference.back_urls,
        has_success_url: !!preference.back_urls?.success,
        has_failure_url: !!preference.back_urls?.failure,
        has_pending_url: !!preference.back_urls?.pending,
        has_auto_return: !!preference.auto_return
      });
    }

    return isValid;
  }
} 