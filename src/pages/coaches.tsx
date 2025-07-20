import React from 'react';
import Seo from '../components/Seo';
import Image from 'next/image';
import ButtonPrimary from '../components/ButtonPrimary';
import { motion } from 'framer-motion';

const coaches = [
  {
    name: 'Hugo Prado Neto',
    role: 'Fundador & Coach World Class',
    image: '/img/team/Hugo Perfil.jpg',
    bio: 'Fundador e coach World Class da OCE há 25 anos. Atual Campeão Mundial Masters de Maratona MTB, atleta com 3 décadas de experiência. Compete em Mountain Bike, Ciclismo de Estrada e, em breve, Gravel. Treino favorito: longos de 4 horas, onde a aptidão física e mental sobressai. Atualmente focado em provas longas como Brasil Ride 2024 e Cape Epic 2025.',
    link: '/coach-hugo-prado',
  },
  {
    name: 'João Paulo Calado',
    role: 'Coach World Class',
    image: '/img/team/João Perfil.jpg',
    bio: 'Formado em Educação Física pela PUC Minas, coach World Class da OCE desde 2014. Iniciou no mountain bike em 2002, com destaque no XCO e participação em provas nacionais e Pan-Americanos. Hoje, pratica ciclismo de estrada e maratonas, buscando performance em todos os âmbitos: família, esporte e trabalho. Pronto para te ajudar a superar seus limites.',
    link: '/coach-joao-paulo',
  },
  {
    name: 'Guilherme Bitencourt',
    role: 'Coach Master Class',
    image: '/img/team/Guilherme Perfil.jpg',
    bio: 'Coach master OCE, formado em Educação Física com duas pós-graduações: Biomecânica e Endurance. Apaixonado pela profissão, sempre em busca de especialização. Conheceu a bike aos 25 anos e desde então compete em maratonas (XCM) e Pan-Americanos, focado em evolução nas maiores provas do país. Pronto para ajudar você a atingir seus objetivos.',
    link: '/coach-guilherme-bitencourt',
  },
];

const Coaches = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Seo
        title="Coaches | OCE Powerhouse"
        description="Conheça os coaches especialistas em treinamento esportivo de resistência da OCE Powerhouse."
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
          Quem são os coaches
        </motion.h1>
        <motion.p
          className="text-lg text-blue-900 mb-6 max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Especialistas em treinamento esportivo de resistência, prontos para ajudar você a atingir
          seus objetivos.
          <br />
          Somos apaixonados pelo lifestyle do esporte, onde teoria e prática fazem parte da nossa
          rotina diária. Vamos juntos alcançar sua melhor performance, com saúde e longevidade!
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12"
          variants={containerVariants}
        >
          {coaches.map((coach) => (
            <motion.div
              key={coach.name}
              className="bg-white rounded-3xl shadow-xl p-0 flex flex-col items-center text-center border-2 border-yellow-400 hover:scale-105 transition-transform duration-300"
              variants={cardVariants}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              whileFocus={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              tabIndex={0}
              aria-label={`Card do coach ${coach.name}`}
            >
              <div className="w-full h-[340px] relative rounded-t-3xl overflow-hidden">
                <Image
                  src={coach.image}
                  alt={coach.name}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="rounded-t-3xl"
                  priority
                />
              </div>
              <div className="flex-1 flex flex-col items-center justify-between px-6 py-6">
                <h2 className="text-xl font-bold text-blue-900 mb-1">{coach.name}</h2>
                <span className="text-yellow-500 font-semibold mb-3 uppercase tracking-wide">
                  {coach.role}
                </span>
                <p className="text-neutral-700 text-base mb-2 leading-relaxed">{coach.bio}</p>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <ButtonPrimary
                    as="a"
                    href={coach.link}
                    className="mt-2 text-base px-6 py-2 rounded-xl shadow-md"
                  >
                    Ver perfil completo
                  </ButtonPrimary>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex flex-col items-center justify-center mb-8">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <ButtonPrimary
              as="a"
              href="mailto:contato@powerhousebrasil.com.br"
              className="text-lg px-8 py-4 rounded-xl shadow-lg"
            >
              Clique aqui e treine com a OCE!
            </ButtonPrimary>
          </motion.div>
        </div>
        <motion.div
          className="bg-yellow-100 rounded-2xl p-6 text-center text-blue-900 font-medium max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <p className="mb-2">
            Por mais de 20 anos, a OCE desenvolve treinamentos e treinadores de classe mundial.
            Nossos coaches trabalham com iniciantes, amadores, profissionais, campeões nacionais e
            mundiais. Treinam, competem, escrevem livros, apresentam-se em congressos e muito mais.
          </p>
          <p>
            Todos os treinadores da OCE passaram por um rigoroso processo de formação e seguem a
            mesma filosofia baseada em ciência, refinada e comprovada por mais de 20 anos.
          </p>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Coaches;
