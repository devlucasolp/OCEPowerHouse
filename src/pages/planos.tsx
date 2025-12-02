import React from 'react';
import Image from 'next/image';
import { Check, Star, Target, Zap, Trophy, Book, Video, Users, Phone, Dumbbell, Bike, Shield, Signal, MessageCircle, Mail, Heart } from 'lucide-react';
import Seo from '../components/Seo';
import { motion } from 'framer-motion';
import { getAllPlans } from '../lib/sanity';
import { GetStaticProps } from 'next';
import { urlFor } from '../lib/sanityImage';

interface Beneficio {
  texto: string;
  icone: string;
}

interface Plan {
  _id: string;
  nome: string;
  slug: {
    current: string;
  };
  valor: string;
  valorNumerico: number;
  coach: string;
  descricao?: string;
  beneficios: Beneficio[];
  imagemPlano?: any;
  corDestaque: string;
  planoDestaque: boolean;
  linkCompra?: string;
  textoButton: string;
  ordem: number;
  ativo: boolean;
  mostrarTituloCoach?: boolean;
}

interface PlanosProps {
  planos: Plan[];
}

const getIconComponent = (iconName: string) => {
  // Cor amarela OCE para todos os ícones
  const oceYellow = "#FFD700";
  
  const iconMap: { [key: string]: React.ReactNode } = {
    check: <Check className="w-5 h-5" style={{ color: oceYellow }} />,
    star: <Star className="w-5 h-5" style={{ color: oceYellow }} />,
    target: <Target className="w-5 h-5" style={{ color: oceYellow }} />,
    muscle: <Dumbbell className="w-5 h-5" style={{ color: oceYellow }} />,
    trophy: <Trophy className="w-5 h-5" style={{ color: oceYellow }} />,
    book: <Book className="w-5 h-5" style={{ color: oceYellow }} />,
    video: <Video className="w-5 h-5" style={{ color: oceYellow }} />,
    group: <Users className="w-5 h-5" style={{ color: oceYellow }} />,
    support: <Phone className="w-5 h-5" style={{ color: oceYellow }} />,
    lightning: <Zap className="w-5 h-5" style={{ color: oceYellow }} />,
    bike: <Bike className="w-5 h-5" style={{ color: oceYellow }} />,
    shield: <Shield className="w-5 h-5" style={{ color: oceYellow }} />,
    team: <Users className="w-5 h-5" style={{ color: oceYellow }} />,
    signal: <Signal className="w-5 h-5" style={{ color: oceYellow }} />,
    chat: <MessageCircle className="w-5 h-5" style={{ color: oceYellow }} />,
    mail: <Mail className="w-5 h-5" style={{ color: oceYellow }} />,
    heart: <Heart className="w-5 h-5" style={{ color: oceYellow }} />,
    dumbbell: <Dumbbell className="w-5 h-5" style={{ color: oceYellow }} />,
  };
  
  return iconMap[iconName] || <Check className="w-5 h-5" style={{ color: oceYellow }} />
};

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Planos: React.FC<PlanosProps> = ({ planos }) => {
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
          {planos.map((plano, index) => (
            <motion.div key={plano.nome} className={`bg-white rounded-xl shadow-md p-0 flex flex-col items-start border border-yellow-100 w-full max-w-md mx-auto ${plano.planoDestaque ? 'ring-2 ring-yellow-400 relative' : ''}`} variants={cardVariants} whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }} whileFocus={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }} tabIndex={0} aria-label={`Card do plano ${plano.nome}`}>
              <div className="w-full">
                <div className="text-center p-2">
                  {plano.mostrarTituloCoach !== false && (
                    <h3 className="text-lg font-semibold">Coach</h3>
                  )}
                  {plano.mostrarTituloCoach === false && (
                    <div className="h-7"></div>
                  )}
                  <p className="text-xl font-bold">{plano.coach}</p>
                  {plano.descricao && (
                    <p className="text-gray-500 text-sm mt-2">{plano.descricao}</p>
                  )}
                </div>
              </div>
              <div className="p-4 w-full">
              {plano.planoDestaque && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    MAIS POPULAR
                  </span>
                </div>
              )}
              <h2 className="text-xl font-semibold text-blue-900 mb-1 text-center">{plano.nome}</h2>
              <div className="text-center mb-3">
                <span className="text-2xl font-bold" style={{ color: plano.corDestaque }}>{plano.valor}</span>
              </div>
              <div className="flex justify-center mb-4">
                {plano.imagemPlano ? (
                  <Image 
                    src={urlFor(plano.imagemPlano).url()} 
                    alt={plano.imagemPlano.alt || `Imagem do plano ${plano.nome}`} 
                    width={280}
                    height={80}
                    className="object-contain" 
                    priority
                  />
                ) : (
                  <Image 
                    src={plano.nome === 'Pacote sem análise' ? "/img/static/Trainingpeaks.png" : "/img/static/headerplanos.png"} 
                    alt="Header do plano" 
                    width={280}
                    height={80}
                    className="object-contain" 
                    priority
                  />
                )}
              </div>
              <ul className="mb-4 space-y-2">
                {plano.beneficios.map((beneficio, beneficioIndex) => (
                  <li key={beneficioIndex} className="flex items-start text-blue-900 text-sm">
                    <div className="mr-3 mt-0.5">
                      {getIconComponent(beneficio.icone)}
                    </div>
                    <span className="text-gray-700">{beneficio.texto}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center items-center p-5 mx-5">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="w-full  items-center max-w-[200px]">
                  {plano.linkCompra ? (
                    <a 
                      href={plano.linkCompra}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center font-bold py-3 px-6 rounded-xl transition-colors duration-300"
                      style={{ 
                        backgroundColor: plano.corDestaque,
                        color: plano.corDestaque === '#000000' ? '#fff' : (plano.corDestaque === '#FCD34D' ? '#000' : '#fff')
                      }}
                    >
                      {plano.textoButton}
                    </a>
                  ) : (
                    <button 
                      className="w-full font-bold py-3 px-6 rounded-xl transition-colors duration-300"
                      style={{ 
                        backgroundColor: plano.corDestaque,
                        color: plano.corDestaque === '#000000' ? '#fff' : (plano.corDestaque === '#FCD34D' ? '#000' : '#fff')
                      }}
                    >
                      {plano.textoButton}
                    </button>
                  )}
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

export const getStaticProps: GetStaticProps<PlanosProps> = async () => {
  try {
    const planos = await getAllPlans();
    
    return {
      props: {
        planos,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching plans:', error);
    
    return {
      props: {
        planos: [],
      },
      revalidate: 60,
    };
  }
};

export default Planos;