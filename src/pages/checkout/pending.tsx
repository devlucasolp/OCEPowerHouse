import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Clock, ShoppingBag, Home, Mail } from 'lucide-react';
import ButtonPrimary from '../../components/ButtonPrimary';
import Seo from '../../components/Seo';

const PendingPage: NextPage = () => {
  return (
    <>
      <Seo
        title="Pagamento Pendente - Power House Brasil"
        description="Seu pagamento está sendo processado. Aguarde a confirmação."
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de pendente */}
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento Pendente
          </h1>

          {/* Descrição */}
          <p className="text-gray-600 mb-6">
            Seu pagamento está sendo processado. Isso pode levar alguns minutos dependendo do método escolhido.
          </p>

          {/* Informações sobre tipos de pagamento */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Tempos de processamento:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• PIX: Aprovação em até 2 horas</li>
              <li>• Boleto: 1-3 dias úteis</li>
              <li>• Cartão: Geralmente instantâneo</li>
              <li>• Débito: Geralmente instantâneo</li>
            </ul>
          </div>

          {/* Próximos passos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">O que fazer agora?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Aguarde a confirmação por email</li>
              <li>• Não refaça o pagamento</li>
              <li>• Guarde o comprovante</li>
              <li>• Acompanhe pelo email</li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="space-y-3">
            <Link href="/shop">
              <ButtonPrimary className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700">
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

          {/* Informações de contato */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
              <Mail className="w-4 h-4" />
              <span>Você receberá atualizações por email</span>
            </div>
            <p className="text-xs text-gray-500">
              Dúvidas? Entre em contato:{' '}
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

export default PendingPage; 