import React, { useState } from 'react';
import type { NextPage } from 'next';
import CartItem from '../components/CartItem';
import { useCart } from '../lib/useCart';
import Seo from '../components/Seo';
import ButtonPrimary from '../components/ButtonPrimary';
import Link from 'next/link';
import { ShoppingCart, CreditCard, Shield, Loader2 } from 'lucide-react';

const CheckoutPage: NextPage = () => {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    if (isEmpty || isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando checkout com', cartItems.length, 'itens');
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Seu Carrinho</h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
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
                <CartItem key={item.id} product={item} onRemove={removeFromCart} />
              ))
            )}
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Resumo do Pedido</h2>
            
            {!isEmpty && (
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                  <span className="font-medium">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Informações sobre pagamento */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 mb-1">Pagamento via Mercado Pago</h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Cartão de crédito ou débito</li>
                    <li>• PIX (aprovação instantânea)</li>
                    <li>• Boleto bancário</li>
                    <li>• Até 12x sem juros</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Compra 100% Segura</span>
              </div>
              <p className="text-xs text-green-700">
                Seus dados estão protegidos com criptografia SSL e são processados pelo Mercado Pago.
              </p>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">{error}</p>
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
              ) : (
                `Finalizar Compra - R$ ${totalPrice.toFixed(2)}`
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
