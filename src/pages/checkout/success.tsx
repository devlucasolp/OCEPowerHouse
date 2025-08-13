import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import ButtonPrimary from '../../components/ButtonPrimary';
import Seo from '../../components/Seo';
import { useCart } from '../../lib/useCart';

const SuccessPage: NextPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpar o carrinho após pagamento bem-sucedido
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Seo
        title="Pagamento Aprovado - Power House Brasil"
        description="Seu pagamento foi processado com sucesso. Obrigado pela sua compra!"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de sucesso */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento Aprovado!
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 mb-6">
            Seu pagamento foi processado com sucesso. Você receberá um email de confirmação em breve.
          </p>

          {/* Informações adicionais */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Próximos passos:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Você receberá um email de confirmação</li>
              <li>• Preparação do pedido: 1-2 dias úteis</li>
              <li>• Envio gratuito para todo o Brasil</li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="space-y-3">
            <Link href="/shop">
              <ButtonPrimary className="w-full flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Continuar Comprando
              </ButtonPrimary>
            </Link>
            
            <Link href="/">
              <button className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Voltar ao Início
              </button>
            </Link>
          </div>

          {/* Suporte */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Dúvidas? Entre em contato pelo email:{' '}
              <a href="mailto:contato@powerhousebrasil.com.br" className="text-blue-600 hover:underline">
                contato@powerhousebrasil.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage; 