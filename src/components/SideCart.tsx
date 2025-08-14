import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart, calculateItemTotal } from '../lib/useCart';
import CartItem from './CartItem';
import ButtonPrimary from './ButtonPrimary';
import { useRouter } from 'next/router';

const SideCart = () => {
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
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
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
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
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

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
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
            <div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id || item._id}
                  product={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            {/* Resumo detalhado */}
            <div className="space-y-3 mb-4">
              {/* Lista resumida dos itens (só se tiver poucos itens) */}
              {cartItems.length <= 3 && (
                <div className="space-y-1 mb-3">
                  {cartItems.map((item) => {
                    const itemTotal = calculateItemTotal(item.price, item.quantity);
                    
                    return (
                      <div key={item.id || item._id} className="flex items-center justify-between text-xs text-gray-600">
                        <span className="truncate flex-1 mr-2">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          R$ {itemTotal.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                  <hr className="my-2" />
                </div>
              )}
              
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {/* Desconto aplicado */}
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Desconto ({appliedCoupon.coupon.code})</span>
                  <span className="font-medium text-green-600">-R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {/* Frete */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Frete</span>
                <span className="font-medium">R$ {shippingCost.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Total Final */}
            <div className="flex items-center justify-between mb-4 pt-2 border-t">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {finalTotal.toFixed(2)}
              </span>
            </div>
            
            <ButtonPrimary
              onClick={handleCheckout}
              className="w-full py-3 text-lg font-semibold"
            >
              Finalizar Compra - R$ {finalTotal.toFixed(2)}
            </ButtonPrimary>
          </div>
        )}
      </div>
    </>
  );
};

export default SideCart; 