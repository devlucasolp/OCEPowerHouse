import React from 'react';
import Seo from '../components/Seo';
import Image from 'next/image';
import { sanityClient } from '../lib/sanity';
import { GetStaticProps } from 'next';
import { motion } from 'framer-motion';

interface Powercamp {
  _id: string;
  title: string;
  slug: { current: string };
  image?: any;
  date?: string;
  description?: string;
  year?: number;
}

interface PowerCampsProps {
  powercamps: Powercamp[];
}

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PowerCamps = ({ powercamps }: PowerCampsProps) => {
  return (
    <>
      <Seo
        title="PowerCamps | Power House Brasil"
        description="Conheça nossos PowerCamps: experiências exclusivas para ciclistas que buscam performance, saúde e comunidade."
      />
      <motion.section
        className="max-w-4xl mx-auto px-4 py-12"
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
          PowerCamps
        </motion.h1>
        <motion.p
          className="text-lg text-blue-900 mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Nossos PowerCamps são experiências imersivas para ciclistas de todos os níveis, focadas em
          saúde, performance, aprendizado e conexão. Veja os eventos anuais abaixo!
        </motion.p>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={containerVariants}>
          {powercamps.length === 0 && (
            <motion.div
              className="col-span-full text-center text-blue-900 font-semibold py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Nenhum Powercamp cadastrado ainda.
            </motion.div>
          )}
          {powercamps.map((camp) => (
            <motion.div
              key={camp._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-start"
              variants={cardVariants}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              whileFocus={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              tabIndex={0}
              aria-label={`Card do powercamp ${camp.title}`}
            >
              <span className="text-yellow-500 text-2xl font-bold mb-2">{camp.year || ''}</span>
              <h2 className="text-xl font-semibold text-blue-900 mb-2">{camp.title}</h2>
              {camp.image && (
                <motion.div
                  className="relative w-full aspect-video rounded-xl overflow-hidden mb-4"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                >
                  <Image
                    src={camp.image.asset?.url || ''}
                    alt={camp.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              )}
              <p className="text-blue-900 mb-2">{camp.description}</p>
              {camp.date && (
                <span className="text-neutral-500 text-sm">
                  {new Date(camp.date).toLocaleDateString('pt-BR')}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const powercamps = await sanityClient.fetch(
    `*[_type == "powercamp"] | order(year desc, date desc)[0...5] {
      _id,
      title,
      slug,
      image,
      date,
      description,
      year
    }`,
  );
  return {
    props: { powercamps },
    revalidate: 60,
  };
};

export default PowerCamps;
