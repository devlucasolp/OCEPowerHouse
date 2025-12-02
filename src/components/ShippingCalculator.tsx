// imports do arquivo ShippingCalculator
import React, { useState } from 'react';
import { Truck, Calculator, AlertCircle, MapPin } from 'lucide-react';
import { useCart } from '../lib/useCart';
import { AddressForm } from './AddressForm';
import { CustomerAddress, formatCep, isValidCep } from '../lib/addressUtils';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  company: string;
}

interface ShippingCalculatorProps {
  onShippingSelect?: (option: ShippingOption) => void;
  onShippingCalculated?: (calculated: boolean) => void;
  onDeliveryTypeChange?: (type: 'delivery' | 'pickup') => void;
  onAddressComplete?: (address: CustomerAddress) => void;
  required?: boolean;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({ 
  onShippingSelect, 
  onShippingCalculated,
  onDeliveryTypeChange,
  onAddressComplete,
  required = false 
}) => {
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerAddress, setCustomerAddress] = useState<CustomerAddress | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const { cartItems, updateShippingCost } = useCart();

  // Opção de retirada na loja
  const pickupOption: ShippingOption = {
    id: 'pickup',
    name: 'Retirada na Loja',
    price: 0,
    deliveryTime: 'Disponível para retirada em 1 dia útil',
    company: 'Power House Brasil'
  };

  // Lidar com mudanças no endereço
  const handleAddressComplete = (address: CustomerAddress) => {
    setCustomerAddress(address);
    onAddressComplete?.(address);
  };

  const handleAddressChange = (address: CustomerAddress | null) => {
    setCustomerAddress(address);
  };

  // Calcular frete
  const calculateShipping = async () => {
    if (!isValidCep(cep)) {
      setError('CEP inválido. Digite um CEP válido com 8 dígitos.');
      onShippingCalculated?.(false);
      return;
    }

    if (cartItems.length === 0) {
      setError('Carrinho vazio. Adicione produtos para calcular o frete.');
      onShippingCalculated?.(false);
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
            id: item._id || item.id || '',
            name: item.title || '',
            price: item.price || 0,
            quantity: item.quantity || 1,
            weight: item.shippingDimensions?.weight || 0.5,
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
        const cheapestOption = data.options.reduce((prev: ShippingOption, current: ShippingOption) => 
          (prev.price || 0) < (current.price || 0) ? prev : current
        );
        setSelectedOption(cheapestOption);
        updateShippingCost(cheapestOption.price || 0);
        onShippingSelect?.(cheapestOption);
        onShippingCalculated?.(true);
      } else {
        setError(data.message || 'Não foi possível calcular o frete para este CEP.');
        onShippingCalculated?.(false);
      }
    } catch (err) {
      console.error('Erro ao calcular frete:', err);
      setError('Erro ao calcular frete. Tente novamente.');
      onShippingCalculated?.(false);
    } finally {
      setLoading(false);
    }
  };

  // Selecionar opção de frete
  const selectShippingOption = (option: ShippingOption) => {
    setSelectedOption(option);
    updateShippingCost?.(option.price || 0);
    onShippingSelect?.(option);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    setError('');
    
    // Mostrar formulário de endereço se CEP for válido
    const isValid = isValidCep(formatted);
    setShowAddressForm(isValid);
    
    // Limpar endereço se CEP for inválido
    if (!isValid) {
      setCustomerAddress(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateShipping();
    }
  };

  // Selecionar tipo de entrega
  const handleDeliveryTypeChange = (type: 'delivery' | 'pickup') => {
    setDeliveryType(type);
    setError('');
    setShippingOptions([]);
    setSelectedOption(null);
    
    // Notificar o componente pai sobre a mudança
    onDeliveryTypeChange?.(type);
    
    if (type === 'pickup') {
      setSelectedOption(pickupOption);
      updateShippingCost(0);
      onShippingSelect?.(pickupOption);
      onShippingCalculated?.(true);
    } else {
      onShippingCalculated?.(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Opções de Entrega
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
      </div>

      {/* Seletor de tipo de entrega */}
      <div className="mb-4">
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="deliveryType"
              value="delivery"
              checked={deliveryType === 'delivery'}
              onChange={() => handleDeliveryTypeChange('delivery')}
              className="mr-2"
            />
            <Truck className="w-4 h-4 mr-1" />
            Entrega
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="deliveryType"
              value="pickup"
              checked={deliveryType === 'pickup'}
              onChange={() => handleDeliveryTypeChange('pickup')}
              className="mr-2"
            />
            <MapPin className="w-4 h-4 mr-1" />
            Retirada na Loja
          </label>
        </div>
      </div>

      {/* Conteúdo baseado no tipo selecionado */}
      {deliveryType === 'delivery' ? (
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

          {/* Removido: AddressForm e coleta de dados de endereço */}
          {/* Exibição de opções de frete */}
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
                      R$ {(option.price || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Informações de retirada na loja */
        <div className="space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-2">Retirada Gratuita na Loja</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Endereço:</strong></p>
                  <p>Alameda do Ingá 222/302, Vale do Sereno</p>
                  <p>Nova Lima – MG – CEP: 34006-069</p>
                  <p className="mt-2"><strong>Contato:</strong> (31) 99772-5450</p>
                  <p className="mt-2 font-medium">Disponível para retirada em 1 dia útil</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mostrar opção selecionada */}
          <div className="p-3 border border-green-500 bg-green-50 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-sm text-green-800">{pickupOption.name}</div>
                <div className="text-xs text-green-600">{pickupOption.company}</div>
                <div className="text-xs text-green-600">{pickupOption.deliveryTime}</div>
              </div>
              <div className="font-semibold text-green-600">
                Grátis
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;