import React, { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import CartItem from '../components/CartItem';
import CouponInput from '../components/CouponInput';
import { ShippingCalculator } from '../components/ShippingCalculator';
import { useCart, calculateItemTotal } from '../lib/useCart';
import Seo from '../components/Seo';
import ButtonPrimary from '../components/ButtonPrimary';
import Link from 'next/link';
import { ShoppingCart, CreditCard, Shield, Loader2 } from 'lucide-react';
import { CustomerAddress } from '../lib/addressUtils';
import { SimplePurchaseForm } from '../components/SimplePurchaseForm';
import { getProductImageUrl } from '../lib/productUtils';

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
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerAddress, setCustomerAddress] = useState<CustomerAddress | null>(null);
  // Estados para dados do comprador
  const [buyerFullName, setBuyerFullName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerDocument, setBuyerDocument] = useState('');
  const [buyerDocumentType, setBuyerDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
  const [buyerAddress, setBuyerAddress] = useState<CustomerAddress | null>(null);
  const [buyerFormValid, setBuyerFormValid] = useState(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState<{
    id: string;
    name: string;
    price: number;
    deliveryTime: string;
    company: string;
  } | null>(null);

  const handleFinish = async () => {
    if (isEmpty || isLoading) return;
    
    // Validações de entrega
    if (deliveryType === 'delivery') {
      if (!shippingCalculated || shippingCost <= 0) {
        setError('Por favor, calcule o frete antes de finalizar a compra.');
        return;
      }
      if (!buyerFormValid || !buyerAddress) {
        setError('Por favor, preencha os dados do comprador e o endereço completo.');
        return;
      }
    }

    // Validações de retirada
    if (deliveryType === 'pickup') {
      if (!shippingCalculated) {
        setError('Por favor, confirme a opção de retirada na loja.');
        return;
      }
      if (!buyerFormValid || !buyerFullName.trim() || !buyerEmail.trim() || !buyerPhone.trim() || !buyerDocument.trim()) {
        setError('Por favor, preencha todos os dados obrigatórios (nome, e-mail, telefone e CPF/CNPJ).');
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando checkout com', cartItems.length, 'itens');
      
      // PASSO 1: Enviar e-mail de confirmação ANTES do Mercado Pago
      console.log('📧 Enviando e-mail de confirmação para OCE...');
      
      const orderConfirmationData = {
        items: cartItems,
        subtotal,
        shippingCost,
        discountAmount: appliedCoupon?.discountAmount || 0,
        total: finalTotal,
        deliveryType,
        customerName: buyerFullName,
        customerEmail: buyerEmail,
        customerPhone: buyerPhone,
        customerDocument: buyerDocument,
        customerDocumentType: buyerDocumentType,
        customerAddress: deliveryType === 'delivery' ? buyerAddress : null,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.coupon.code,
          discountAmount: appliedCoupon.discountAmount
        } : null,
        selectedShippingOption: selectedShippingOption,
      };

      // Enviar e-mail de confirmação (não falha o processo se der erro)
      const emailResponse = await fetch('/api/order/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderConfirmationData),
      });

      const emailResult = await emailResponse.json();
      
      if (emailResult.success) {
        console.log('✅ E-mail enviado com sucesso:', emailResult.orderId);
      } else {
        console.warn('⚠️ Falha no envio do e-mail, mas continuando:', emailResult.error);
      }
      
      // PASSO 2: Preparar dados para o Mercado Pago
      const checkoutData = {
        items: cartItems,
        subtotal,
        shippingCost,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.coupon.code,
          discountAmount: appliedCoupon.discountAmount
        } : null,
        total: finalTotal,
        deliveryType,
        customerAddress: deliveryType === 'delivery' ? buyerAddress : null,
        customerName: buyerFullName,
        customerEmail: buyerEmail,
      };
      
      // PASSO 3: Processar pagamento no Mercado Pago
      console.log('💳 Processando pagamento no Mercado Pago...');
      
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
        {/* Itens do carrinho - Mobile primeiro */}
        <div className="lg:col-span-1 lg:order-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Seu Carrinho</h1>
            {!isEmpty && (
              <span className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:sticky lg:top-24">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mb-3" aria-label="Carrinho vazio" />
                <span className="text-gray-500 mb-4 text-base">Seu carrinho está vazio.</span>
                <Link href="/shop">
                  <ButtonPrimary aria-label="Voltar para a loja">← Voltar para a Loja</ButtonPrimary>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id || item._id} className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={getProductImageUrl(item, 128, 128)}
                          alt={item.title}
                          fill
                          className="rounded-lg object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          R$ {item.price.toFixed(2)} × {item.quantity}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id || item._id, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              aria-label="Diminuir quantidade"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              aria-label="Aumentar quantidade"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id || item._id)}
                            className="text-xs text-red-600 hover:text-red-800"
                            aria-label="Remover item"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>

            {!isEmpty && (
              <div className="space-y-4 mb-6">
                {/* Lista detalhada, subtotal, cupom, etc. */}
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const itemTotal = calculateItemTotal(item.price, item.quantity);
                    
                    return (
                      <div key={item.id || item._id} className="text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-gray-600 flex-1 leading-tight">
                            {item.title}
                          </span>
                          <span className="font-medium text-right whitespace-nowrap">
                            R$ {itemTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Quantidade: {item.quantity}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <hr className="my-3" />
                
                {/* Subtotal */}
                <div className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-gray-600 flex-1">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                  <span className="font-medium whitespace-nowrap">R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {/* Campo de cupom */}
                <div className="py-2">
                  <CouponInput />
                </div>
                
                {/* Desconto aplicado */}
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex items-start justify-between gap-2 text-sm">
                    <span className="text-gray-600 flex-1">Desconto ({appliedCoupon.coupon.code})</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">-R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Calculadora de Frete - OBRIGATÓRIA */}
                <div className="py-4 border-t border-b">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    {deliveryType === 'delivery' ? 'Calcular Frete *' : 'Opções de Entrega *'}
                  </h3>
                  <ShippingCalculator 
                    onShippingCalculated={(calculated) => setShippingCalculated(calculated)}
                    onDeliveryTypeChange={(type) => setDeliveryType(type)}
                    onShippingSelect={(option) => setSelectedShippingOption(option)}
                    required={true}
                  />
                  {deliveryType === 'delivery' && !shippingCalculated && (
                    <p className="text-xs text-red-600 mt-2">
                      * É obrigatório calcular o frete para finalizar a compra
                    </p>
                  )}
                  {deliveryType === 'pickup' && !shippingCalculated && (
                    <p className="text-xs text-red-600 mt-2">
                      * É obrigatório confirmar a opção de retirada
                    </p>
                  )}
                </div>

                {/* Formulário simples do comprador */}
                <div className="pt-2">
                  <SimplePurchaseForm
                    deliveryType={deliveryType}
                    onChange={(info) => {
                      setBuyerFullName(info.fullName);
                      setBuyerEmail(info.email);
                      setBuyerPhone(info.phone);
                      setBuyerDocument(info.document);
                      setBuyerDocumentType(info.documentType);
                      setBuyerAddress(info.address);
                      setBuyerFormValid(info.isValid);
                    }}
                  />
                </div>
                
                {/* Frete */}
                <div className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-gray-600 flex-1">Frete</span>
                  <span className={`font-medium whitespace-nowrap ${shippingCalculated ? 'text-gray-900' : 'text-gray-400'}`}>
                    {shippingCalculated ? `R$ ${shippingCost.toFixed(2)}` : 'Calcule o frete'}
                  </span>
                </div>
                
                <hr className="my-3" />
                
                {/* Total Final */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-lg font-semibold text-gray-900 flex-1">Total</span>
                  <span className={`text-2xl font-bold whitespace-nowrap ${shippingCalculated ? 'text-green-600' : 'text-gray-400'}`}>
                    {shippingCalculated ? `R$ ${finalTotal.toFixed(2)}` : 'Calcule o frete'}
                  </span>
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
              className={`w-full text-lg py-4 relative ${
                (deliveryType === 'delivery' && !shippingCalculated) || 
                (deliveryType === 'pickup' && !shippingCalculated) ? 
                'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleFinish}
              aria-label="Finalizar Compra"
              tabIndex={0}
              disabled={isEmpty || isLoading || 
                (deliveryType === 'delivery' && !shippingCalculated) ||
                (deliveryType === 'pickup' && !shippingCalculated)
              }
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </span>
              ) : isEmpty ? (
                'Carrinho vazio'
              ) : (deliveryType === 'delivery' && !shippingCalculated) ? (
                'Calcule o frete para continuar'
              ) : (deliveryType === 'pickup' && !shippingCalculated) ? (
                'Confirme a retirada para continuar'
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
