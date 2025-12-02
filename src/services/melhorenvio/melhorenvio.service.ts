interface MelhorEnvioItem {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;
}

interface MelhorEnvioAddress {
  postal_code: string;
  address?: string;
  number?: string;
  district?: string;
  city?: string;
  state_abbr?: string;
  country_id?: string;
}

interface MelhorEnvioCalculateRequest {
  from: MelhorEnvioAddress;
  to: MelhorEnvioAddress;
  products: MelhorEnvioItem[];
}

interface MelhorEnvioShippingOption {
  id: number;
  name: string;
  price: string;
  custom_price: string;
  discount: string;
  currency: string;
  delivery_time: number;
  delivery_range: {
    min: number;
    max: number;
  };
  custom_delivery_time: number;
  custom_delivery_range: {
    min: number;
    max: number;
  };
  packages: Array<{
    price: string;
    discount: string;
    format: string;
    weight: string;
    insurance_value: string;
    products: MelhorEnvioItem[];
    dimensions: {
      height: number;
      width: number;
      length: number;
    };
  }>;
  additional_services: {
    receipt: boolean;
    own_hand: boolean;
    collect: boolean;
  };
  company: {
    id: number;
    name: string;
    picture: string;
  };
}

interface MelhorEnvioCalculateResponse {
  [key: string]: MelhorEnvioShippingOption[];
}

export class MelhorEnvioService {
  private readonly apiToken: string;
  private readonly baseUrl = 'https://melhorenvio.com.br/api/v2/me';
  private readonly originAddress: MelhorEnvioAddress;

  constructor() {
    this.apiToken = process.env.MELHOR_ENVIO_API_TOKEN || '';
    
    if (!this.apiToken) {
      throw new Error('MELHOR_ENVIO_API_TOKEN não configurado');
    }

    // Endereço de origem da Power House Brasil
    this.originAddress = {
      postal_code: '34006069', // CEP sem formatação
      address: 'Alameda do Ingá',
      number: '222',
      district: 'Vale do Sereno',
      city: 'Nova Lima',
      state_abbr: 'MG',
      country_id: 'BR'
    };
  }

  /**
   * Calcula opções de frete usando a API real do Melhor Envio
   */
  async calculateShipping(
    destinationCep: string,
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      weight?: number;
      dimensions?: {
        length: number;
        width: number;
        height: number;
      };
    }>
  ): Promise<Array<{
    id: string;
    name: string;
    price: number;
    deliveryTime: string;
    company: string;
  }>> {
    try {
      // Preparar produtos para a API do Melhor Envio
      const products: MelhorEnvioItem[] = items.map(item => ({
        id: item.id,
        width: item.dimensions?.width || 15, // cm
        height: item.dimensions?.height || 5, // cm
        length: item.dimensions?.length || 20, // cm
        weight: item.weight || 0.5, // kg
        insurance_value: item.price,
        quantity: item.quantity
      }));

      // Preparar endereço de destino
      const destinationAddress: MelhorEnvioAddress = {
        postal_code: destinationCep.replace(/\D/g, '')
      };

      // Dados da requisição
      const requestData: MelhorEnvioCalculateRequest = {
        from: this.originAddress,
        to: destinationAddress,
        products
      };

      console.log('📦 Calculando frete no Melhor Envio:', {
        origin: this.originAddress.postal_code,
        destination: destinationAddress.postal_code,
        productsCount: products.length
      });

      // Fazer requisição para a API do Melhor Envio
      const response = await fetch(`${this.baseUrl}/shipment/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na API do Melhor Envio:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Erro na API do Melhor Envio: ${response.status}`);
      }

      const data: MelhorEnvioCalculateResponse = await response.json();
      
      console.log('✅ Resposta do Melhor Envio recebida:', JSON.stringify(data, null, 2));

      // Processar resposta e converter para formato esperado
      let shippingOptions: Array<{
        id: string;
        name: string;
        price: number;
        deliveryTime: string;
        company: string;
      }> = [];

      // Transportadoras prioritárias
      const priorityCarriers = ['Correios', 'Jadlog', 'SEDEX', 'PAC'];
      
      // Função para normalizar nomes de transportadoras
      const normalizeCarrierName = (name: string, company: string): { normalizedName: string; displayName: string; carrierType: string } => {
        const lowerName = name.toLowerCase();
        const lowerCompany = company.toLowerCase();
        
        // Normalização para Jadlog - PRIORIZAR .Package Centralizado
        if (lowerCompany.includes('jadlog')) {
          // Verificar se é especificamente .Package Centralizado (a opção que sempre pedem)
          if (lowerName.includes('package centralizado')) {
            return {
              normalizedName: 'jadlog_package_centralizado',
              displayName: 'Jadlog (.Package Centralizado)',
              carrierType: 'jadlog'
            };
          }
          // .Package comum (mais barato, mas não é o que pedem)
          else if (lowerName.includes('.package') || lowerName.includes('package')) {
            return {
              normalizedName: 'jadlog_package_comum',
              displayName: 'Jadlog (.Package)',
              carrierType: 'jadlog'
            };
          }
          // Outras modalidades do Jadlog
          return {
            normalizedName: 'jadlog_other',
            displayName: 'Jadlog',
            carrierType: 'jadlog'
          };
        }
        
        // Normalização para SEDEX
        if (lowerName.includes('sedex') || lowerCompany.includes('sedex')) {
          return {
            normalizedName: 'sedex',
            displayName: 'SEDEX',
            carrierType: 'correios'
          };
        }
        
        // Normalização para PAC (apenas dos Correios, não Jadlog)
        if ((lowerName.includes('pac') || lowerName.includes('package')) && 
            !lowerCompany.includes('jadlog') && 
            (lowerCompany.includes('correios') || lowerCompany.includes('correio'))) {
          return {
            normalizedName: 'pac',
            displayName: 'PAC',
            carrierType: 'correios'
          };
        }
        
        // Normalização para .Com (Correios)
        if (lowerName.includes('.com') || lowerName.includes('com')) {
          return {
            normalizedName: 'correios_com',
            displayName: 'Correios (.Com)',
            carrierType: 'correios'
          };
        }
        
        // Outros casos - usar nome da empresa
        return {
          normalizedName: lowerCompany.replace(/\s+/g, '_'),
          displayName: company,
          carrierType: lowerCompany
        };
      };
      
      // Verificar se a resposta é um array direto ou objeto com transportadoras
      if (Array.isArray(data)) {
        // Se for array direto, processar cada opção
        data.forEach(option => {
          // Pular opções com erro ou preço inválido
          if (option.error || !option.price || parseFloat(option.price) <= 0) {
            return;
          }
          
          const price = parseFloat(option.custom_price || option.price);
          const deliveryMin = option.custom_delivery_range?.min || option.delivery_range?.min || 0;
          const deliveryMax = option.custom_delivery_range?.max || option.delivery_range?.max || 0;
          
          let deliveryTime = '';
          if (deliveryMin === deliveryMax) {
            deliveryTime = `${deliveryMin} dias úteis`;
          } else {
            deliveryTime = `${deliveryMin} a ${deliveryMax} dias úteis`;
          }

          const normalized = normalizeCarrierName(option.name, option.company.name);
          
          shippingOptions.push({
            id: `${option.id}`,
            name: normalized.displayName,
            price,
            deliveryTime,
            company: normalized.displayName,
            normalizedName: normalized.normalizedName,
            carrierType: normalized.carrierType
          } as any);
        });
      } else {
        // Se for objeto com transportadoras, iterar sobre elas
        Object.entries(data).forEach(([carrierId, options]) => {
          if (Array.isArray(options)) {
            options.forEach(option => {
              // Pular opções com preço inválido
              if (!option.price || parseFloat(option.price) <= 0) {
                return;
              }
              
              const price = parseFloat(option.custom_price || option.price);
              const deliveryMin = option.custom_delivery_range?.min || option.delivery_range?.min || 0;
              const deliveryMax = option.custom_delivery_range?.max || option.delivery_range?.max || 0;
              
              let deliveryTime = '';
              if (deliveryMin === deliveryMax) {
                deliveryTime = `${deliveryMin} dias úteis`;
              } else {
                deliveryTime = `${deliveryMin} a ${deliveryMax} dias úteis`;
              }

              const normalized = normalizeCarrierName(option.name, option.company.name);
              
              shippingOptions.push({
                id: `${carrierId}_${option.id}`,
                name: normalized.displayName,
                price,
                deliveryTime,
                company: normalized.displayName,
                normalizedName: normalized.normalizedName,
                carrierType: normalized.carrierType
              } as any);
            });
          }
        });
      }

      // Filtrar apenas opções válidas
      const validOptions = shippingOptions.filter(option => option.price > 0);
      
      // Remover duplicatas baseado APENAS no nome normalizado, mas priorizando .Package Centralizado
      const uniqueOptions = new Map();
      
      validOptions.forEach(option => {
        // Usar APENAS o nome normalizado como chave (sem tempo de entrega)
        const key = (option as any).normalizedName;
        const existing = uniqueOptions.get(key);
        
        // Para Jadlog, priorizar .Package Centralizado mesmo que seja mais caro
        if (key === 'jadlog_package_centralizado' || key === 'jadlog_package_comum') {
          const jadlogKey = 'jadlog'; // Usar chave única para todas as modalidades Jadlog
          const existingJadlog = uniqueOptions.get(jadlogKey);
          
          if (!existingJadlog) {
            uniqueOptions.set(jadlogKey, option);
          } else {
            // Se já existe uma opção Jadlog, priorizar .Package Centralizado
            const currentIsPackageCentralizado = key === 'jadlog_package_centralizado';
            const existingIsPackageCentralizado = (existingJadlog as any).normalizedName === 'jadlog_package_centralizado';
            
            if (currentIsPackageCentralizado && !existingIsPackageCentralizado) {
              // Substituir por .Package Centralizado
              uniqueOptions.set(jadlogKey, option);
            } else if (!currentIsPackageCentralizado && !existingIsPackageCentralizado) {
              // Se ambos não são Centralizado, manter o mais barato
              if (option.price < existingJadlog.price) {
                uniqueOptions.set(jadlogKey, option);
              }
            }
            // Se existing já é Centralizado, manter ele
          }
        } else {
          // Para outras transportadoras, manter lógica original (mais barato)
          if (!existing || option.price < existing.price) {
            uniqueOptions.set(key, option);
          }
        }
      });
      
      // Converter de volta para array
      const deduplicatedOptions = Array.from(uniqueOptions.values());
      
      // Definir prioridades para transportadoras principais
      const getCarrierPriority = (option: any): number => {
        const normalizedName = option.normalizedName;
        switch (normalizedName) {
          case 'pac': return 1;                           // PAC - Correios
          case 'sedex': return 2;                         // SEDEX - Correios  
          case 'jadlog_package_centralizado': return 3;   // .Package Centralizado - Jadlog (O QUE SEMPRE PEDEM)
          case 'correios_com': return 4;                  // .Com - Correios
          case 'jadlog_package_comum': return 5;          // .Package comum - Jadlog (mais barato, mas não é o padrão)
          case 'jadlog_other': return 6;                  // Outras modalidades Jadlog
          default: return 999;                            // Outras transportadoras por último
        }
      };
      
      // Ordenar por prioridade das transportadoras principais, depois por preço
      deduplicatedOptions.sort((a, b) => {
        const priorityA = getCarrierPriority(a);
        const priorityB = getCarrierPriority(b);
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        return a.price - b.price;
      });
      
      // Filtrar apenas as transportadoras principais se disponíveis
      const mainCarriers = deduplicatedOptions.filter(option => {
        const priority = getCarrierPriority(option);
        return priority <= 6; // PAC, SEDEX, Jadlog .Package Centralizado, Correios .Com, Jadlog .Package comum, Jadlog outras
      });
      
      // Se temos transportadoras principais, usar apenas elas, senão usar todas
      const finalOptions = mainCarriers.length >= 3 ? mainCarriers : deduplicatedOptions;
      
      // Limitar a 3 opções e remover propriedades auxiliares
      shippingOptions = finalOptions.slice(0, 3).map(option => ({
        id: option.id,
        name: option.name,
        price: option.price,
        deliveryTime: option.deliveryTime,
        company: option.company
      }));

      console.log('📋 Opções de frete processadas:', {
        count: shippingOptions.length,
        cheapest: shippingOptions[0]?.price || 0
      });

      return shippingOptions;

    } catch (error) {
      console.error('❌ Erro ao calcular frete no Melhor Envio:', error);
      
      // Em caso de erro, retornar opções de fallback
      return this.getFallbackOptions(items);
    }
  }

  /**
   * Opções de fallback caso a API do Melhor Envio falhe
   */
  private getFallbackOptions(items: Array<{ price: number; quantity: number; weight?: number }>): Array<{
    id: string;
    name: string;
    price: number;
    deliveryTime: string;
    company: string;
  }> {
    const totalWeight = items.reduce((total, item) => {
      const itemWeight = item.weight || 0.5;
      return total + (itemWeight * item.quantity);
    }, 0);

    const basePrice = 15.00;
    const weightMultiplier = totalWeight * 2.5;

    return [
      {
        id: 'fallback_pac',
        name: 'PAC (Estimativa)',
        price: basePrice + weightMultiplier,
        deliveryTime: '8 a 12 dias úteis',
        company: 'Correios'
      },
      {
        id: 'fallback_sedex',
        name: 'SEDEX (Estimativa)',
        price: (basePrice + weightMultiplier) * 1.8,
        deliveryTime: '2 a 5 dias úteis',
        company: 'Correios'
      }
    ];
  }

  /**
   * Verifica se o token está configurado corretamente
   */
  isConfigured(): boolean {
    return !!this.apiToken && this.apiToken.length > 0;
  }

  /**
   * Retorna informações sobre a configuração atual
   */
  getConfig() {
    return {
      hasToken: this.isConfigured(),
      originAddress: this.originAddress,
      baseUrl: this.baseUrl
    };
  }
}