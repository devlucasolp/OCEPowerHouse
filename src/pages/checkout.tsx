import React, { useState } from 'react';
import type { NextPage } from 'next';
import CartItem from '../components/CartItem';
import CouponInput from '../components/CouponInput';
import { useCart, calculateItemTotal } from '../lib/useCart';
import Seo from '../components/Seo';
import ButtonPrimary from '../components/ButtonPrimary';
import Link from 'next/link';
import { ShoppingCart, CreditCard, Shield, Loader2 } from 'lucide-react';

const CheckoutPage: NextPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems,
    subtotal,
    shippingCost,
    appliedCoupon,
    discountAmount,
    finalTotal
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    if (isEmpty || isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando checkout com', cartItems.length, 'itens');
      
      // Preparar dados para envio (inclui frete)
      const checkoutData = {
        items: cartItems,
        subtotal,
        shippingCost,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.coupon.code,
          discountAmount: appliedCoupon.discountAmount
        } : null,
        total: finalTotal
      };
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }
      
      if (data.url) {
        console.log('✅ Redirecionando para Mercado Pago:', {
          url: data.url,
          total: data.total,
          external_reference: data.external_reference
        });
        
        // Redireciona para o Mercado Pago
        window.location.href = data.url;
      } else {
        throw new Error('URL de pagamento não encontrada');
      }
    } catch (err) {
      console.error('❌ Erro no checkout:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setIsLoading(false);
    }
  };

  const isEmpty = cartItems.length === 0;

  return (
    <>
      <Seo
        title="Finalizar Compra"
        description="Revise seus itens antes de finalizar a compra na Power House Brasil."
      />
      <div className="max-w-6xl mx-auto px-4 py-12 pt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itens do carrinho */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Seu Carrinho</h1>
            {!isEmpty && (
              <span className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-16">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" aria-label="Carrinho vazio" />
                <span className="text-gray-500 mb-6 text-lg">Seu carrinho está vazio.</span>
                <Link href="/shop">
                  <ButtonPrimary aria-label="Voltar para a loja">← Voltar para a Loja</ButtonPrimary>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem 
                  key={item.id || item._id} 
                  product={item} 
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))
            )}
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>

            {!isEmpty && (
              <div className="space-y-4 mb-6">
                {/* Lista detalhada dos itens */}
                <div className="space-y-2">
                  {cartItems.map((item) => {
                    const itemTotal = calculateItemTotal(item.price, item.quantity);
                    
                    return (
                      <div key={item.id || item._id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          R$ {itemTotal.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <hr className="my-3" />
                
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {/* Campo de cupom */}
                <div className="py-2">
                  <CouponInput />
                </div>
                
                {/* Desconto aplicado */}
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Desconto ({appliedCoupon.coupon.code})</span>
                    <span className="font-medium text-green-600">-R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Frete */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium">R$ {shippingCost.toFixed(2)}</span>
                </div>
                
                <hr className="my-3" />
                
                {/* Total Final */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">R$ {finalTotal.toFixed(2)}</span>
                </div>
                
                {/* Economia mostrada */}
                {appliedCoupon && discountAmount > 0 && (
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      🎉 Você está economizando R$ {discountAmount.toFixed(2)}!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Informações de segurança */}
            {!isEmpty && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>Processado pelo Mercado Pago</span>
                </div>
              </div>
            )}

            {/* Mensagem de erro */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Botão de finalizar */}
            <ButtonPrimary
              className="w-full text-lg py-4 relative"
              onClick={handleFinish}
              aria-label="Finalizar Compra"
              tabIndex={0}
              disabled={isEmpty || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </span>
              ) : isEmpty ? (
                'Carrinho vazio'
              ) : (
                `Finalizar Compra - R$ ${finalTotal.toFixed(2)}`
              )}
            </ButtonPrimary>

            {!isEmpty && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Ao continuar, você será redirecionado para o Mercado Pago para completar o pagamento de forma segura.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
