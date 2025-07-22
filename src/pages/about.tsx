import React from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import Seo from '../components/Seo';
import { motion, type Variants } from 'framer-motion';

const equipe = [
  {
    nome: 'Ana Silva',
    cargo: 'Fundadora & CEO',
    foto: '/img/team/ana.jpg',
  },
  {
    nome: 'Carlos Souza',
    cargo: 'CTO & Engenheiro de Produto',
    foto: '/img/team/carlos.jpg',
  },
  {
    nome: 'Marina Oliveira',
    cargo: 'Marketing & Comunidade',
    foto: '/img/team/marina.jpg',
  },
  {
    nome: 'João Pereira',
    cargo: 'Designer & UX',
    foto: '/img/team/joao.jpg',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
    },
  },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const About: NextPage = () => {
  return (
    <>
      <Seo
        title="Sobre a Power House Brasil"
        description="Conheça a história, missão e equipe da Power House Brasil, referência em ciclismo urbano."
      />
      <motion.section
        className="max-w-4xl mx-auto py-12 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Sobre a Power House Brasil
        </motion.h1>
        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
          <motion.div
            className="flex-1 text-lg text-neutral-700"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="mb-4">
              A <span className="font-bold text-blue-700">Power House Brasil</span> nasceu da paixão
              pelo ciclismo urbano e do desejo de transformar cidades em lugares mais humanos,
              sustentáveis e conectados. Somos uma comunidade, uma loja e um hub de conteúdo para
              quem acredita que a bicicleta é mais do que um meio de transporte: é um estilo de
              vida.
            </p>
            <p>
              Nosso propósito é apoiar ciclistas urbanos com produtos de qualidade, informação
              relevante e iniciativas que promovam a mobilidade ativa. Acreditamos em inovação,
              sustentabilidade e no poder da coletividade para mudar realidades.
            </p>
          </motion.div>
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/img/about1.jpg"
              alt="Equipe Power House Brasil pedalando na cidade"
              width={400}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </motion.div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
          <motion.div
            className="flex-1 flex justify-center order-2 md:order-1"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Image
              src="/img/about2.jpg"
              alt="Loja e comunidade Power House Brasil"
              width={400}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </motion.div>
          <motion.div
            className="flex-1 text-lg text-neutral-700 order-1 md:order-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p>
              Mais do que vender produtos, queremos inspirar pessoas a pedalar, compartilhar
              experiências e construir juntos uma cidade melhor. Seja bem-vindo à Power House
              Brasil!
            </p>
          </motion.div>
        </div>
      </motion.section>
      {/* Equipe */}
      <motion.section
        className="bg-neutral-50 py-12 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Nosso Time
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {equipe.map((membro) => (
              <motion.div
                key={membro.nome}
                className="flex flex-col items-center bg-white rounded-lg shadow p-6 text-center"
                variants={cardVariants}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                whileFocus={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                tabIndex={0}
                aria-label={`Card do membro ${membro.nome}`}
              >
                <div className="relative w-28 h-28 mb-3">
                  <Image
                    src={membro.foto}
                    alt={membro.nome}
                    fill
                    className="object-cover rounded-full border-4 border-blue-100"
                    sizes="112px"
                  />
                </div>
                <span className="font-bold text-lg">{membro.nome}</span>
                <span className="text-blue-700 text-sm">{membro.cargo}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

export default About;
