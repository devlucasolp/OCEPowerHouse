import React, { useState } from 'react';
import { Truck, Calculator, AlertCircle } from 'lucide-react';
import { useCart } from '../lib/useCart';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  company: string;
}

interface ShippingCalculatorProps {
  onShippingSelect?: (option: ShippingOption) => void;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({ onShippingSelect }) => {
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);
  
  const { cartItems, updateShippingCost } = useCart();

  // Formatar CEP enquanto digita
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return numbers.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Validar CEP
  const isValidCep = (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  };

  // Calcular frete
  const calculateShipping = async () => {
    if (!isValidCep(cep)) {
      setError('CEP inválido. Digite um CEP válido com 8 dígitos.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Carrinho vazio. Adicione produtos para calcular o frete.');
      return;
    }

    setLoading(true);
    setError('');
    setShippingOptions([]);

    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cep: cep.replace(/\D/g, ''),
          items: cartItems.map(item => ({
            id: item._id || item.id || '', // Compatibilidade com ambos os campos
            name: item.title || item.name || '', // Usar title do produto
            price: item.price || 0,
            quantity: item.quantity || 1,
            weight: item.shippingDimensions?.weight || 0.5, // Usar dimensões do produto
            dimensions: item.shippingDimensions ? {
              length: item.shippingDimensions.length,
              width: item.shippingDimensions.width,
              height: item.shippingDimensions.height
            } : {
              length: 20,
              width: 15,
              height: 5
            }
          }))
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', errorText);
        throw new Error('Erro ao calcular frete');
      }

      const data = await response.json();
      
      if (data.success && data.options && data.options.length > 0) {
        setShippingOptions(data.options);
        // Selecionar automaticamente a opção mais barata
        const cheapestOption = data.options.reduce((prev: ShippingOption, current: ShippingOption) => 
          prev.price < current.price ? prev : current
        );
        setSelectedOption(cheapestOption);
        updateShippingCost(cheapestOption.price);
        onShippingSelect?.(cheapestOption);
      } else {
        setError(data.message || 'Não foi possível calcular o frete para este CEP.');
      }
    } catch (err) {
      console.error('Erro ao calcular frete:', err);
      setError('Erro ao calcular frete. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Selecionar opção de frete
  const selectShippingOption = (option: ShippingOption) => {
    setSelectedOption(option);
    updateShippingCost?.(option.price);
    onShippingSelect?.(option);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateShipping();
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">Calcular Frete</h3>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Digite seu CEP"
              value={cep}
              onChange={handleCepChange}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={9}
            />
          </div>
          <button
            onClick={calculateShipping}
            disabled={loading || !isValidCep(cep)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Calculator className="w-4 h-4" />
            )}
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {shippingOptions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 text-sm">Opções de Frete:</h4>
            {shippingOptions.map((option) => (
              <div
                key={option.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedOption?.id === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectShippingOption(option)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">{option.name}</div>
                    <div className="text-xs text-gray-600">{option.company}</div>
                    <div className="text-xs text-gray-500">{option.deliveryTime}</div>
                  </div>
                  <div className="font-semibold text-green-600">
                    R$ {option.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingCalculator;