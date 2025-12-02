// Script para migrar dados dos coaches do site antigo para o Sanity
// Execute com: node migrate_coaches_data.js

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN2,
  useCdn: false,
  apiVersion: '2023-05-03'
});

// Dados exatos do Guilherme Bitencourt do site antigo
const guilhermeData = {
  _type: 'coach',
  name: 'Guilherme Bitencourt',
  slug: {
    _type: 'slug',
    current: 'coach-guilherme-bitencourt'
  },
  role: 'Coach Master Class',
  bio: 'Coach Master Class na OCE desde 2023, formado em Educação Física com duas pós-graduações em Biomecânica e Endurance. Apaixonado pela profissão e sempre em busca de especialização contínua. Iniciou no ciclismo aos 17 anos e desde então compete em maratonas (XCM) e Campeonatos Pan-Americanos, focado na evolução constante nas principais provas do país.',
  bioCompleta: [
    {
      _type: 'block',
      _key: 'bio1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'Coach Master Class na OCE desde 2023, formado em Educação Física com duas pós-graduações em Biomecânica e Endurance. Apaixonado pela profissão e sempre em busca de especialização contínua. Iniciou no ciclismo aos 17 anos e desde então compete em maratonas (XCM) e Campeonatos Pan-Americanos, focado na evolução constante nas principais provas do país.'
        }
      ]
    }
  ],
  cardsEstatisticas: [
    {
      _key: 'card1',
      icone: 'calendar',
      numero: '3+',
      subtexto: 'Anos OCE'
    },
    {
      _key: 'card2',
      icone: 'trophy',
      numero: '200+',
      subtexto: 'Competições'
    },
    {
      _key: 'card3',
      icone: 'users',
      numero: '50+',
      subtexto: 'Atletas'
    }
  ],
  badges: ['Biomecânica', 'Endurance', 'Pan-Americano'],
  secoesDinamicas: [
    {
      _key: 'secao1',
      tipo: 'topicos-divididos',
      titulo: 'Formação & Especialidades',
      icone: 'graduation-cap',
      bordaAmarela: false,
      tituloColuna1: 'Formação Acadêmica',
      tituloColuna2: 'Especialidades',
      topicos: [
        { _key: 'top1', texto: 'Biomecânica voltada ao exercício físico' },
        { _key: 'top2', texto: 'Endurance do baixo ao alto rendimento' },
        { _key: 'top3', texto: 'Conheceu a bike aos 17 anos' }
      ],
      topicosColuna2: [
        { _key: 'top4', texto: 'Especialista em recovery manual, instrumental e ventosaterapia' },
        { _key: 'top5', texto: 'Maratonas (XCM)' },
        { _key: 'top6', texto: 'Ultra maratonas' }
      ]
    },
    {
      _key: 'secao2',
      tipo: 'texto',
      titulo: 'Filosofia de Trabalho',
      icone: 'trophy',
      bordaAmarela: true,
      conteudoTexto: [
        {
          _type: 'block',
          _key: 'filosofia1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'Comprometido com a excelência e evolução contínua, Guilherme combina conhecimento técnico avançado com paixão pelo ciclismo. Sua abordagem integra biomecânica, fisiologia e psicologia esportiva para ajudar atletas a superarem seus limites e alcançarem seus objetivos nas principais competições do país.'
            }
          ]
        }
      ]
    }
  ],
  ordem: 2,
  ativo: true,
  destaque: false
};

// Dados exatos do Hugo Prado do site antigo
const hugoData = {
  _type: 'coach',
  name: 'Hugo Prado Neto',
  slug: {
    _type: 'slug',
    current: 'coach-hugo-prado'
  },
  role: 'Fundador & Coach World Class',
  bio: 'Fundador da OCE Powerhouse há 25 anos, Hugo é formado em Exercise and Sports Sciences pela Universidade da Flórida com ênfase em fisiologia do exercício. Atual Campeão Mundial Masters de Maratona MTB, possui 3 décadas de experiência competitiva em Mountain Bike, Ciclismo de Estrada e Gravel. Graduado com honra (GPA 3.82/4.0) e certificado pelas principais instituições mundiais de treinamento esportivo. É também escritor e faz parte do conselho da Alquimia da Saúde, a marca mais clean label do Brasil.',
  bioCompleta: [
    {
      _type: 'block',
      _key: 'bio1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'Fundador da OCE Powerhouse há 25 anos, Hugo é formado em Exercise and Sports Sciences pela Universidade da Flórida com ênfase em fisiologia do exercício. Atual Campeão Mundial Masters de Maratona MTB, possui 3 décadas de experiência competitiva em Mountain Bike, Ciclismo de Estrada e Gravel. Graduado com honra (GPA 3.82/4.0) e certificado pelas principais instituições mundiais de treinamento esportivo. É também escritor e faz parte do conselho da Alquimia da Saúde, a marca mais clean label do Brasil.'
        }
      ]
    }
  ],
  cardsEstatisticas: [
    {
      _key: 'card1',
      icone: 'calendar',
      numero: '25+',
      subtexto: 'Anos OCE'
    },
    {
      _key: 'card2',
      icone: 'trophy',
      numero: '1000+',
      subtexto: 'Competições'
    },
    {
      _key: 'card3',
      icone: 'users',
      numero: '500+',
      subtexto: 'Atletas'
    }
  ],
  badges: ['Campeão Mundial', 'Escritor', 'Mentor'],
  secoesDinamicas: [
    {
      _key: 'secao1',
      tipo: 'topicos-divididos',
      titulo: 'Formação & Certificações',
      icone: 'graduation-cap',
      bordaAmarela: false,
      tituloColuna1: 'Formação Acadêmica',
      tituloColuna2: 'Certificações',
      topicos: [
        { _key: 'top1', texto: 'Award/Scholarship Thomas F Hayes Memorial (2001)' },
        { _key: 'top2', texto: 'Membro da Golden Key Honor Society' },
        { _key: 'top3', texto: 'Bachelors Degree - Exercise and Sports Sciences (Universidade da Flórida)' },
        { _key: 'top4', texto: 'Graduado com Honra (GPA 3.82/4.0)' },
        { _key: 'top5', texto: 'International Students Award (2000)' },
        { _key: 'top6', texto: 'President\'s Honor Roll (2000 e 2002)' }
      ],
      topicosColuna2: [
        { _key: 'top7', texto: 'Training Peaks Endurance Coaching Summit (2017)' },
        { _key: 'top8', texto: 'Training Peaks University (2015)' },
        { _key: 'top9', texto: 'Pós-Graduação em Neurociência e Treinamento Mental (em andamento)' },
        { _key: 'top10', texto: 'CTS Coaching College (líder mundial)' },
        { _key: 'top11', texto: 'USA Triathlon & USA Cycling' },
        { _key: 'top12', texto: 'Power Coach (Suíça, 2009)' },
        { _key: 'top13', texto: 'Eletroterapia-Compex (2010)' }
      ]
    },
    {
      _key: 'secao2',
      tipo: 'topicos-divididos',
      titulo: 'Principais Conquistas',
      icone: 'trophy',
      bordaAmarela: true,
      tituloColuna1: 'Como Atleta',
      tituloColuna2: 'Como Coach e Mentor',
      topicos: [
        { _key: 'atleta1', texto: 'Campeão Mundial Masters MTB XCM' },
        { _key: 'atleta2', texto: 'Vice-Campeão Mundial Masters MTB XCM' },
        { _key: 'atleta3', texto: 'Campeão PanAmericano de MTB XCO' },
        { _key: 'atleta4', texto: '7x Campeão Nacional MTB Masters' },
        { _key: 'atleta5', texto: 'Bi-Campeão Master Brasil Ride Bahia' },
        { _key: 'atleta6', texto: 'TriCampeão Elite Brasil Ride Botucatu SP' },
        { _key: 'atleta7', texto: 'Top 10 Mundial Ciclismo de Estrada Master' },
        { _key: 'atleta8', texto: 'Melhor dupla Brasileira geral na história da Cape Epic' },
        { _key: 'atleta9', texto: '3º lugar Iron Bike Italia' },
        { _key: 'atleta10', texto: 'Pódio Elite Swiss Epic' }
      ],
      topicosColuna2: [
        { _key: 'coach1', texto: 'Títulos Mundiais' },
        { _key: 'coach2', texto: 'Dezenas de títulos Nacionais' },
        { _key: 'coach3', texto: 'Diversos títulos PanAmericanos' },
        { _key: 'coach4', texto: 'Desenvolvimento de jovens atletas com assinatura de contrato com equipes profissionais nacionais e nível PRO TOUR' },
        { _key: 'coach5', texto: 'Títulos em diversas provas internacionais e nacionais de renome como RAAM e L\'etape\'s' }
      ]
    }
  ],
  ordem: 1,
  ativo: true,
  destaque: true
};

// Dados exatos do João Paulo do site antigo
const joaoData = {
  _type: 'coach',
  name: 'João Paulo Calado',
  slug: {
    _type: 'slug',
    current: 'coach-joao-paulo'
  },
  role: 'Coach World Class',
  bio: 'Bacharel em Educação Física pela Pontifícia Universidade Católica de Minas Gerais, especialista em Bike FIT desde 2014 com certificação pelo sistema Retül. Integra a equipe OCE desde o mesmo ano, atuando com foco em performance, biomecânica aplicada e treinamento científico voltado ao ciclismo. Ativo no esporte desde 2002, possui sólida experiência em competições de mountain bike (XCO), com participações nas principais provas nacionais e em Campeonatos Pan-Americanos. Nos últimos anos, também passou a competir no ciclismo de estrada, em maratonas e ultramaratonas.',
  bioCompleta: [
    {
      _type: 'block',
      _key: 'bio1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span1',
          text: 'Bacharel em Educação Física pela Pontifícia Universidade Católica de Minas Gerais, especialista em Bike FIT desde 2014 com certificação pelo sistema Retül. Integra a equipe OCE desde o mesmo ano, atuando com foco em performance, biomecânica aplicada e treinamento científico voltado ao ciclismo.'
        }
      ]
    },
    {
      _type: 'block',
      _key: 'bio2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span2',
          text: 'Ativo no esporte desde 2002, possui sólida experiência em competições de mountain bike (XCO), com participações nas principais provas nacionais e em Campeonatos Pan-Americanos. Nos últimos anos, também passou a competir no ciclismo de estrada, em maratonas e ultramaratonas.'
        }
      ]
    }
  ],
  cardsEstatisticas: [
    {
      _key: 'card1',
      icone: 'calendar',
      numero: '10+',
      subtexto: 'Anos OCE'
    },
    {
      _key: 'card2',
      icone: 'trophy',
      numero: '22+',
      subtexto: 'Anos de Ciclismo'
    },
    {
      _key: 'card3',
      icone: 'users',
      numero: '100+',
      subtexto: 'Atletas'
    }
  ],
  badges: ['Bike FIT Retül', 'TrainingPeaks', 'Pan-Americano'],
  secoesDinamicas: [
    {
      _key: 'secao1',
      tipo: 'topicos-divididos',
      titulo: 'Formação & Certificações',
      icone: 'graduation-cap',
      bordaAmarela: false,
      tituloColuna1: 'Formação & Certificações',
      tituloColuna2: 'Especialidades Técnicas',
      topicos: [
        { _key: 'top1', texto: 'Bacharel em Educação Física (PUC Minas)' },
        { _key: 'top2', texto: 'Especialista em Bike FIT (Sistema Retül)' },
        { _key: 'top3', texto: 'Coach World Class OCE (desde 2014)' },
        { _key: 'top4', texto: 'Biomecânica aplicada ao ciclismo' }
      ],
      topicosColuna2: [
        { _key: 'top5', texto: 'Análise TrainingPeaks e WKO' },
        { _key: 'top6', texto: 'Testes de potência e curva de potência' },
        { _key: 'top7', texto: 'Controle de carga crônica e aguda' },
        { _key: 'top8', texto: 'Periodização baseada em métricas' }
      ]
    },
    {
      _key: 'secao2',
      tipo: 'topicos-divididos',
      titulo: 'Experiência Competitiva',
      icone: 'trophy',
      bordaAmarela: true,
      tituloColuna1: 'Mountain Bike',
      tituloColuna2: 'Ciclismo de Estrada & Coaching',
      topicos: [
        { _key: 'exp1', texto: 'Ativo no mountain bike desde 2002' },
        { _key: 'exp2', texto: 'Participação em principais provas nacionais' },
        { _key: 'exp3', texto: 'Experiência em Campeonatos Pan-Americanos' },
        { _key: 'exp4', texto: 'Especialização em modalidade XCO' }
      ],
      topicosColuna2: [
        { _key: 'exp5', texto: 'Transição para ciclismo de estrada' },
        { _key: 'exp6', texto: 'Mais de 20 anos de experiência competitiva' },
        { _key: 'exp7', texto: 'Vivência prática aplicada ao coaching' },
        { _key: 'exp8', texto: 'Foco em performance e evolução contínua' }
      ]
    }
  ],
  ordem: 3,
  ativo: true,
  destaque: false
};

async function migrateCoaches() {
  try {
    console.log('🚀 Iniciando migração dos coaches...');
    
    // Criar Hugo Prado (Fundador)
    console.log('📝 Criando Hugo Prado Neto...');
    const hugo = await client.create(hugoData);
    console.log('✅ Hugo Prado criado:', hugo._id);
    
    // Criar Guilherme Bitencourt
    console.log('📝 Criando Guilherme Bitencourt...');
    const guilherme = await client.create(guilhermeData);
    console.log('✅ Guilherme Bitencourt criado:', guilherme._id);
    
    // Criar João Paulo Calado
    console.log('📝 Criando João Paulo Calado...');
    const joao = await client.create(joaoData);
    console.log('✅ João Paulo Calado criado:', joao._id);
    
    console.log('🎉 Migração concluída com sucesso!');
    console.log('📋 Coaches criados:');
    console.log('   - Hugo Prado Neto (Fundador & Coach World Class)');
    console.log('   - Guilherme Bitencourt (Coach Master Class)');
    console.log('   - João Paulo Calado (Coach World Class)');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  }
}

migrateCoaches();