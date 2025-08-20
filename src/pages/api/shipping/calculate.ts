import type { NextApiRequest, NextApiResponse } from 'next';

interface ShippingItem {
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
}

interface ShippingRequest {
  cep: string;
  items: ShippingItem[];
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  company: string;
}

interface ShippingResponse {
  success: boolean;
  options?: ShippingOption[];
  message?: string;
}

// Função para validar CEP
const isValidCep = (cep: string): boolean => {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep);
};

// Função para calcular peso total
const calculateTotalWeight = (items: ShippingItem[]): number => {
  return items.reduce((total, item) => {
    const itemWeight = item.weight || 0.5; // peso padrão 500g
    return total + (itemWeight * item.quantity);
  }, 0);
};

// Função para simular cálculo de frete (substitua pela integração real com Melhor Envio)
const calculateShippingOptions = async (cep: string, items: ShippingItem[]): Promise<ShippingOption[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const totalWeight = calculateTotalWeight(items);
  const basePrice = 15.00;
  const weightMultiplier = totalWeight * 2.5;
  
  // Simular diferentes opções de frete baseadas no peso e CEP
  const options: ShippingOption[] = [
    {
      id: 'pac',
      name: 'PAC',
      price: basePrice + weightMultiplier,
      deliveryTime: '8 a 12 dias úteis',
      company: 'Correios'
    },
    {
      id: 'sedex',
      name: 'SEDEX',
      price: (basePrice + weightMultiplier) * 1.8,
      deliveryTime: '2 a 5 dias úteis',
      company: 'Correios'
    },
    {
      id: 'jadlog',
      name: 'JadLog Econômico',
      price: (basePrice + weightMultiplier) * 0.9,
      deliveryTime: '5 a 10 dias úteis',
      company: 'JadLog'
    }
  ];
  
  // Adicionar variação baseada no CEP (simulação)
  const cepNumber = parseInt(cep.substring(0, 2));
  const distanceMultiplier = cepNumber > 50 ? 1.3 : 1.0; // CEPs mais altos = mais longe
  
  return options.map(option => ({
    ...option,
    price: Math.round((option.price * distanceMultiplier) * 100) / 100
  }));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShippingResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { cep, items }: ShippingRequest = req.body;

    // Validações
    if (!cep || !isValidCep(cep)) {
      return res.status(400).json({
        success: false,
        message: 'CEP inválido. Digite um CEP válido com 8 dígitos.'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Itens do carrinho são obrigatórios.'
      });
    }

    // Validar itens
    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Dados dos itens inválidos.'
        });
      }
    }

    console.log('📦 Calculando frete para:', {
      cep,
      itemsCount: items.length,
      totalWeight: calculateTotalWeight(items)
    });

    // Calcular opções de frete
    const shippingOptions = await calculateShippingOptions(cep, items);

    return res.status(200).json({
      success: true,
      options: shippingOptions
    });

  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao calcular frete.'
    });
  }
}