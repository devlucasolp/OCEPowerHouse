import React from 'react';
import Seo from '../components/Seo';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { sanityClient } from '../lib/sanity';
import { getImageUrl } from '../lib/sanityImage';
import { getDescriptionText, truncateText } from '../lib/textUtils';

interface PowerCamp {
  _id: string;
  title: string;
  description?: string | any; // Can be string or Sanity rich text blocks
  date: string;
  location?: string;
  year?: number;
  featured?: boolean;
  registrationLink?: string;
  image?: any;
  slug?: {
    current: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PowerCamps = ({ camps: staticCamps }: { camps: PowerCamp[] }) => {
  const [camps, setCamps] = React.useState<PowerCamp[]>(staticCamps || []);
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <Seo title="PowerCamps | Power House Brasil" description="Conheça nossos PowerCamps: experiências exclusivas para ciclistas que buscam performance, saúde e comunidade." />
      <motion.section
        className="max-w-5xl mx-auto px-4 py-12 pt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], when: 'beforeChildren', staggerChildren: 0.12 }}
      >
        <motion.h1 className="text-3xl md:text-4xl font-bold text-black mb-4" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          PowerCamps
        </motion.h1>
        <motion.p className="text-lg text-[#1a1a1a] mb-10 max-w-2xl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          Experiências exclusivas que combinam treino, natureza e comunidade para ciclistas apaixonados.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <motion.div className="col-span-full text-center text-black font-semibold py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              Carregando PowerCamps...
            </motion.div>
          ) : camps.length > 0 ? (
            camps.map((camp) => {
              const imageUrl = camp.image ? getImageUrl(camp.image, 400, 300) : null;
              const descriptionText = camp.description ? getDescriptionText(camp.description) : '';
              const shortDescription = descriptionText ? truncateText(descriptionText, 150) : '';
              
              return (
                <motion.div 
                  key={camp._id} 
                  className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
                  variants={cardVariants} 
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }} 
                  whileFocus={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }} 
                  tabIndex={0} 
                  aria-label={`Card do powercamp ${camp.title}`}
                >
                  {imageUrl && (
                    <motion.div 
                      className="relative w-full aspect-video overflow-hidden"
                      initial={{ opacity: 0, scale: 0.96 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ duration: 0.7 }}
                    >
                      <Image
                        src={imageUrl}
                        alt={camp.image?.alt || camp.title}
                        fill
                        className="object-cover"
                      />
                      {camp.featured && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Destaque
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold text-blue-900 mb-2">{camp.title}</h2>
                    
                    {shortDescription && (
                      <p className="text-neutral-600 mb-4 flex-1 leading-relaxed">{shortDescription}</p>
                    )}
                    
                    <div className="space-y-3 text-sm text-neutral-500 mb-4">
                      <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{new Date(camp.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                      
                      {camp.location && (
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{camp.location}</span>
                        </div>
                      )}
                      
                      {camp.year && (
                        <div className="text-xs text-neutral-400">
                          Edição {camp.year}
                        </div>
                      )}
                    </div>
                    
                    {camp.registrationLink && (
                      <a
                        href={camp.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group"
                      >
                        <span>Fazer Inscrição</span>
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div className="col-span-full text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🏕️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Nenhum PowerCamp disponível
                </h3>
                <p className="text-gray-600 mb-6">
                  Nossos próximos eventos estão sendo preparados. Fique ligado nas nossas redes sociais para não perder as novidades!
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="#" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📱 Instagram
                  </a>
                  <a 
                    href="#" 
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    📧 Newsletter
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </>
  );
};

export async function getStaticProps() {
  try {
    // Usar cliente com perspective 'published' para pegar apenas conteúdo publicado
    const publishedClient = sanityClient.clone().config({ perspective: 'published' });
    
    const camps = await publishedClient.fetch(
      `*[_type == "powercamp"] | order(date desc) {
        _id,
        title,
        description,
        date,
        location,
        year,
        featured,
        registrationLink,
        slug,
        image {
          _type,
          alt,
          asset -> {
            _id,
            _ref,
            url
          }
        }
      }`
    );

    console.log('PowerCamps fetched:', camps);

    return {
      props: {
        camps: camps || [],
      },
      revalidate: 60, // Revalida a cada 60 segundos
    };
  } catch (error) {
    console.error('Erro ao buscar PowerCamps:', error);
    return {
      props: {
        camps: [],
      },
      revalidate: 60,
    };
  }
}

export default PowerCamps; 