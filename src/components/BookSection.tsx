import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ButtonPrimary from './ButtonPrimary';
import { BookOpen, Star, Users, Download } from 'lucide-react';

const BookSection = () => {
  const sectionFade = {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -8, scale: 1.02 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const
    }
  };

  return (
    <motion.section
      className="py-24 px-6 bg-white overflow-hidden relative"
      variants={sectionFade}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, gray 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Conteúdo do Livro */}
          <motion.div
            className="space-y-8"
            variants={sectionFade}
          >
            <div>
              <motion.div
                className="w-8 h-1 bg-yellow-400 mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
              
              <motion.div
                className="inline-flex items-center bg-yellow-400/20 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Lançamento Exclusivo
              </motion.div>

              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-yellow-600">Segredos da</span>
                <br />
                Performance Elite
              </motion.h2>

              <motion.p
                className="text-lg text-gray-800 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
              Descubra a superação e a profundidade por trás do método vencedor de Hugo Prado Neto.
              O campeão mundial de MTB Marathon 
              compartilha sua jornada de TDAH à conquista do pódio, combinando neurociência, 
              psicologia, alimentação e gestão emocional no poderoso “Fator H”. 
              </motion.p>

              {/* Features do Livro */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div
                  className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                >
                  <Star className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">+200 páginas</span>
                </motion.div>
                
                <motion.div
                  className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4"
                  variants={cardVariants}
                >
                  <Users className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Casos reais</span>
                </motion.div>
              </motion.div>

              {/* Preço e CTA */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl font-bold text-green-600">R$ 80,00</span>
                  <span className="text-lg text-gray-500 line-through">R$ 149,90</span>
                  <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    47% OFF
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <ButtonPrimary
                    href="https://powerhousebrasil.com.br/shop/livro-o-protocolo-hugo-prado-neto"
                    target="_self"
                    className="bg-black-400 text-black hover:bg-yellow-500 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Adquirir o Livro
                  </ButtonPrimary>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Imagem do Livro */}
          <motion.div
            className="relative order-first lg:order-last"
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative max-w-md mx-auto">             
              
              {/* Container do livro */}
              <div className="relative">
                <motion.div
                  className="relative rounded-2xl"
                  animate={floatingAnimation}
                  whileHover={{ rotateY: 5, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Imagem real do livro */}
                  <div className="aspect-[3/4] relative">
                    <Image
                      src="/img/book/livro.png"
                      alt="Segredos da Performance Elite - Livro"
                      fill
                      className="object-cover rounded-2xl"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  
                </motion.div>
                
                {/* Sombra do livro */}
                <div className="absolute -bottom-8 left-4 right-4 h-8 bg-black/20 rounded-full blur-xl bottom-2" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default BookSection;
