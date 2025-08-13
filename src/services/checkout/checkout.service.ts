import { MercadoPagoService } from '../mercadopago';

export interface CheckoutRequest {
  items: any[];
  origin?: string;
}

export interface CheckoutResponse {
  url: string;
  id: string;
  sandbox_init_point?: string;
  external_reference: string;
  total: number;
  is_test: boolean;
}

export class CheckoutService {
  private readonly mercadoPagoService: MercadoPagoService;

  constructor() {
    this.mercadoPagoService = new MercadoPagoService();
  }

  /**
   * Processa um checkout completo
   */
  async processCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    const { items, origin } = request;

    console.log('🚀 CheckoutService - Iniciando processamento:', {
      items_count: items.length,
      origin,
      env_base_url: process.env.NEXT_PUBLIC_BASE_URL
    });

    // Validações iniciais
    this.validateCheckoutRequest(items);

    // Determina URL base com validação extra
    const baseUrl = this.getAndValidateBaseUrl(origin);
    
    console.log('✅ URL base validada:', baseUrl);

    // Cria preferência no Mercado Pago
    const mpResponse = await this.mercadoPagoService.createPreference(items, baseUrl);

    // Calcula total para resposta
    const total = this.calculateItemsTotal(items);

    // Formata resposta
    return {
      url: mpResponse.init_point,
      id: mpResponse.id,
      sandbox_init_point: mpResponse.sandbox_init_point,
      external_reference: mpResponse.external_reference || `checkout_${Date.now()}`,
      total,
      is_test: this.mercadoPagoService.isTestEnvironment()
    };
  }

  /**
   * Consulta status de um pagamento
   */
  async getPaymentStatus(paymentId: string) {
    return this.mercadoPagoService.getPayment(paymentId);
  }

  /**
   * Consulta pagamentos por referência externa
   */
  async getPaymentsByReference(externalReference: string) {
    return this.mercadoPagoService.getPaymentByExternalReference(externalReference);
  }

  /**
   * Valida requisição de checkout
   */
  private validateCheckoutRequest(items: any[]): void {
    if (!items || !Array.isArray(items)) {
      throw new Error('Itens inválidos');
    }

    if (items.length === 0) {
      throw new Error('Carrinho vazio');
    }
  }

  /**
   * Determina e valida URL base robustamente
   */
  private getAndValidateBaseUrl(origin?: string): string {
    // Prioridades:
    // 1. NEXT_PUBLIC_BASE_URL (mais confiável)
    // 2. Origin do request
    // 3. Fallback localhost

    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl && origin) {
      baseUrl = origin;
    }
    
    if (!baseUrl) {
      baseUrl = 'http://localhost:3000';
    }

    console.log('🔧 Determinando URL base:', {
      env_base_url: process.env.NEXT_PUBLIC_BASE_URL,
      request_origin: origin,
      final_base_url: baseUrl
    });

    // Validação rigorosa
    if (!baseUrl || typeof baseUrl !== 'string') {
      throw new Error('URL base não pode ser determinada');
    }

    // Remove trailing slash se existir
    baseUrl = baseUrl.replace(/\/+$/, '');

    // Verifica se é uma URL válida
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      throw new Error(`URL base inválida (deve começar com http/https): ${baseUrl}`);
    }

    // Verifica se as páginas de retorno existirão
    const successUrl = `${baseUrl}/checkout/success`;
    const failureUrl = `${baseUrl}/checkout/failure`;
    const pendingUrl = `${baseUrl}/checkout/pending`;

    console.log('🔧 URLs de retorno que serão usadas:', {
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl
    });

    return baseUrl;
  }

  /**
   * Calcula total dos itens (para resposta)
   */
  private calculateItemsTotal(items: any[]): number {
    const total = items.reduce((total, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQuantity = Math.max(0, Math.floor(Number(item.quantity) || 1));
      return total + (itemPrice * itemQuantity);
    }, 0);
    
    // Arredondamento consistente para evitar problemas de precisão
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }
} 