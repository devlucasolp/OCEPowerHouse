import Seo from '../components/Seo';
import Image from 'next/image';

const CoachGuilhermeBitencourt = () => (
  <>
    <Seo
      title="Coach Guilherme Bitencourt | OCE Powerhouse"
      description="Perfil completo do coach Guilherme Bitencourt, especialista em biomecânica e endurance."
    />
    <section className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center">
      <Image
        src="/img/team/Guilherme Perfil.jpg"
        alt="Guilherme Bitencourt"
        width={320}
        height={426}
        className="rounded-3xl shadow-xl mb-6 object-cover"
        style={{ objectPosition: 'center top' }}
      />
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2 text-center">
        Guilherme Bitencourt
      </h1>
      <span className="text-yellow-500 font-semibold mb-4 uppercase tracking-wide text-center">
        Coach Master
      </span>
      <p className="text-neutral-700 text-lg mb-6 text-center max-w-2xl">
        Coach master OCE, formado em Educação Física com duas pós-graduações: Biomecânica e
        Endurance. Apaixonado pela profissão, sempre em busca de especialização. Conheceu a bike aos
        25 anos e desde então compete em maratonas (XCM) e Pan-Americanos, focado em evolução nas
        maiores provas do país. Pronto para ajudar você a atingir seus objetivos.
      </p>
      {/* Espaço para mais informações detalhadas, depoimentos, conquistas, etc. */}
    </section>
  </>
);

export default CoachGuilhermeBitencourt;
