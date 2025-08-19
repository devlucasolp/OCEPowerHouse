import React from 'react';
import Seo from '../components/Seo';
import { ShieldCheck, Bike, Heart, MessageCircle, Mail, Users, BarChart, Dumbbell } from 'lucide-react';
import ButtonPrimary from '../components/ButtonPrimary';
import { motion } from 'framer-motion';
import Image from 'next/image';

const planos = [
  {
    nome: 'Pacote sem análise',
    valor: 'R$ 249/mês',
    coach: 'Treinamento Customizado com coach OCE',
    beneficios: [
      { icon: <Bike className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Treinamento Customizado com coach OCE' },
      { icon: <ShieldCheck className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Ajustes mensais do treinamento' },
      { icon: <Users className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Acesso à comunidade OCE no Whatsapp' },
      { icon: <MessageCircle className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Comunicação mensal por whatsapp, telefone ou vídeo chamada' },
      { icon: <Heart className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Direito a todos os descontos e benefícios do nosso KOM de vantagens. (Descontos exclusivos nos PowerCamps, nas principais provas e produtos)' },
    ],
  },
  {
    nome: 'Plano Premium',
    valor: 'R$ 399/mês',
    coach: 'Guilherme Bittencourt',
    beneficios: [
      { icon: <Bike className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Treinamento Customizado com Guilherme Bittencourt' },
      { icon: <ShieldCheck className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Ajustes ilimitados do treinamento' },
      { icon: <Users className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Acesso à comunidade OCE no Whatsapp' },
      { icon: <BarChart className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Análise semanal dos treinos pelo Training Peaks e WKO5' },
      { icon: <MessageCircle className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Comunicação ilimitada por whatsapp, telefone ou vídeo chamada' },
      { icon: <Mail className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Comunicação ilimitada por e-mail' },
      { icon: <Heart className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Direito a todos os descontos e benefícios do nosso KOM de vantagens. (Descontos exclusivos nos PowerCamps, nas principais provas e produtos)' },
      { icon: <Dumbbell className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Treino de força personalizado incluso caso necessite' },
    ],
  },
  {
    nome: 'Plano Ultimate',
    valor: 'R$ 589/mês',
    coach: 'João Paulo Calado',
    beneficios: [
      { icon: <Bike className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Treinamento Customizado com João Paulo Calado' },
      { icon: <ShieldCheck className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Ajustes ilimitados do treinamento' },
      { icon: <Users className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Acesso à comunidade OCE no Whatsapp' },
      { icon: <BarChart className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Análise semanal dos treinos pelo Training Peaks e WKO5' },
      { icon: <MessageCircle className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Comunicação ilimitada por whatsapp, telefone ou vídeo chamada' },
      { icon: <Mail className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Comunicação ilimitada por e-mail' },
      { icon: <Heart className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Direito a todos os descontos e benefícios do nosso KOM de vantagens. (Descontos exclusivos nos PowerCamps, nas principais provas e produtos)' },
      { icon: <Dumbbell className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Treino de força personalizado incluso caso necessite' },
    ],
  },
  {
    nome: 'Plano Platinum',
    valor: 'Sob Consulta',
    coach: 'Hugo Prado Neto',
    beneficios: [
      { icon: <Bike className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Treinamento Customizado com Hugo Prado Neto' },
      { icon: <ShieldCheck className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Ajustes ilimitados do treinamento' },
      { icon: <Users className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Acesso à comunidade OCE no Whatsapp' },
      { icon: <BarChart className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Análise semanal dos treinos pelo Training Peaks e WKO5' },
      { icon: <MessageCircle className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Comunicação ilimitada por whatsapp, telefone ou vídeo chamada' },
      { icon: <Mail className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Comunicação ilimitada por e-mail' },
      { icon: <Heart className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Direito a todos os descontos e benefícios do nosso KOM de vantagens. (Descontos exclusivos nos PowerCamps, nas principais provas e produtos)' },
      { icon: <Dumbbell className="w-5 h-5 mr-2 text-yellow-500" />, text: 'Treino de força personalizado incluso caso necessite' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Planos = () => {
  return (
    <>
      <Seo title="Planos | Power House Brasil" description="Conheça nossos planos de saúde e performance para ciclistas. Escolha o ideal para você!" />
      <motion.section
        className="max-w-5xl mx-auto px-4 py-12 pt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], when: 'beforeChildren', staggerChildren: 0.12 }}
      >
        <motion.h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Planos
        </motion.h1>
        <motion.p className="text-lg text-[#1a1a1a] mb-10 max-w-2xl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          Escolha o plano ideal para sua jornada no ciclismo. Todos os planos incluem acesso à comunidade OCE.
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto" 
          variants={containerVariants}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], when: 'beforeChildren', staggerChildren: 0.12 }}
        >
          {planos.map((plano) => (
            <motion.div key={plano.nome} className="bg-white rounded-xl shadow-md p-0 flex flex-col items-start border border-yellow-100 w-full max-w-md mx-auto" variants={cardVariants} whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }} whileFocus={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }} tabIndex={0} aria-label={`Card do plano ${plano.nome}`}>
              <div className="w-full">
                <div className="text-center p-2">
                  <h3 className="text-lg font-semibold">Coach</h3>
                  <p className="text-xl font-bold">{plano.coach}</p>
                </div>
              </div>
              <div className="p-4 w-full">
              <h2 className="text-xl font-semibold text-blue-900 mb-1 text-center">{plano.nome}</h2>
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-yellow-500">{plano.valor}</span>
              </div>
              <div className="flex justify-center mb-4">
                <Image 
                  src={plano.nome === 'Pacote sem análise' ? "/img/static/Trainingpeaks.png" : "/img/static/headerplanos.png"} 
                  alt="Header do plano" 
                  width={280}
                  height={80}
                  className="object-contain" 
                  priority
                />
              </div>
              <ul className="mb-4 space-y-2">
                {plano.beneficios.map((b, idx) => (
                  <li key={idx} className="flex items-start text-blue-900 text-sm">
                    <span className="mt-0.5 flex-shrink-0 text-yellow-500">{b.icon}</span>
                    <span className="ml-2">{b.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center items-center p-5 mx-5">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="w-full  items-center max-w-[200px]">
                  <ButtonPrimary className="w-full text-base py-3 rounded-xl" href="https://docs.google.com/forms/d/e/1FAIpQLSeHZ6-v0sRqiRhzzMjAX9iO44u5ae_NpSJAXyaCwy_gdtRhVw/viewform" target="_blank">
                    Treine com a OCE
                  </ButtonPrimary>
                </motion.div>
              </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </>
  );
};

export default Planos;