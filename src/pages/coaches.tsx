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
  return (
    <>
      <Seo title="Coaches | OCE Powerhouse" description="Conheça os coaches especialistas em treinamento esportivo de resistência da OCE Powerhouse." />
      <section className="max-w-5xl mx-auto px-4 py-12 pt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
          Coaches OCE Powerhouse
        </h1>
        <p className="text-lg text-[#1a1a1a] mb-10 max-w-2xl">
          Conheça nossos coaches especialistas, prontos para transformar sua jornada no ciclismo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {coaches.map((coach) => (
            <div key={coach.name} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={coach.image}
                  alt={coach.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">{coach.name}</h2>
              <span className="text-yellow-500 font-medium mb-3">{coach.role}</span>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{coach.bio}</p>
              <ButtonPrimary href={coach.link} className="mt-auto">
                Ver Perfil
              </ButtonPrimary>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="hover:scale-105 transition-transform duration-200">
            <ButtonPrimary href="mailto:contato@powerhousebrasil.com.br" className="text-lg px-8 py-4 rounded-xl shadow-lg">
              Clique aqui e treine com a OCE!
            </ButtonPrimary>
          </div>
        </div>
      </section>
    </>
  );
};

export default Coaches; 