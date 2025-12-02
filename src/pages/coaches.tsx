import React from 'react';
import Seo from '../components/Seo';
import Image from 'next/image';
import ButtonPrimary from '../components/ButtonPrimary';
import { motion } from 'framer-motion';
import { GetStaticProps } from 'next';
import { getAllCoaches } from '../lib/sanity';
import { urlFor } from '../lib/sanityImage';

interface RedeSocial {
  plataforma: string;
  url: string;
}

interface CardEstatistica {
  icone: string;
  numero: string;
  subtexto: string;
}

interface SecaoDinamica {
  tipo: 'texto' | 'topicos' | 'topicos-divididos';
  titulo: string;
  icone: string;
  bordaAmarela: boolean;
  conteudoTexto?: any[];
  topicos?: { texto: string }[];
  topicosColuna2?: { texto: string }[];
}

interface Coach {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  role: string;
  image: any;
  bioResumo: string;

  cardsEstatisticas: CardEstatistica[];
  badges: string[];
  secoesDinamicas: SecaoDinamica[];
  linkPersonalizado?: string;
  redesSociais: RedeSocial[];
  ordem: number;
  ativo: boolean;
  destaque: boolean;
}

interface CoachesProps {
  coaches: Coach[];
}



const Coaches: React.FC<CoachesProps> = ({ coaches }) => {
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
            <div key={coach._id} className={`bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 ${coach.destaque ? 'ring-2 ring-yellow-400 relative' : ''}`}>
              {coach.destaque && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    DESTAQUE
                  </span>
                </div>
              )}
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={coach.image ? urlFor(coach.image).width(256).height(256).quality(100).url() : '/img/team/default-coach.jpg'}
                  alt={coach.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                  quality={100}
                />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">{coach.name}</h2>
              <span className="text-yellow-500 font-medium mb-3">{coach.role}</span>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{coach.bioResumo}</p>
              <ButtonPrimary href={coach.linkPersonalizado || `/coaches/${coach.slug.current}`} className="mt-auto">
                Ver Perfil
              </ButtonPrimary>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="hover:scale-105 transition-transform duration-200">
            <ButtonPrimary href="https://docs.google.com/forms/d/e/1FAIpQLSeHZ6-v0sRqiRhzzMjAX9iO44u5ae_NpSJAXyaCwy_gdtRhVw/viewform" className="text-lg px-8 py-4 rounded-xl shadow-lg">
              Clique aqui e treine com a OCE!
            </ButtonPrimary>
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps<CoachesProps> = async () => {
  try {
    const coaches = await getAllCoaches();
    
    return {
      props: {
        coaches,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching coaches:', error);
    
    return {
      props: {
        coaches: [],
      },
      revalidate: 60,
    };
  }
};

export default Coaches;