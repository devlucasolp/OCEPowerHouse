import type { NextApiRequest, NextApiResponse } from 'next';
import { MelhorEnvioService } from '../../../services/melhorenvio';

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

// Instância do serviço do Melhor Envio
const melhorEnvioService = new MelhorEnvioService();

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
      totalWeight: calculateTotalWeight(items),
      melhorEnvioConfigured: melhorEnvioService.isConfigured()
    });

    // Calcular opções de frete usando Melhor Envio
    const shippingOptions = await melhorEnvioService.calculateShipping(cep, items);

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