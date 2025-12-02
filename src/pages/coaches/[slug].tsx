import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Seo from '../../components/Seo';
import ButtonPrimary from '../../components/ButtonPrimary';
import { motion } from 'framer-motion';
import { getAllCoaches, getCoachBySlug } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { Award, Users, Calendar, Trophy, GraduationCap, BookOpen, Star, Target, Heart, Flag, Zap } from 'lucide-react';
import { PortableText } from '@portabletext/react';

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
  tituloColuna1?: string;
  tituloColuna2?: string;
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

interface CoachPageProps {
  coach: Coach;
}

const getIcon = (iconName: string) => {
  const iconProps = { className: "w-6 h-6 text-yellow-500 mx-auto" };
  switch (iconName) {
    case 'calendar': return <Calendar {...iconProps} />;
    case 'trophy': return <Trophy {...iconProps} />;
    case 'users': return <Users {...iconProps} />;
    case 'target': return <Target {...iconProps} />;
    case 'star': return <Star {...iconProps} />;
    case 'heart': return <Heart {...iconProps} />;
    case 'zap': return <Zap {...iconProps} />;
    case 'flag': return <Flag {...iconProps} />;
    case 'book-open': return <BookOpen {...iconProps} />;
    case 'graduation-cap': return <GraduationCap {...iconProps} />;
    case 'award': return <Award {...iconProps} />;
    // Fallback para ícones não disponíveis
    case 'medal':
    case 'fire':
    case 'bike':
    case 'timer':
    default: return <Award {...iconProps} />;
  }
};

const getSocialIcon = (plataforma: string) => {
  const platform = plataforma.toLowerCase();
  switch (platform) {
    case 'instagram':
      return <FaInstagram className="w-5 h-5" />;
    case 'linkedin':
      return <FaLinkedin className="w-5 h-5" />;
    case 'twitter':
      return <FaTwitter className="w-5 h-5" />;
    case 'facebook':
      return <FaFacebook className="w-5 h-5" />;
    case 'youtube':
      return <FaYoutube className="w-5 h-5" />;
    default:
      return null;
  }
};

const CoachPage: React.FC<CoachPageProps> = ({ coach }) => {
  return (
    <>
      <Seo 
        title={`${coach.name} | Coach OCE Powerhouse`} 
        description={coach.bioResumo} 
      />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Coach Image */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center lg:justify-center"
              >
                <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={coach.image ? urlFor(coach.image).width(800).height(800).quality(100).url() : '/img/team/default-coach.jpg'}
                    alt={coach.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 320px, 400px"
                    quality={100}
                    priority
                  />
                </div>
              </motion.div>

              {/* Coach Info */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {coach.name}
                </h1>
                <p className="text-xl text-yellow-500 font-semibold mb-6">
                  {coach.role}
                </p>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                  {coach.badges.map((badge, index) => (
                    <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Stats Dinâmicos */}
                {coach.cardsEstatisticas && coach.cardsEstatisticas.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {coach.cardsEstatisticas.map((card, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="mx-auto mb-2">{getIcon(card.icone)}</div>
                        <div className="text-2xl font-bold text-gray-900">{card.numero}</div>
                        <div className="text-sm text-gray-600">{card.subtexto}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Social Media */}
                {coach.redesSociais && coach.redesSociais.length > 0 && (
                  <div className="flex gap-4 justify-center lg:justify-start">
                    {coach.redesSociais.map((rede, index) => (
                      <a
                        key={index}
                        href={rede.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 hover:bg-yellow-100 rounded-full transition-colors duration-300"
                      >
                        {getSocialIcon(rede.plataforma)}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Seções Dinâmicas */}
        {coach.secoesDinamicas && coach.secoesDinamicas.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 space-y-8">
              {coach.secoesDinamicas.map((secao, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  className={`rounded-2xl p-8 ${
                    secao.bordaAmarela 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400' 
                      : 'bg-gray-50'
                  }`}
                >
                  {/* Título da Seção */}
                  <div className="flex items-center mb-6">
                    <div className="mr-3 flex justify-center">{getIcon(secao.icone)}</div>
                    <h2 className="text-2xl font-bold text-gray-800">{secao.titulo}</h2>
                  </div>

                  {/* Conteúdo baseado no tipo */}
                  {secao.tipo === 'texto' && secao.conteudoTexto && (
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <PortableText value={secao.conteudoTexto} />
                    </div>
                  )}

                  {secao.tipo === 'topicos' && secao.topicos && (
                    <ul className="space-y-3">
                      {secao.topicos.map((topico, topicoIndex) => (
                        <li key={topicoIndex} className="flex items-start text-gray-700">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {topico.texto}
                        </li>
                      ))}
                    </ul>
                  )}

                  {secao.tipo === 'topicos-divididos' && (secao.topicos || secao.topicosColuna2) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Primeira Coluna */}
                      {secao.topicos && (
                        <div>
                          {secao.tituloColuna1 && (
                            <h4 className="font-bold text-gray-800 mb-4 text-lg">{secao.tituloColuna1}</h4>
                          )}
                          <ul className="space-y-3">
                            {secao.topicos.map((topico, topicoIndex) => (
                              <li key={topicoIndex} className="flex items-start text-gray-700">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {topico.texto}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Segunda Coluna */}
                      {secao.topicosColuna2 && (
                        <div>
                          {secao.tituloColuna2 && (
                            <h4 className="font-bold text-gray-800 mb-4 text-lg">{secao.tituloColuna2}</h4>
                          )}
                          <ul className="space-y-3">
                            {secao.topicosColuna2.map((topico, topicoIndex) => (
                              <li key={topicoIndex} className="flex items-start text-gray-700">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {topico.texto}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
             </div>
           </section>
         )}

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="rounded-2xl p-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Pronto para treinar com {coach.name.split(' ')[0]}?
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  Entre em contato e comece sua jornada de transformação no ciclismo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <ButtonPrimary 
                      href="https://docs.google.com/forms/d/e/1FAIpQLSeHZ6-v0sRqiRhzzMjAX9iO44u5ae_NpSJAXyaCwy_gdtRhVw/viewform"
                      className="px-8 py-4 text-lg"
                    >
                      Quero Treinar com a OCE
                    </ButtonPrimary>
                    <ButtonPrimary 
                      href="/coaches"
                      className="px-8 py-4 text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-yellow-500"
                    >
                      Ver Outros Coaches
                    </ButtonPrimary>
                  </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const coaches = await getAllCoaches();
    const paths = coaches.map((coach: any) => ({
      params: { slug: coach.slug.current },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating coach paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<CoachPageProps> = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const coach = await getCoachBySlug(slug);

    if (!coach) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        coach,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching coach:', error);
    return {
      notFound: true,
    };
  }
};

export default CoachPage;