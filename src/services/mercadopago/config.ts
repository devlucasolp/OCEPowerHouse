export class MercadoPagoConfig {
  readonly projectId: string;
  readonly dataset: string;

  constructor() {
    this.projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1sbzjovr";
    this.dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  }

  /**
   * Retorna configurações padrão para uma preferência
   */
  getDefaultPreferenceConfig(baseUrl: string) {
    return {
      back_urls: {
        success: `${baseUrl}/checkout/success`,
        failure: `${baseUrl}/checkout/failure`,
        pending: `${baseUrl}/checkout/pending`
      },
      auto_return: 'approved' as const,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      shipments: {
        cost: 0,
        mode: 'not_specified' as const
      },
      payer: {
        name: 'Cliente PowerHouse',
        email: 'cliente@powerhouse.com.br'
      },
      statement_descriptor: 'POWERHOUSE BRASIL',
      binary_mode: false,
      expires: false,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`
    };
  }

  /**
   * Gera uma referência externa única
   */
  generateExternalReference(prefix: string = 'powerhouse'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Retorna URLs base válidas
   */
  getBaseUrl(requestOrigin?: string): string {
    return process.env.NEXT_PUBLIC_BASE_URL || requestOrigin || 'http://localhost:3000';
  }

  /**
   * Valida se uma URL base é válida
   */
  isValidBaseUrl(url: string): boolean {
    return !!(url && (url.startsWith('http://') || url.startsWith('https://')));
  }
} 