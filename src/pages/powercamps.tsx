import React from 'react';
import Seo from '../components/Seo';
import Image from 'next/image';
import { sanityClient } from '../lib/sanity';
import { GetStaticProps } from 'next';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import type { TypedObject } from 'sanity';

interface Powercamp {
  _id: string;
  title: string;
  slug: { current: string };
  image?: any;
  date?: string;
  description?: TypedObject[];
  year?: number;
  location?: string;
  registrationLink?: string;
}

interface PowerCampsProps {
  powercamps: Powercamp[];
}

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
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
          className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 text-center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          PowerCamps
        </motion.h1>
        <motion.p
          className="text-lg text-blue-900 mb-10 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Nossos PowerCamps são experiências imersivas para ciclistas de todos os níveis, focadas em
          saúde, performance, aprendizado e conexão. Veja os eventos anuais abaixo!
        </motion.p>
        <div className="flex flex-col gap-16">
          {powercamps.length === 0 && (
            <div className="text-center text-blue-900 font-semibold py-12">
              Nenhum Powercamp cadastrado ainda.
            </div>
          )}
          {powercamps.map((camp) => {
            console.log('Imagem do Powercamp:', camp.image);
            return (
              <section
                key={camp._id}
                className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden max-w-3xl mx-auto w-full"
              >
                {camp.image && (
                  <div className="relative w-full h-64 md:h-96">
                    <Image
                      src={camp.image.asset?.url || ''}
                      alt={camp.image.alt || camp.title}
                      fill
                      className="object-cover object-center"
                      sizes="100vw"
                      priority
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col items-center text-center">
                  <span className="text-yellow-500 text-2xl font-bold mb-2">{camp.year || ''}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">{camp.title}</h2>
                  {camp.date && (
                    <span className="text-neutral-500 text-base mb-2 block">
                      {new Date(camp.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                  {camp.location && (
                    <span className="text-neutral-700 text-base mb-2 block">{camp.location}</span>
                  )}
                  <div className="prose prose-lg text-blue-900 mb-2 w-full max-w-none">
                    {camp.description && <PortableText value={camp.description} />}
                  </div>
                  {camp.registrationLink && (
                    <a
                      href={camp.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-4 rounded-xl shadow-lg transition-all"
                    >
                      Participar do Powercamp
                    </a>
                  )}
                </div>
              </section>
            );
          })}
        </div>
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
      year,
      location,
      registrationLink
    }`,
  );
  return {
    props: { powercamps },
    revalidate: 60,
  };
};

export default PowerCamps;
