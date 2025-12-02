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
      // back_urls são adicionadas automaticamente pelo PreferenceBuilder
      auto_return: 'approved' as const,
      payment_methods: {
        installments: 12,
        // Não excluir nenhum tipo de pagamento - permite crédito, débito e PIX
        excluded_payment_types: [],
        // Não excluir nenhum método específico - permite todas as bandeiras e PIX
        excluded_payment_methods: [],
        // Configurações adicionais para garantir compatibilidade
        default_payment_method_id: null, // Deixar null para mostrar todas as opções
        default_installments: null
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
  getBaseUrl = (requestOrigin?: string) => {
    // Em produção, usar a URL do domínio
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_BASE_URL || 'https://powerhousebrasil.com.br';
    }
    // Em desenvolvimento, usar domínio também ou requestOrigin
    return process.env.NEXT_PUBLIC_BASE_URL || requestOrigin || 'https://powerhousebrasil.com.br';
  };

  /**
   * Valida se uma URL base é válida
   */
  isValidBaseUrl(url: string): boolean {
    return !!(url && (url.startsWith('http://') || url.startsWith('https://')));
  }
}