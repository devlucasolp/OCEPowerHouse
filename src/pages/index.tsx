import React from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import Seo from '../components/Seo';
import ButtonPrimary from '../components/ButtonPrimary';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideCart from '../components/SideCart';

const cardVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  whileHover: { y: -8 },
};

const sectionFade = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home: NextPage = () => {
  return (
    <div className="relative">
      <Seo
        title="OCE Powerhouse | Somos campeões do mundo!"
        description="A OCE Powerhouse é referência em aulas personalizadas de ciclismo, saúde e performance. Conheça nossa história."
      />
      
      <Header />
      
      {/* Hero com background fixo */}
      <section
        className="fixed top-0 left-0 w-full h-screen z-0"
        style={{
          backgroundImage: "url('/img/static/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center', // Desktop
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Versão mobile com controle de posicionamento */}
        <div className="md:hidden absolute inset-0">
          <Image
            src="/img/static/hero.jpg"
            alt="OCE Powerhouse - Campeões do mundo"
            fill
            className="object-cover object-center md:object-top lg:object-center"
            priority
            sizes="100vw"
            style={{
              objectPosition: 'center 50%' // Ajuste personalizado para mobile
            }}
          />
        </div>
        {/* Overlay com título principal */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70 flex items-center justify-center">
          <motion.div
            className="text-center text-white z-10 px-6 max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            >
              Somos
              <br />
              <span className="text-yellow-400 italic font-light">campeões</span>
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl font-light">do mundo</span>
            </motion.h1>
            
            <motion.div
              className="w-16 h-1 bg-yellow-400 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            />
            
            <motion.p
              className="text-xl md:text-2xl font-light leading-relaxed opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
            >
              Transformando atletas através de metodologia científica
              <br className="hidden md:block" />
              e excelência comprovada mundialmente
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Spacer para dar altura inicial igual ao viewport */}
      <div className="h-screen w-full relative z-10"></div>

      {/* Main content - Desliza por cima do hero fixo */}
      <motion.main
        className="relative bg-white z-20 min-h-screen"
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        transition={{ 
          delay: 1.4, 
          duration: 1.8, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -20px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Seção de introdução */}
        <motion.section
          className="pt-20 pb-24 px-6"
          variants={sectionFade}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="w-12 h-1 bg-yellow-400 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            />
            
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.8, ease: "easeOut" }}
            >
              Junte-se à nossa
              <br />
              <span className="font-bold text-black">comunidade de campeões</span>
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.8, ease: "easeOut" }}
            >
              Metodologia científica personalizada que transforma paixão em resultados extraordinários através de tecnologia avançada e acompanhamento personalizado.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.8, duration: 0.6, ease: "easeOut" }}
            >
              <ButtonPrimary 
                as="a" 
                href="/planos" 
                className="bg-black text-white hover:bg-gray-900 transition-all duration-300 px-10 py-4 text-lg font-medium shadow-xl rounded-full border-0"
              >
                Descobrir planos
              </ButtonPrimary>
            </motion.div>
          </div>
        </motion.section>

        {/* Benefícios/Diferenciais */}
        <motion.section
          className="py-24 px-6 bg-gray-50"
          variants={sectionFade}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Por que somos <span className="font-bold">diferentes</span>
              </h3>
              <div className="w-8 h-1 bg-yellow-400 mx-auto"></div>
            </div>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div
                className="group bg-white p-8 text-center border border-gray-100 hover:border-yellow-400/30 transition-all duration-300"
                variants={cardVariants}
                whileHover="whileHover"
              >
                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-400/20 transition-colors">
                  <span className="text-3xl">🏆</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Resultados Mundiais</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Metodologia validada por conquistas em competições internacionais de alto nível</p>
              </motion.div>
              
              <motion.div
                className="group bg-white p-8 text-center border border-gray-100 hover:border-yellow-400/30 transition-all duration-300"
                variants={cardVariants}
                whileHover="whileHover"
              >
                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-400/20 transition-colors">
                  <span className="text-3xl">🧪</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ciência Aplicada</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Planos individuais com base científica comprovada. </p>
              </motion.div>
              
              <motion.div
                className="group bg-white p-8 text-center border border-gray-100 hover:border-yellow-400/30 transition-all duration-300"
                variants={cardVariants}
                whileHover="whileHover"
              >
                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-400/20 transition-colors">
                  <span className="text-3xl">📊</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Tecnologia Integrada</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Plataforma digital para monitoramento e análise de performance</p>
              </motion.div>
              
              <motion.div
                className="group bg-white p-8 text-center border border-gray-100 hover:border-yellow-400/30 transition-all duration-300"
                variants={cardVariants}
                whileHover="whileHover"
              >
                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-400/20 transition-colors">
                  <span className="text-3xl">🤝</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Comunidade Elite</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Networking exclusivo com atletas de diversos níveis e profissionais especializados</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* História - Redesigned */}
        <motion.section
          className="py-24 px-6"
          variants={sectionFade}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-8 h-1 bg-yellow-400 mb-8"></div>
              <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 leading-tight">
                Nossa <span className="font-bold">história</span>
              </h3>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Fundada por <strong className="text-gray-900">Hugo Prado Neto</strong>, campeão mundial de mountain bike, 
                  a OCE Power house nasceu da busca incansável pela excelência no esporte.
                </p>
                <p>
                  Combinamos décadas de experiência competitiva com os mais recentes avanços em 
                  ciência do esporte e tecnologia de análise de performance.
                </p>
                <p>
                  Hoje, somos reconhecidos mundialmente por transformar atletas amadores em 
                  campeões, sempre mantendo o foco em proporcionar alta performance com longevidade.
                </p>
              </div>
              <div className="mt-10">
                <Link 
                  href="/about" 
                  className="inline-flex items-center text-black font-medium hover:text-yellow-600 transition-colors group"
                >
                  Conhecer nossa jornada
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl transform rotate-3"></div>
                <Image
                  src="/img/static/logo.jpg"
                  alt="OCE Powerhouse"
                  width={600}
                  height={400}
                  className="relative rounded-2xl shadow-2xl w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Depoimentos - Simplified */}
        <motion.section
          className="py-24 px-6 bg-gray-50"
          variants={sectionFade}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-8 h-1 bg-yellow-400 mx-auto mb-8"></div>
            <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-16">
              O que nossos <span className="font-bold">atletas</span> dizem
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                className="text-left"
                variants={cardVariants}
              >
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                  "A metodologia da OCE mudou completamente minha abordagem ao treinamento. 
                  Os resultados foram além de todas as minhas expectativas."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-black">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Marina Santos</h4>
                    <p className="text-sm text-gray-600">Ciclista Competitiva</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="text-left"
                variants={cardVariants}
              >
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                  "O acompanhamento científico e a atenção aos detalhes fazem toda a diferença. 
                  É treinamento de outro nível."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold text-black">R</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Roberto Silva</h4>
                    <p className="text-sm text-gray-600">Triatleta Profissional</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
        <Footer />
      </motion.main>
      <SideCart />
    </div>
  );
};

export default Home;
