import React from 'react';
import Seo from '../components/Seo';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { sanityClient } from '../lib/sanity';
import { getImageUrl } from '../lib/sanityImage';
import { PortableText } from '@portabletext/react';

interface PowerCamp {
  _id: string;
  title: string;
  description?: any[]; // blockContent array
  date: string;
  location?: string;
  year?: number;
  featured?: boolean;
  registrationLink?: string;
  image?: {
    _type: string;
    alt?: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  slug?: {
    current: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
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
      <Seo title="PowerCamps | Power House Brasil"
           description="Conheça nossos PowerCamps: experiências exclusivas para ciclistas que buscam performance, saúde e comunidade." />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              PowerCamps
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experiências exclusivas para ciclistas que buscam performance, saúde e comunidade.
            </p>
          </motion.div>

          {loading ? (
            <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Carregando PowerCamps...
            </motion.div>
          ) : camps.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 gap-8 max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {camps.map((camp) => {
                // Usar dimensões otimizadas para melhor qualidade e proporção
                const imageUrl = getImageUrl(camp.image, 1200, 675);
                
                return (
                  <motion.div 
                    key={camp._id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02] border border-gray-100 h-full"
                    variants={cardVariants} 
                    tabIndex={0} 
                    aria-label={`Card do powercamp ${camp.title}`}
                  >
                    {/* Imagem com proporção otimizada */}
                    {imageUrl ? (
                      <div className="relative w-full aspect-[16/9]">
                        <Image
                          src={imageUrl}
                          alt={camp.image?.alt || camp.title}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          priority={false}
                          quality={95}
                        />
                        
                        {/* Badge de destaque sobre a imagem */}
                        {camp.featured && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm bg-opacity-90">
                            ⭐ Destaque
                          </div>
                        )}
                        
                        {/* Overlay gradiente para melhor legibilidade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/9] bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center border-b border-blue-300 relative">
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <span className="text-blue-800 text-lg font-semibold">PowerCamp</span>
                          <p className="text-blue-700 text-sm mt-1">Imagem em breve</p>
                        </div>
                        
                        {camp.featured && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            ⭐ Destaque
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="px-8 py-8 flex flex-col flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 leading-tight">{camp.title}</h2>
                      
                      {camp.description && camp.description.length > 0 && (
                        <div className="text-gray-700 mb-6 flex-1 text-lg leading-relaxed prose prose-lg max-w-none">
                          <PortableText value={camp.description} />
                        </div>
                      )}

                      <div className="space-y-4 mb-8">
                        {camp.date && (
                          <div className="flex items-center text-gray-600 text-lg bg-gray-50 p-3 rounded-lg">
                            <CalendarDays className="h-6 w-6 mr-3 text-yellow-500" />
                            <span className="font-medium">
                              {new Date(camp.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                        
                        {camp.location && (
                          <div className="flex items-center text-gray-600 text-lg bg-gray-50 p-3 rounded-lg">
                            <MapPin className="h-6 w-6 mr-3 text-yellow-500" />
                            <span className="font-medium">{camp.location}</span>
                          </div>
                        )}
                      </div>

                      {camp.registrationLink && (
                        <a
                          href={camp.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl font-bold hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Inscrever-se Agora
                          <ExternalLink className="ml-3 h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-gray-400 mb-4">
                <CalendarDays className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum PowerCamp disponível
              </h3>
              <p className="text-gray-600">
                Novos eventos serão anunciados em breve. Fique atento às nossas redes sociais!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  try {
    const camps = await sanityClient.fetch(
      `*[_type == "powercamp"] | order(order asc, date desc) {
        _id,
        title,
        description,
        date,
        location,
        year,
        featured,
        registrationLink,
        slug,
        order,
        image {
          _type,
          asset {
            _ref,
            _type
          },
          alt
        }
      }`
    );

    // Filtrar dados válidos
    const validCamps = camps.filter((camp: any) => {
      if (!camp._id || !camp.title) {
        return false;
      }
      
      // Se tem imagem inválida, remover mas manter o camp
      if (camp.image && camp.image.asset && (!camp.image.asset._ref || camp.image.asset._ref.trim() === '')) {
        camp.image = null;
      }
      
      return true;
    });

    return {
      props: {
        camps: validCamps || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar PowerCamps:', error);
    return {
      props: {
        camps: [],
      },
      revalidate: 60,
    };
  }
}

export default PowerCamps;