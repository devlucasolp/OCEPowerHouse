import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../lib/useCart';
import Seo from '../../components/Seo';
import ButtonPrimary from '../../components/ButtonPrimary';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const CheckoutSuccess: NextPage = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const { payment_id, status, external_reference } = router.query;

  useEffect(() => {
    // Limpa o carrinho quando o pagamento é aprovado
    if (status === 'approved') {
      clearCart();
    }
  }, [status, clearCart]);

  return (
    <>
      <Seo
        title="Pagamento Aprovado! | OCE PowerHouse"
        description="Seu pagamento foi processado com sucesso. Obrigado pela sua compra!"
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
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Pagamento Aprovado!
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Obrigado pela sua compra! Seu pedido foi confirmado e você receberá um e-mail com os detalhes em breve.
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
                  <span className="text-green-600 font-medium ml-1">Aprovado</span>
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <ButtonPrimary
              as="a"
              href="/shop"
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Continuar Comprando
            </ButtonPrimary>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Voltar ao Início
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutSuccess; 