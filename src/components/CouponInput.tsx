import React, { useState } from 'react';
import { Ticket, X, Check, Loader2 } from 'lucide-react';
import { useCart } from '../lib/useCart';
import { getCouponByCode } from '../lib/sanity';
import { validateCoupon, formatDiscount } from '../lib/couponUtils';
import type { Coupon } from '../types/coupon';

const CouponInput = () => {
  const { 
    cartItems, 
    subtotal, 
    appliedCoupon, 
    discountAmount, 
    applyCouponToCart, 
    removeCoupon 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Digite um código de cupom');
      return;
    }

    if (cartItems.length === 0) {
      setError('Adicione produtos ao carrinho primeiro');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Buscar cupom no Sanity
      const coupon = await getCouponByCode(couponCode.trim());
      
      if (!coupon) {
        setError('Cupom não encontrado');
        setIsLoading(false);
        return;
      }

      // Validar cupom
      const validation = validateCoupon(coupon, cartItems, subtotal);
      if (!validation.isValid) {
        setError(validation.error || 'Cupom inválido');
        setIsLoading(false);
        return;
      }

      // Aplicar cupom
      const applied = applyCouponToCart(coupon);
      if (applied) {
        setSuccess(`Cupom aplicado! ${formatDiscount(coupon)}`);
        setCouponCode('');
      } else {
        setError('Erro ao aplicar cupom');
      }
    } catch (err) {
      console.error('Erro ao aplicar cupom:', err);
      setError('Erro ao processar cupom');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setSuccess(null);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  return (
    <div className="space-y-3">
      {/* Input para cupom */}
      {!appliedCoupon && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Código do cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleApplyCoupon}
            disabled={isLoading || !couponCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Aplicar'
            )}
          </button>
        </div>
      )}

      {/* Cupom aplicado */}
      {appliedCoupon && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Cupom {appliedCoupon.coupon.code} aplicado
              </p>
              <p className="text-xs text-green-600">
                {appliedCoupon.coupon.title} - {formatDiscount(appliedCoupon.coupon)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100"
            aria-label="Remover cupom"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mensagens de erro */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Mensagens de sucesso */}
      {success && !appliedCoupon && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Resumo do desconto */}
      {appliedCoupon && discountAmount > 0 && (
        <div className="text-right">
          <p className="text-sm text-green-600 font-medium">
            Desconto: -R$ {discountAmount.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponInput; 