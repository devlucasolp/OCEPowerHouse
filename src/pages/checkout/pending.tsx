import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Seo from '../../components/Seo';
import ButtonPrimary from '../../components/ButtonPrimary';
import { motion } from 'framer-motion';
import { Clock, Mail, ArrowLeft } from 'lucide-react';

const CheckoutPending: NextPage = () => {
  const router = useRouter();
  const { payment_id, status, external_reference } = router.query;

  return (
    <>
      <Seo
        title="Pagamento Pendente | OCE PowerHouse"
        description="Seu pagamento está sendo processado. Aguarde a confirmação."
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
            className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Clock className="w-12 h-12 text-yellow-600" />
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Pagamento Pendente
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Seu pagamento está sendo processado. Isso pode levar alguns minutos para ser confirmado pelo banco.
          </motion.p>

          {payment_id && (
            <motion.div
              className="bg-gray-50 rounded-lg p-4 mb-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Detalhes do Pagamento:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">ID do Pagamento:</span> {payment_id}</p>
                {external_reference && (
                  <p><span className="font-medium">Pedido:</span> {external_reference}</p>
                )}
                <p><span className="font-medium">Status:</span> 
                  <span className="text-yellow-600 font-medium ml-1">Processando</span>
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
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800 mb-1">Você será notificado</h3>
                <p className="text-sm text-blue-700">
                  Assim que o pagamento for confirmado, você receberá um e-mail com todos os detalhes do seu pedido.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <ButtonPrimary
              as="a"
              href="/shop"
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Continuar Comprando
            </ButtonPrimary>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Link>
          </motion.div>

          <motion.div
            className="mt-6 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-xs text-gray-500">
              Guarde o número do seu pedido para acompanhamento futuro
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutPending; 