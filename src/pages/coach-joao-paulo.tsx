import Seo from '../components/Seo';
import Image from 'next/image';

const CoachJoaoPaulo = () => (
  <>
    <Seo
      title="Coach João Paulo Calado | OCE Powerhouse"
      description="Perfil completo do coach João Paulo Calado, especialista em mountain bike e ciclismo de estrada."
    />
    <section className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center">
      <Image
        src="/img/team/João Perfil.jpg"
        alt="João Paulo Calado"
        width={320}
        height={426}
        className="rounded-3xl shadow-xl mb-6 object-cover"
        style={{ objectPosition: 'center top' }}
      />
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2 text-center">
        João Paulo Calado
      </h1>
      <span className="text-yellow-500 font-semibold mb-4 uppercase tracking-wide text-center">
        Coach World Class
      </span>
      <p className="text-neutral-700 text-lg mb-6 text-center max-w-2xl">
        Formado em Educação Física pela PUC Minas, coach World Class da OCE desde 2014. Iniciou no
        mountain bike em 2002, com destaque no XCO e participação em provas nacionais e
        Pan-Americanos. Hoje, pratica ciclismo de estrada e maratonas, buscando performance em todos
        os âmbitos: família, esporte e trabalho. Pronto para te ajudar a superar seus limites.
      </p>
      {/* Espaço para mais informações detalhadas, depoimentos, conquistas, etc. */}
    </section>
  </>
);

export default CoachJoaoPaulo;
