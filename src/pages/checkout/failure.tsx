import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { XCircle, ShoppingBag, Home, RotateCcw } from 'lucide-react';
import ButtonPrimary from '../../components/ButtonPrimary';
import Seo from '../../components/Seo';

const FailurePage: NextPage = () => {
  return (
    <>
      <Seo
        title="Pagamento Recusado - Power House Brasil"
        description="Houve um problema com seu pagamento. Tente novamente ou use outro método."
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de falha */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento Recusado
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 mb-6">
            Infelizmente, não foi possível processar seu pagamento. Isso pode acontecer por diversos motivos.
          </p>

          {/* Motivos possíveis */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">Possíveis motivos:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Dados do cartão incorretos</li>
              <li>• Limite insuficiente</li>
              <li>• Cartão bloqueado ou vencido</li>
              <li>• Problema na conexão</li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="space-y-3">
            <Link href="/checkout">
              <ButtonPrimary className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700">
                <RotateCcw className="w-4 h-4" />
                Tentar Novamente
              </ButtonPrimary>
            </Link>
            
            <Link href="/shop">
              <button className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Continuar Comprando
              </button>
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
              Precisa de ajuda? Entre em contato:{' '}
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

export default FailurePage; 