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

async function testCep45810000() {
  console.log('🧪 Testando CEP 45810-000 (Imperial Utilidades - Pega Aki)...');
  
  if (!apiToken) {
    console.error('❌ Token não configurado!');
    return;
  }

  // Dados de teste - produto padrão
  const testProducts = [{
    id: 'produto-test',
    width: 15,  // cm
    height: 5,  // cm
    length: 20, // cm
    weight: 0.5, // kg
    insurance_value: 100, // valor
    quantity: 1
  }];

  const requestData = {
    from: originAddress,
    to: { postal_code: '45810000' },
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
    console.log('✅ Resposta da API recebida');

    // Filtrar e analisar opções do Jadlog
    console.log('\n🎯 ANÁLISE DETALHADA DAS OPÇÕES JADLOG:');
    
    if (Array.isArray(data)) {
      const jadlogOptions = data.filter(option => {
        const company = option.company?.name?.toLowerCase() || '';
        const name = option.name?.toLowerCase() || '';
        return company.includes('jadlog') || name.includes('jadlog');
      });

      if (jadlogOptions.length > 0) {
        console.log(`\n📋 Encontradas ${jadlogOptions.length} opções do Jadlog:`);
        
        jadlogOptions.forEach((option, index) => {
          console.log(`\n--- Jadlog Opção ${index + 1} ---`);
          console.log('ID:', option.id);
          console.log('Nome:', option.name);
          console.log('Empresa:', option.company?.name);
          console.log('Preço original:', option.price);
          console.log('Preço customizado:', option.custom_price);
          console.log('Preço final:', option.custom_price || option.price);
          console.log('Tempo de entrega:', option.delivery_time);
          console.log('Range de entrega:', option.delivery_range);
          console.log('Tempo customizado:', option.custom_delivery_time);
          console.log('Range customizado:', option.custom_delivery_range);
          console.log('Erro:', option.error || 'Nenhum');
          
          const finalPrice = parseFloat(option.custom_price || option.price);
          console.log(`💰 PREÇO FINAL: R$ ${finalPrice.toFixed(2)}`);
          
          // Comparar com os valores mencionados
          console.log('\n📊 COMPARAÇÃO:');
          console.log(`API retorna: R$ ${finalPrice.toFixed(2)}`);
          console.log('Valor esperado (menor): R$ 31,26');
          console.log('Valor no site: R$ 40,04');
          console.log(`Diferença da API vs esperado: R$ ${(finalPrice - 31.26).toFixed(2)}`);
          console.log(`Diferença da API vs site: R$ ${(finalPrice - 40.04).toFixed(2)}`);
        });

        // Encontrar a opção mais barata do Jadlog
        const cheapestJadlog = jadlogOptions
          .filter(opt => !opt.error && opt.price && parseFloat(opt.price) > 0)
          .sort((a, b) => parseFloat(a.custom_price || a.price) - parseFloat(b.custom_price || b.price))[0];

        if (cheapestJadlog) {
          const cheapestPrice = parseFloat(cheapestJadlog.custom_price || cheapestJadlog.price);
          console.log(`\n🏆 OPÇÃO MAIS BARATA DO JADLOG:`);
          console.log(`Nome: ${cheapestJadlog.name}`);
          console.log(`Preço: R$ ${cheapestPrice.toFixed(2)}`);
          console.log(`ID: ${cheapestJadlog.id}`);
        }

      } else {
        console.log('❌ Nenhuma opção do Jadlog encontrada!');
      }

      // Mostrar todas as opções disponíveis para comparação
      console.log('\n📋 TODAS AS OPÇÕES DISPONÍVEIS:');
      data.forEach((option, index) => {
        if (!option.error && option.price && parseFloat(option.price) > 0) {
          const price = parseFloat(option.custom_price || option.price);
          console.log(`${index + 1}. ${option.company?.name} - ${option.name}: R$ ${price.toFixed(2)}`);
        }
      });

    } else {
      console.log('❌ Formato de resposta inesperado (não é array)');
      console.log('Estrutura da resposta:', Object.keys(data));
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testCep45810000();