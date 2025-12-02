const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// Configuração da API
const apiToken = process.env.MELHOR_ENVIO_API_TOKEN;
const baseUrl = 'https://melhorenvio.com.br/api/v2/me';

// Endereço de origem (Power House Brasil)
const originAddress = {
  postal_code: '34006069',
  address: 'Alameda do Ingá',
  number: '222',
  district: 'Vale do Sereno',
  city: 'Nova Lima',
  state_abbr: 'MG',
  country_id: 'BR'
};

// Função de teste
async function testMelhorEnvio() {
  console.log('🧪 Testando API do Melhor Envio...');
  console.log('Token configurado:', !!apiToken);
  
  if (!apiToken) {
    console.error('❌ Token não configurado!');
    return;
  }

  // Dados de teste - CEP específico e dimensões do livro
  const testCep = '45810000'; // CEP problemático
  const testProducts = [{
    id: 'livro-test',
    width: 16,  // Largura do livro
    height: 3,  // Altura do livro
    length: 23, // Comprimento do livro
    weight: 0.5, // Peso do livro
    insurance_value: 110.50, // Valor do livro
    quantity: 1
  }];

  const requestData = {
    from: originAddress,
    to: { postal_code: testCep },
    products: testProducts
  };

  console.log('📦 Dados da requisição:', JSON.stringify(requestData, null, 2));

  try {
    const response = await fetch(`${baseUrl}/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    console.log('📡 Status da resposta:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Resposta completa da API:');
    console.log(JSON.stringify(data, null, 2));

    // Analisar estrutura da resposta
    console.log('\n🔍 Análise da estrutura:');
    
    if (Array.isArray(data)) {
      console.log('- Resposta é um array com', data.length, 'opções');
      data.forEach((option, index) => {
        console.log(`\n--- Opção ${index + 1} ---`);
        console.log('ID:', option.id);
        console.log('Nome:', option.name);
        console.log('Empresa:', option.company?.name);
        console.log('Preço:', option.price);
        console.log('Preço customizado:', option.custom_price);
        console.log('Tempo de entrega:', option.delivery_time);
        console.log('Range de entrega:', option.delivery_range);
        console.log('Tempo customizado:', option.custom_delivery_time);
        console.log('Range customizado:', option.custom_delivery_range);
        console.log('Erro:', option.error);
      });
    } else {
      console.log('- Resposta é um objeto');
      Object.entries(data).forEach(([carrierId, options]) => {
        console.log(`\n--- Transportadora ${carrierId} ---`);
        if (Array.isArray(options)) {
          options.forEach((option, index) => {
            console.log(`\n  Opção ${index + 1}:`);
            console.log('  ID:', option.id);
            console.log('  Nome:', option.name);
            console.log('  Empresa:', option.company?.name);
            console.log('  Preço:', option.price);
            console.log('  Preço customizado:', option.custom_price);
            console.log('  Tempo de entrega:', option.delivery_time);
            console.log('  Range de entrega:', option.delivery_range);
            console.log('  Tempo customizado:', option.custom_delivery_time);
            console.log('  Range customizado:', option.custom_delivery_range);
            console.log('  Erro:', option.error);
          });
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

// Executar teste
testMelhorEnvio();