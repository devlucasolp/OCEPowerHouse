import React from 'react';
import Seo from '../components/Seo';
import { ShieldCheck, Bike, Heart } from 'lucide-react';
import ButtonPrimary from '../components/ButtonPrimary';
import { motion } from 'framer-motion';

const planos = [
  {
    nome: 'Plano Essencial',
    valor: 'R$ 99/mês',
    beneficios: [
      {
        icon: <Bike className="w-5 h-5 mr-2 text-yellow-500" />,
        text: 'Acesso a treinos semanais',
      },
      {
        icon: <Heart className="w-5 h-5 mr-2 text-yellow-500" />,
        text: 'Suporte nutricional básico',
      },
    ],
  },
  {
    nome: 'Plano Performance',
    valor: 'R$ 199/mês',
    beneficios: [
      {
        icon: <Bike className="w-5 h-5 mr-2 text-yellow-500" />,
        text: 'Treinos avançados e personalizados',
      },
      {
        icon: <ShieldCheck className="w-5 h-5 mr-2 text-yellow-500" />,
        text: 'Acompanhamento individual',
      },
      {
        icon: <Heart className="w-5 h-5 mr-2 text-yellow-500" />,
        text: 'Consultas nutricionais mensais',
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Planos = () => {
  return (
    <>
      <Seo
        title="Planos | Power House Brasil"
        description="Conheça nossos planos de saúde e performance para ciclistas. Escolha o ideal para você!"
      />
      <motion.section
        className="max-w-5xl mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-900 mb-4"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Planos
        </motion.h1>
        <motion.p
          className="text-lg text-blue-900 mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Escolha o plano ideal para sua jornada no ciclismo. Todos os planos incluem acesso à
          comunidade Power House Brasil.
        </motion.p>
        <motion.div
          className="flex flex-col md:flex-row gap-8 justify-center"
          variants={containerVariants}
        >
          {planos.map((plano) => (
            <motion.div
              key={plano.nome}
              className="bg-white rounded-2xl shadow-md p-8 flex-1 flex flex-col items-start border border-yellow-100 min-w-[260px] max-w-md mx-auto"
              variants={cardVariants}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              whileFocus={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              tabIndex={0}
              aria-label={`Card do plano ${plano.nome}`}
            >
              <h2 className="text-xl font-semibold text-blue-900 mb-2">{plano.nome}</h2>
              <span className="text-2xl font-bold text-yellow-500 mb-4">{plano.valor}</span>
              <ul className="mb-6 space-y-2">
                {plano.beneficios.map((b, idx) => (
                  <li key={idx} className="flex items-center text-blue-900 text-base">
                    {b.icon}
                    {b.text}
                  </li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <ButtonPrimary className="w-full text-base py-3 rounded-xl" disabled>
                  Assinar (em breve)
                </ButtonPrimary>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </>
  );
};

export default Planos;
