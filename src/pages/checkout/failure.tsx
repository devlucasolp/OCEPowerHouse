import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Seo from '../../components/Seo';
import ButtonPrimary from '../../components/ButtonPrimary';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const CheckoutFailure: NextPage = () => {
  const router = useRouter();
  const { payment_id, status, external_reference } = router.query;

  return (
    <>
      <Seo
        title="Pagamento Não Aprovado | OCE PowerHouse"
        description="Houve um problema com seu pagamento. Tente novamente."
      />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-12 h-12 text-red-600" />
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Pagamento Não Aprovado
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Houve um problema ao processar seu pagamento. Isso pode acontecer por vários motivos, como dados incorretos ou limite insuficiente.
          </motion.p>

          {payment_id && (
            <motion.div
              className="bg-gray-50 rounded-lg p-4 mb-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Detalhes da Tentativa:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">ID da Tentativa:</span> {payment_id}</p>
                {external_reference && (
                  <p><span className="font-medium">Pedido:</span> {external_reference}</p>
                )}
                <p><span className="font-medium">Status:</span> 
                  <span className="text-red-600 font-medium ml-1">Não Aprovado</span>
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            className="bg-blue-50 rounded-lg p-4 mb-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Dicas para tentar novamente:</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Verifique os dados do cartão</li>
              <li>• Confirme se há limite disponível</li>
              <li>• Tente outro método de pagamento</li>
              <li>• Entre em contato com seu banco</li>
            </ul>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <ButtonPrimary
              as="a"
              href="/checkout"
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </ButtonPrimary>

            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar à Loja
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutFailure; 