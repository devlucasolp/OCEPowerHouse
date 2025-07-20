import Seo from '../components/Seo';
import Image from 'next/image';

const CoachHugoPrado = () => (
  <>
    <Seo
      title="Coach Hugo Prado Neto | OCE Powerhouse"
      description="Perfil completo do coach Hugo Prado Neto, fundador e campeão mundial."
    />
    <section className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center">
      <Image
        src="/img/team/Hugo Perfil.jpg"
        alt="Hugo Prado Neto"
        width={320}
        height={426}
        className="rounded-3xl shadow-xl mb-6 object-cover"
        style={{ objectPosition: 'center top' }}
      />
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2 text-center">
        Hugo Prado Neto
      </h1>
      <span className="text-yellow-500 font-semibold mb-4 uppercase tracking-wide text-center">
        Fundador & Coach World Class
      </span>
      <div className="w-full bg-yellow-100 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-2 uppercase tracking-wide">
          Coach Level: World Class
        </h2>
        <h3 className="text-lg font-semibold text-blue-900 mb-1 mt-4">Formação Acadêmica</h3>
        <p className="text-neutral-800 mb-2">
          Bachelors Degree em Exercise and Sports Sciences (Ciências do Exercício e dos Esportes)
          com ênfase em fisiologia do exercício pela Universidade da Flórida, College of Health and
          Human Performance.
        </p>
        <ul className="list-disc pl-6 text-neutral-800 mb-2">
          <li>Graduado com Honra (GPA 3.82/4.0), entre os melhores 10% da turma.</li>
          <li>International Students Award (2000) — Destaque entre estudantes internacionais.</li>
          <li>President’s Honor Roll (2000 e 2002) — Nota máxima (GPA 4.0) em dois semestres.</li>
          <li>
            Thomas F. Hayes Memorial Undergraduate Scholarship (2001) — Melhor ciclista/estudante da
            Universidade da Flórida.
          </li>
          <li>
            Membro da Golden Key Society — Sociedade de excelência acadêmica (apenas convidados).
          </li>
        </ul>
        <h3 className="text-lg font-semibold text-blue-900 mb-1 mt-4">Certificações</h3>
        <ul className="list-disc pl-6 text-neutral-800 mb-2">
          <li>Certificação de técnico de triathlon pelo USA Triathlon</li>
          <li>Certificação de técnico de ciclismo pelo USA Cycling</li>
          <li>
            Graduado pela CTS Coaching College (empresa líder mundial em treinamento esportivo)
          </li>
          <li>Curso de análise de treinos POWER COACH (Suíça, 2009)</li>
          <li>Certificado do Curso Internacional de Eletroterapia-Compex (2010)</li>
        </ul>
        <h3 className="text-lg font-semibold text-blue-900 mb-1 mt-4">Carreira como Atleta</h3>
        <p className="text-neutral-800 mb-2">
          Hugo já foi atleta profissional de Triathlon, Ciclismo no Brasil e no exterior e
          atualmente é atleta profissional de mountain bike figurando entre os melhores do país. Já
          competiu em mais de 500 competições, com destaque nacional e internacional. Subiu da
          categoria 5 para a PRO 1 nos EUA em apenas 2 anos (2001-2002). No Brasil, fez parte de
          times profissionais e é referência em provas de etapas de MTB.
        </p>
        <h3 className="text-lg font-semibold text-blue-900 mb-1 mt-4">
          Principais Resultados Profissionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="list-disc pl-6 text-neutral-800 mb-2">
            <li>
              <b>2011</b> — Campeão do Six (6hrs de MTB)
            </li>
            <li>
              <b>2010</b> — Melhor dupla brasileira da história do Absa Cape Epic (África do Sul)
            </li>
            <li>Campeão X-Terra MTB Teresópolis</li>
            <li>Vice-Campeão Geral Big Biker Cup</li>
            <li>Vice-Campeão Onça do Pitangui</li>
            <li>Vice-Campeão Big Biker Cup #3</li>
            <li>3º lugar Big Biker #4</li>
            <li>3º lugar X-Terra Tiradentes-MG</li>
            <li>5º lugar Copa Internacional de MTB #2</li>
            <li>Participação na Gran Raid Suíça (2010)</li>
            <li>
              <b>2009</b> — Campeão Big Biker Cup (1ª e 4ª etapa)
            </li>
            <li>Campeão Desafio Monavie Iron Biker Brasil</li>
            <li>Vice-Campeão Iron Biker Brasil</li>
            <li>3º lugar Brasileiro de Maratona</li>
            <li>3º lugar Cerapió</li>
            <li>6º lugar Iron Bike Itália</li>
            <li>Campeão Onça do Pitangui</li>
            <li>Campeão Maratona Serra do Cipó</li>
          </ul>
          <ul className="list-disc pl-6 text-neutral-800 mb-2">
            <li>
              <b>2008</b> — 4º no ranking brasileiro (até Julho/08)
            </li>
            <li>Campeão do 5hrs de MTB de BH</li>
            <li>Campeão da Copa Cipó de MTB</li>
            <li>Vice-Campeão da Copa Ale Inconfidentes de MTB (1ª etapa)</li>
            <li>Vice-Campeão Copa Sul Minas (2ª etapa)</li>
            <li>3º colocado no Power Biker</li>
            <li>3º colocado Peugeot Trip Trail</li>
            <li>6º colocado na 1ª seletiva para os Jogos Olímpicos</li>
            <li>
              <b>2007</b> — Campeão 12 hrs de MTB SOLO
            </li>
            <li>Campeão do Big Biker Cup (3ª Etapa)</li>
            <li>Vice-Campeão Gruyere Cycling, Suíça</li>
            <li>Vice-Campeão Big Biker Cup</li>
            <li>3º no Desafio Red Bull de Maratona/Copa Internacional</li>
            <li>3º GP Itabirito de Ciclismo</li>
            <li>
              <b>2006</b> — 3º lugar Iron Bike Itália (único latino-americano no pódio)
            </li>
          </ul>
        </div>
      </div>
    </section>
  </>
);

export default CoachHugoPrado;
