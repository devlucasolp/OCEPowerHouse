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

async function testPriceComparison() {
  try {
    console.log('🧪 TESTE: Comparação de preços - API vs Sites oficiais\n');

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
      postal_code: '45810-000', // Mesmo CEP para teste
      address: 'Rua Destino',
      number: '456',
      district: 'Centro',
      city: 'Porto Seguro',
      state_abbr: 'BA',
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

    // Analisar preços dos Correios
    const correiosOptions = data.filter(option => 
      option.company && option.company.name && 
      (option.company.name.toLowerCase().includes('correios') || 
       option.company.name.toLowerCase().includes('correio'))
    );

    console.log('🎯 ANÁLISE DOS PREÇOS DOS CORREIOS:\n');

    correiosOptions.forEach((option, index) => {
      console.log(`${index + 1}. ${option.name}`);
      console.log(`   Empresa: ${option.company.name}`);
      console.log(`   Preço original: R$ ${option.price}`);
      console.log(`   Preço customizado: R$ ${option.custom_price || 'N/A'}`);
      console.log(`   Desconto: R$ ${option.discount || '0.00'}`);
      console.log(`   Tempo original: ${option.delivery_time} dias`);
      console.log(`   Tempo customizado: ${option.custom_delivery_time || 'N/A'} dias`);
      console.log(`   Range original: ${option.delivery_range?.min}-${option.delivery_range?.max} dias`);
      console.log(`   Range customizado: ${option.custom_delivery_range?.min || 'N/A'}-${option.custom_delivery_range?.max || 'N/A'} dias`);
      
      // Verificar se há diferença entre preço original e customizado
      const originalPrice = parseFloat(option.price);
      const customPrice = parseFloat(option.custom_price || option.price);
      const difference = customPrice - originalPrice;
      
      if (difference !== 0) {
        console.log(`   🔍 DIFERENÇA: R$ ${difference.toFixed(2)} (${difference > 0 ? 'mais caro' : 'mais barato'})`);
      } else {
        console.log(`   ✅ Preços iguais`);
      }
      
      console.log('');
    });

    // Verificar se há configurações de margem ou markup
    console.log('🔍 VERIFICAÇÃO DE CONFIGURAÇÕES:\n');
    
    correiosOptions.forEach(option => {
      console.log(`--- ${option.name} ---`);
      
      // Verificar todos os campos que podem indicar ajustes de preço
      const fields = [
        'price', 'custom_price', 'discount', 'currency',
        'delivery_time', 'custom_delivery_time'
      ];
      
      fields.forEach(field => {
        if (option[field] !== undefined && option[field] !== null) {
          console.log(`   ${field}: ${option[field]}`);
        }
      });
      
      // Verificar packages se existir
      if (option.packages && option.packages.length > 0) {
        console.log('   Packages:');
        option.packages.forEach((pkg, idx) => {
          console.log(`     Package ${idx + 1}:`);
          console.log(`       price: ${pkg.price}`);
          console.log(`       discount: ${pkg.discount}`);
        });
      }
      
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Executar o teste
testPriceComparison();