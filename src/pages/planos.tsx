import React from 'react';
import Seo from '../components/Seo';
import ButtonPrimary from '../components/ButtonPrimary';
import { motion } from 'framer-motion';

const planos = [
  {
    nome: 'Pacote Platinum',
    valor: 'Consulte Disponibilidade',
    treinador: 'Treinamento Customizado com Hugo Prado Neto',
    beneficios: [
      'Ajustes ilimitados do treinamento',
      'Acesso à comunidade OCE no Whatsapp',
      'Análise semanal dos treinos pelo Training Peaks e WKO5',
      'Comunicação ilimitada por whatsapp, telefone ou vídeo chamada',
      'Comunicação ilimitada por e-mail',
      'Direito a todos os descontos e benefícios do nosso KOM de vantagens. (Descontos exclusivos nos PowerCamps, nas principais provas e produtos)',
      'Treino de força personalizado incluso caso necessite',
    ],
  },
  {
    nome: 'Pacote Ultimate',
    valor: 'R$589',
    treinador: 'Treinamento Customizado com João Paulo Calado',
    beneficios: [
      'Ajustes ilimitados do treinamento',
      'Acesso à comunidade OCE no Whatsapp',
      'Análise semanal dos treinos pelo Training Peaks e WKO5',
      'Comunicação ilimitada por whatsapp, telefone ou vídeo chamada',
      'Comunicação ilimitada por e-mail',
      'Direito a todos os descontos e benefícios do nosso KOM de vantagens. (Descontos exclusivos nos PowerCamps, nas principais provas e produtos)',
      'Treino de força personalizado incluso caso necessite',
    ],
  },
  {
    nome: 'Pacote Premium',
    valor: 'R$399',
    treinador: 'Treinamento Customizado com Guilherme Bittencourt',
    beneficios: [
      'Ajustes ilimitados do treinamento',
      'Acesso à comunidade OCE no Whatsapp',
      'Análise semanal dos treinos pelo Training Peaks e WKO5',
      'Comunicação ilimitada por whatsapp, telefone ou vídeo chamada',
      'Comunicação ilimitada por e-mail',
      'Direito a todos os descontos e benefícios do nosso KOM de vantagens. (Descontos exclusivos nos PowerCamps, nas principais provas e produtos)',
      'Treino de força personalizado incluso caso necessite',
    ],
  },
  {
    nome: 'Pacote sem análise',
    valor: 'R$249',
    treinador: 'Treinamento Customizado com coach OCE',
    beneficios: [
      'Ajustes mensais do treinamento',
      'Acesso à comunidade OCE no Whatsapp',
      'Comunicação mensal por whatsapp, telefone ou vídeo chamada',
      'Direito a todos os descontos e benefícios do nosso KOM de vantagens. (Descontos exclusivos nos PowerCamps, nas principais provas e produtos)',
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
        description="Conheça nossos planos de treinamento. Treine com os melhores!"
      />
      <motion.section
        className="max-w-5xl mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 text-center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Treine com os melhores!
        </motion.h1>
        <motion.p
          className="text-lg text-blue-900 mb-10 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Temos o programa de treinamento ideal para você.<br />Valores mensais. Sem contrato.
        </motion.p>
        {/* Botão acima dos cards - só desktop/tablet */}
        <motion.div
          className="hidden md:flex justify-center mb-8"
          whileHover={{ scale: 1.07, y: -4, filter: 'drop-shadow(0 0 16px #FFD600)' }}
          whileFocus={{ scale: 1.07, y: -4, filter: 'drop-shadow(0 0 16px #FFD600)' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeHZ6-v0sRqiRhzzMjAX9iO44u5ae_NpSJAXyaCwy_gdtRhVw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs"
          >
            <ButtonPrimary className="w-full">
              Clique aqui e treine com a OCE!
            </ButtonPrimary>
          </a>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center"
          variants={containerVariants}
        >
          {planos.map((plano, idx) => (
            <motion.div
              key={plano.nome}
              className={
                `relative bg-gradient-to-br from-yellow-50 via-white to-yellow-100 rounded-3xl shadow-2xl p-8 flex flex-col items-center border-0 transition-all duration-300 min-w-[260px] max-w-lg mx-auto overflow-hidden ` +
                `hover:shadow-yellow-300 hover:ring-4 hover:ring-yellow-200 focus:shadow-yellow-300 focus:ring-4 focus:ring-yellow-200 `
              }
              variants={cardVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 16px 48px 0 rgba(255,193,7,0.18)' }}
              whileFocus={{ scale: 1.05, boxShadow: '0 16px 48px 0 rgba(255,193,7,0.18)' }}
              tabIndex={0}
              aria-label={`Card do plano ${plano.nome}`}
            >
              <h2 className="text-2xl font-extrabold text-blue-900 mb-2 text-center drop-shadow-lg tracking-tight uppercase">{plano.nome}</h2>
              <span className="text-4xl font-black text-yellow-500 mb-2 text-center drop-shadow-lg">{plano.valor}</span>
              <span className="text-base font-semibold text-blue-800 mb-4 text-center">{plano.treinador}</span>
              <ul className="mb-6 space-y-2 text-blue-900 text-base text-left w-full max-w-xs mx-auto">
                {plano.beneficios.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 mt-2 rounded-full bg-yellow-400 flex-shrink-0"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {/* Botão só no mobile */}
              <motion.div
                whileHover={{ scale: 1.08, y: -3, filter: 'drop-shadow(0 0 12px #FFD600)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-full flex md:hidden"
              >
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeHZ6-v0sRqiRhzzMjAX9iO44u5ae_NpSJAXyaCwy_gdtRhVw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <ButtonPrimary className="w-full">
                    Clique aqui e treine com a OCE!
                  </ButtonPrimary>
                </a>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        {/* Botão abaixo dos cards - só desktop/tablet */}
        <motion.div
          className="hidden md:flex justify-center mt-10"
          whileHover={{ scale: 1.07, y: -4, filter: 'drop-shadow(0 0 16px #FFD600)' }}
          whileFocus={{ scale: 1.07, y: -4, filter: 'drop-shadow(0 0 16px #FFD600)' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeHZ6-v0sRqiRhzzMjAX9iO44u5ae_NpSJAXyaCwy_gdtRhVw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs"
          >
            <ButtonPrimary className="w-full">
              Clique aqui e treine com a OCE!
            </ButtonPrimary>
          </a>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Planos;
