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

// Função de teste para o CEP específico da imagem
async function testCep87053378() {
  console.log('🧪 Testando CEP 87053-378 (da imagem)...');
  console.log('Token configurado:', !!apiToken);
  
  if (!apiToken) {
    console.error('❌ Token não configurado!');
    return;
  }

  // CEP da imagem e produto padrão
  const testCep = '87053378';
  const testProducts = [{
    id: 'produto-test',
    width: 15,  // cm
    height: 5,  // cm
    length: 20, // cm
    weight: 0.5, // kg
    insurance_value: 100.00,
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
    console.log('✅ Resposta da API:');
    
    // Filtrar apenas PAC, SEDEX e Jadlog
    const relevantOptions = data.filter(option => {
      const name = option.name.toLowerCase();
      const company = option.company.name.toLowerCase();
      return name.includes('pac') || 
             name.includes('sedex') || 
             company.includes('jadlog') ||
             name.includes('jadlog');
    });

    console.log('\n🎯 Opções relevantes (PAC, SEDEX, Jadlog):');
    relevantOptions.forEach((option, index) => {
      console.log(`\n--- ${option.name} (${option.company.name}) ---`);
      console.log(`ID: ${option.id}`);
      console.log(`Preço: R$ ${option.price}`);
      console.log(`Preço customizado: R$ ${option.custom_price}`);
      console.log(`Tempo: ${option.delivery_time} dias úteis`);
      console.log(`Range: ${option.delivery_range.min}-${option.delivery_range.max} dias`);
      if (option.error) {
        console.log(`Erro: ${option.error}`);
      }
    });

    console.log('\n📊 COMPARAÇÃO COM A IMAGEM:');
    const pacOption = relevantOptions.find(opt => opt.name.toLowerCase().includes('pac'));
    if (pacOption) {
      console.log(`PAC API: R$ ${pacOption.price} | Imagem: R$ 27,90 | Diferença: R$ ${(27.90 - parseFloat(pacOption.price)).toFixed(2)}`);
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testCep87053378();