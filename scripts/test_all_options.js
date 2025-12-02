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

async function testAllOptions() {
  console.log('🔍 TESTE DE TODAS AS OPÇÕES DISPONÍVEIS\n');
  
  try {
    // Configurar dados de teste
    const requestData = {
      from: originAddress,
      to: { postal_code: '45810000' },
      products: [{
        id: 'test',
        width: 20,
        height: 4,
        length: 30,
        weight: 0.5,
        insurance_value: 100,
        quantity: 1
      }]
    };
    
    console.log('📦 Consultando API do Melhor Envio...');
    
    const response = await fetch(`${baseUrl}/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        'User-Agent': 'Aplicação (email para contato técnico)'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const shippingOptions = Array.isArray(data) ? data : data.data || [];
    console.log(`\n📋 Total de opções da API: ${shippingOptions.length}\n`);
    
    // Listar todas as opções
    shippingOptions.forEach((option, index) => {
      console.log(`--- Opção ${index + 1} ---`);
      console.log(`Nome: ${option.name}`);
      console.log(`Preço: R$ ${option.price}`);
      console.log(`Tempo: ${option.delivery_time} dias`);
      console.log(`Company ID: ${option.company?.id}`);
      console.log(`Company Name: ${option.company?.name}`);
      
      // Verificar se contém "jadlog" em qualquer lugar
      const nameContainsJadlog = option.name && option.name.toLowerCase().includes('jadlog');
      const companyContainsJadlog = option.company?.name && option.company.name.toLowerCase().includes('jadlog');
      
      if (nameContainsJadlog || companyContainsJadlog) {
        console.log('🎯 JADLOG ENCONTRADO!');
      }
      
      console.log('');
    });
    
    // Filtrar especificamente por Jadlog
    const jadlogByName = shippingOptions.filter(option => 
      option.name && option.name.toLowerCase().includes('jadlog')
    );
    
    const jadlogByCompany = shippingOptions.filter(option => 
      option.company?.name && option.company.name.toLowerCase().includes('jadlog')
    );
    
    console.log(`\n🎯 Opções com "jadlog" no nome: ${jadlogByName.length}`);
    console.log(`🎯 Opções com "jadlog" na empresa: ${jadlogByCompany.length}`);
    
    // Verificar se há alguma opção que possa ser do Jadlog mas com nome diferente
    const possibleJadlog = shippingOptions.filter(option => {
      const name = option.name?.toLowerCase() || '';
      const company = option.company?.name?.toLowerCase() || '';
      return name.includes('package') || company.includes('package') || 
             name.includes('jad') || company.includes('jad');
    });
    
    console.log(`\n🔍 Opções que podem ser Jadlog (contém "package" ou "jad"): ${possibleJadlog.length}`);
    possibleJadlog.forEach((option, index) => {
      console.log(`  ${index + 1}. ${option.name} - ${option.company?.name} - R$ ${option.price}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testAllOptions();