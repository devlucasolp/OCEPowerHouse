import React, { useEffect, useRef } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart, calculateItemTotal, toSafeNumber } from '../lib/useCart';
import CartItem from './CartItem';
import ButtonPrimary from './ButtonPrimary';
import { useRouter } from 'next/router';
import { ShippingCalculator } from './ShippingCalculator';

const SideCart = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity,
    totalPrice, 
    totalItems,
    subtotal,
    shippingCost,
    discountAmount,
    finalTotal,
    appliedCoupon
  } = useCart();
  const router = useRouter();

  // Garantir que finalTotal seja sempre um número
  const safeFinalTotal = toSafeNumber(finalTotal);
  const safeSubtotal = toSafeNumber(subtotal);
  const safeShippingCost = toSafeNumber(shippingCost);
  const safeDiscountAmount = toSafeNumber(discountAmount);

  // Fecha o carrinho quando navegar para outra página
  useEffect(() => {
    const handleRouteChange = () => {
      closeCart();
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events, closeCart]);

  // Bloqueia scroll do body quando carrinho está aberto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isCartOpen]);

  // Force scroll reset when cart opens
  useEffect(() => {
    if (isCartOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
        style={{ touchAction: 'none' }}
      />
      
      {/* Cart Sidebar */}
      <div 
        className="fixed right-0 top-0 w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
        style={{ 
          height: '100vh',
          height: '100dvh', // Dynamic viewport height for mobile
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header - Fixed */}
        <div 
          className="flex items-center justify-between p-6 border-b bg-white"
          style={{ flexShrink: 0 }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Seu Carrinho</h2>
            {totalItems > 0 && (
              <span className="bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items - Scrollable Area */}
        <div 
          ref={scrollRef}
          className="bg-white"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            touchAction: 'pan-y',
            minHeight: 0,
            maxHeight: 'calc(100vh - 300px)' // Increased space for footer
          }}
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 min-h-[200px]"> {/* Reduced min-height */}
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Carrinho vazio</h3>
              <p className="text-gray-400 mb-6">Adicione produtos para começar suas compras</p>
              <ButtonPrimary 
                onClick={() => {
                  closeCart();
                  router.push('/shop');
                }}
                className="px-6 py-3"
              >
                Ir para a Loja
              </ButtonPrimary>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id || item._id}
                  product={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
              {/* Extra space at bottom for better scrolling */}
              <div className="h-4"></div>
            </div>
          )}
        </div>

        {/* Footer - Fixed with better height management */}
        {cartItems.length > 0 && (
          <div 
            className="border-t bg-gray-50"
            style={{ 
              flexShrink: 0,
              maxHeight: '300px', // Limit footer height
              overflowY: 'auto' // Allow footer to scroll if needed
            }}
          >
            <div className="p-4"> {/* Reduced padding */}
              {/* Calculadora de Frete - Compacta */}
              <div className="mb-4"> {/* Reduced margin */}
                <ShippingCalculator />
              </div>
              
              {/* Resumo compacto */}
              <div className="space-y-2 mb-3"> {/* Reduced spacing */}
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                  <span className="font-medium">R$ {safeSubtotal.toFixed(2)}</span>
                </div>
                
                {/* Desconto aplicado */}
                {appliedCoupon && safeDiscountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Desconto ({appliedCoupon.coupon.code})</span>
                    <span className="font-medium text-green-600">-R$ {safeDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Frete */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  <span className="font-medium">R$ {safeShippingCost.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Total Final */}
              <div className="flex items-center justify-between mb-3 pt-2 border-t"> {/* Reduced margin */}
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-green-600"> {/* Reduced font size */}
                  R$ {safeFinalTotal.toFixed(2)}
                </span>
              </div>
              
              {/* Botão sempre visível */}
              <div className="sticky bottom-0 bg-gray-50 pt-2"> {/* Sticky button */}
                <ButtonPrimary
                  onClick={handleCheckout}
                  className="w-full py-3 text-lg font-semibold shadow-lg"
                >
                  Finalizar Compra - R$ {safeFinalTotal.toFixed(2)}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideCart;