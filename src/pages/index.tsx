import React from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import Seo from '../components/Seo';
import ButtonPrimary from '../components/ButtonPrimary';
import Link from 'next/link';
import { motion } from 'framer-motion';

const benefitCardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring' as const } },
  whileHover: { scale: 1.06, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)' },
};

const sectionFade = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, type: 'spring' as const } },
};

const Home: NextPage = () => {
  return (
    <>
      <Seo
        title="OCE Powerhouse | Somos campeões do mundo!"
        description="A OCE Powerhouse é referência em aulas personalizadas de ciclismo, saúde e performance. Conheça nossa história."
      />
      {/* Hero com foto do Hugo e frase impactante */}
      <motion.section
        className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-lg mb-12"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: 'spring' }}
      >
        <Image
          src="/img/static/hero.jpg"
          alt="OCE Powerhouse - Campeões do mundo"
          fill
          className="object-cover object-center absolute inset-0 z-0 rounded-2xl"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60 z-10 rounded-2xl" aria-hidden="true" />
        <motion.div
          className="relative z-20 w-full max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-lg mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, type: 'spring' }}
          >
            Somos campeões do mundo!
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-white mb-4 max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, type: 'spring' }}
          >
            A OCE Powerhouse é referência em ciclismo, saúde e performance. Venha fazer parte dessa
            comunidade campeã!
          </motion.p>
        </motion.div>
      </motion.section>
      {/* Benefícios/Diferenciais */}
      <motion.section
        className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 px-4"
        variants={sectionFade}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        {[
          {
            title: 'Aulas Personalizadas',
            desc: 'Treinos sob medida para cada aluno, com acompanhamento individual dos coaches.',
            img: '/img/static/logo.png',
          },
          {
            title: 'Coaches Campeões',
            desc: 'Equipe formada por atletas e treinadores premiados, referência no ciclismo nacional e internacional.',
            img: '/img/static/logo.png',
          },
          {
            title: 'Comunidade Exclusiva',
            desc: 'Faça parte de uma rede de ciclistas apaixonados, eventos, desafios e networking.',
            img: '/img/static/logo.png',
          },
          {
            title: 'Resultados Reais',
            desc: 'Transforme sua saúde, performance e qualidade de vida com acompanhamento profissional.',
            img: '/img/static/logo.png',
          },
        ].map((b, i) => (
          <motion.div
            key={b.title}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-yellow-100 cursor-pointer"
            variants={benefitCardVariants}
            whileHover="whileHover"
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 * i, duration: 0.7, type: 'spring' }}
          >
            <Image src={b.img} alt={b.title} width={48} height={48} className="mb-2" />
            <h3 className="text-lg font-bold text-primary mb-2">{b.title}</h3>
            <p className="text-neutral-700 text-sm">{b.desc}</p>
          </motion.div>
        ))}
      </motion.section>
      {/* Apresentação da OCE Powerhouse */}
      <motion.section
        className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 bg-white rounded-2xl shadow-md p-8 md:p-16 mb-12"
        variants={sectionFade}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="flex-1 flex flex-col items-start justify-center mb-8 md:mb-0"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Como funciona a OCE Powerhouse?
          </h2>
          <p className="text-base md:text-lg text-foreground/90 mb-2 max-w-lg">
            Nossos coaches são especialistas em ciclismo e oferecem aulas personalizadas para todos
            os níveis. O acompanhamento é feito por planos, com foco em evolução, saúde e
            performance. Aqui, você encontra uma comunidade que valoriza o esporte e a transformação
            de vidas.
          </p>
        </motion.div>
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          viewport={{ once: true }}
        >
          <Image
            src="/img/team/DSCF8250.JPG"
            alt="Equipe OCE Powerhouse"
            width={400}
            height={400}
            className="rounded-xl shadow-lg object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        </motion.div>
      </motion.section>
      {/* Vídeo de apresentação */}
      <motion.section
        className="w-full flex flex-col items-center justify-center mb-12"
        variants={sectionFade}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          Conheça a OCE Powerhouse
        </h2>
        <motion.div
          className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          viewport={{ once: true }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/SEU_VIDEO_ID_AQUI"
            title="Apresentação OCE Powerhouse"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </motion.div>
      </motion.section>
      {/* Depoimentos */}
      <motion.section
        className="w-full max-w-6xl mx-auto mb-16 px-4"
        variants={sectionFade}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
          O que dizem nossos alunos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Lucas M.',
              img: '/img/team/67361170.jpg',
              text: '“A OCE Powerhouse mudou minha vida no ciclismo. Evoluí muito com o acompanhamento dos coaches!”',
            },
            {
              name: 'Marina O.',
              img: '/img/team/67384541.jpg',
              text: '“A comunidade é incrível, os eventos são motivadores e o suporte é diferenciado.”',
            },
            {
              name: 'Fernanda S.',
              img: '/img/team/DSCF8965.JPG',
              text: '“Os planos são acessíveis e realmente entregam resultado. Recomendo para todos que querem evoluir!”',
            },
          ].map((d, i) => (
            <motion.div
              key={d.name}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-yellow-100"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.7, type: 'spring' }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
            >
              <Image
                src={d.img}
                alt={d.name}
                width={56}
                height={56}
                className="mb-2 rounded-full object-cover"
              />
              <p className="text-neutral-700 italic mb-2">{d.text}</p>
              <span className="text-primary font-semibold">{d.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>
      {/* Chamada para Blog */}
      <motion.section
        className="w-full max-w-6xl mx-auto mb-16 px-4 flex flex-col items-center"
        variants={sectionFade}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
          Conteúdo para ciclistas
        </h2>
        <p className="text-neutral-700 mb-6 text-center max-w-2xl">
          Confira dicas, notícias e novidades no nosso blog. Informação de qualidade para quem quer
          pedalar mais e melhor!
        </p>
        <Link href="/blog">
          <ButtonPrimary className="text-base px-8 py-3 rounded-xl">Acessar Blog</ButtonPrimary>
        </Link>
      </motion.section>
      {/* Chamada para Powercamps */}
      <motion.section
        className="w-full max-w-6xl mx-auto mb-16 px-4 flex flex-col items-center"
        variants={sectionFade}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
          Powercamps Anuais
        </h2>
        <p className="text-neutral-700 mb-6 text-center max-w-2xl">
          Participe dos nossos eventos exclusivos, com experiências imersivas, treinos, workshops e
          integração entre ciclistas, coaches e convidados especiais.
        </p>
        <Link href="/powercamps">
          <ButtonPrimary className="text-base px-8 py-3 rounded-xl">
            Saiba mais sobre os Powercamps
          </ButtonPrimary>
        </Link>
      </motion.section>
      {/* Parceiros/Patrocinadores */}
      <motion.section
        className="w-full max-w-6xl mx-auto mb-20 px-4 flex flex-col items-center"
        variants={sectionFade}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
          Nossos Parceiros
        </h2>
        <div className="flex flex-wrap gap-8 items-center justify-center">
          <a
            href="https://alquimiadasaude.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Image
              src="/img/static/logo.png"
              alt="Alquimia da Saúde"
              width={64}
              height={64}
              className="rounded-full bg-white p-2"
            />
            <span className="text-primary font-semibold">Alquimia da Saúde</span>
          </a>
        </div>
      </motion.section>
      {/* CTA para Planos */}
      <motion.section
        className="w-full flex flex-col items-center justify-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <ButtonPrimary as="a" href="/planos" className="text-lg px-8 py-4 rounded-xl shadow-lg">
          Conheça nossos planos
        </ButtonPrimary>
      </motion.section>
    </>
  );
};

export default Home;
