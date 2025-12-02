const fetch = require('node-fetch');
require('dotenv').config();

// Configuração da API do Melhor Envio
const API_TOKEN = process.env.MELHOR_ENVIO_TOKEN;
const API_BASE_URL = 'https://melhorenvio.com.br/api/v2/me';

// Endereço de origem
const fromAddress = {
  postal_code: '45810-000',
  address: 'Rua Exemplo',
  number: '123',
  district: 'Centro',
  city: 'Porto Seguro',
  state_abbr: 'BA',
  country_id: 'BR'
};

async function testJadlogCentralizado() {
  try {
    console.log('🧪 TESTE: Verificando se .Package Centralizado é priorizado sobre .Package comum\n');

    // Dados de teste que devem retornar ambas as opções Jadlog
    const products = [
      {
        id: '1',
        width: 20,
        height: 10,
        length: 30,
        weight: 1.5,
        insurance_value: 100,
        quantity: 1
      }
    ];

    const toAddress = {
      postal_code: '01310-100', // São Paulo - SP
      address: 'Avenida Paulista',
      number: '1000',
      district: 'Bela Vista',
      city: 'São Paulo',
      state_abbr: 'SP',
      country_id: 'BR'
    };

    const requestData = {
      from: fromAddress,
      to: toAddress,
      products: products
    };

    console.log('📦 Consultando API do Melhor Envio...');
    const response = await fetch(`${API_BASE_URL}/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
        'User-Agent': 'OCE PowerHouse (contato@ocelogistica.com.br)'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data)) {
      console.log('❌ Resposta inválida da API');
      return;
    }

    console.log(`📋 Total de opções retornadas: ${data.length}\n`);

    // Filtrar apenas opções do Jadlog
    const jadlogOptions = data.filter(option => 
      option.company && option.company.name && 
      option.company.name.toLowerCase().includes('jadlog')
    );

    console.log(`🎯 Opções do Jadlog encontradas: ${jadlogOptions.length}\n`);

    if (jadlogOptions.length === 0) {
      console.log('❌ Nenhuma opção do Jadlog encontrada');
      return;
    }

    // Listar todas as opções do Jadlog
    jadlogOptions.forEach((option, index) => {
      console.log(`${index + 1}. ${option.name} - R$ ${option.price}`);
      console.log(`   Empresa: ${option.company.name}`);
      console.log(`   Tempo: ${option.delivery_time} dias úteis`);
      console.log('');
    });

    // Verificar se temos .Package e .Package Centralizado
    const packageComum = jadlogOptions.find(opt => 
      opt.name.toLowerCase().includes('.package') && 
      !opt.name.toLowerCase().includes('centralizado')
    );

    const packageCentralizado = jadlogOptions.find(opt => 
      opt.name.toLowerCase().includes('.package') && 
      opt.name.toLowerCase().includes('centralizado')
    );

    console.log('🔍 ANÁLISE DAS OPÇÕES:');
    
    if (packageComum) {
      console.log(`✅ .Package comum encontrado: R$ ${packageComum.price}`);
    } else {
      console.log('❌ .Package comum NÃO encontrado');
    }

    if (packageCentralizado) {
      console.log(`✅ .Package Centralizado encontrado: R$ ${packageCentralizado.price}`);
    } else {
      console.log('❌ .Package Centralizado NÃO encontrado');
    }

    if (packageComum && packageCentralizado) {
      console.log('\n🎯 TESTE DE PRIORIZAÇÃO:');
      console.log(`   .Package comum: R$ ${packageComum.price}`);
      console.log(`   .Package Centralizado: R$ ${packageCentralizado.price}`);
      
      if (packageCentralizado.price > packageComum.price) {
        console.log('✅ CENÁRIO IDEAL: .Package Centralizado é mais caro');
        console.log('   A lógica deve priorizar o Centralizado mesmo sendo mais caro');
      } else {
        console.log('⚠️  .Package Centralizado é mais barato ou igual');
        console.log('   A lógica funcionará normalmente');
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Executar o teste
testJadlogCentralizado();