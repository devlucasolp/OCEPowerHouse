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

async function testJadlogDeduplication() {
  console.log('🧪 TESTE DE DEDUPLICAÇÃO DO JADLOG\n');
  
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
    console.log(`\n📋 Total de opções da API: ${shippingOptions.length}`);
    
    // Filtrar apenas opções do Jadlog
    const jadlogOptions = shippingOptions.filter(option => 
      option.name && option.name.toLowerCase().includes('jadlog')
    );
    
    console.log(`\n🎯 Opções do Jadlog encontradas: ${jadlogOptions.length}`);
    
    jadlogOptions.forEach((option, index) => {
      console.log(`\n--- Opção ${index + 1} ---`);
      console.log(`Nome original: ${option.name}`);
      console.log(`Preço: R$ ${option.price}`);
      console.log(`Tempo: ${option.delivery_time} dias`);
      console.log(`Company ID: ${option.company?.id}`);
      console.log(`Company Name: ${option.company?.name}`);
      
      // Simular normalização
      const name = option.name.toLowerCase();
      let normalizedName = 'jadlog_other';
      
      if (name.includes('package centralizado') || name.includes('.package centralizado')) {
        normalizedName = 'jadlog_package_centralizado';
      } else if (name.includes('.package') || name.includes('package')) {
        normalizedName = 'jadlog_package_comum';
      }
      
      console.log(`Nome normalizado: ${normalizedName}`);
    });
    
    // Testar a lógica de deduplicação
    console.log('\n🔄 SIMULANDO DEDUPLICAÇÃO...');
    
    const uniqueOptions = new Map();
    
    jadlogOptions.forEach(option => {
      const name = option.name.toLowerCase();
      let normalizedName = 'jadlog_other';
      
      if (name.includes('package centralizado') || name.includes('.package centralizado')) {
        normalizedName = 'jadlog_package_centralizado';
      } else if (name.includes('.package') || name.includes('package')) {
        normalizedName = 'jadlog_package_comum';
      }
      
      const key = normalizedName;
      
      // Para Jadlog, priorizar .Package Centralizado mesmo que seja mais caro
      if (key === 'jadlog_package_centralizado' || key === 'jadlog_package_comum') {
        const jadlogKey = 'jadlog'; // Usar chave única para todas as modalidades Jadlog
        const existingJadlog = uniqueOptions.get(jadlogKey);
        
        console.log(`\n🔍 Processando: ${option.name} (${normalizedName})`);
        console.log(`   Preço: R$ ${option.price}`);
        
        if (!existingJadlog) {
          console.log(`   ✅ Primeira opção Jadlog - adicionando`);
          uniqueOptions.set(jadlogKey, { ...option, normalizedName });
        } else {
          console.log(`   🔄 Já existe opção Jadlog: ${existingJadlog.name} (${existingJadlog.normalizedName})`);
          
          // Se já existe uma opção Jadlog, priorizar .Package Centralizado
          const currentIsPackageCentralizado = normalizedName === 'jadlog_package_centralizado';
          const existingIsPackageCentralizado = existingJadlog.normalizedName === 'jadlog_package_centralizado';
          
          if (currentIsPackageCentralizado && !existingIsPackageCentralizado) {
            console.log(`   🎯 Substituindo por .Package Centralizado (R$ ${option.price})`);
            uniqueOptions.set(jadlogKey, { ...option, normalizedName });
          } else if (!currentIsPackageCentralizado && !existingIsPackageCentralizado) {
            if (option.price < existingJadlog.price) {
              console.log(`   💰 Substituindo por opção mais barata (R$ ${option.price} vs R$ ${existingJadlog.price})`);
              uniqueOptions.set(jadlogKey, { ...option, normalizedName });
            } else {
              console.log(`   ❌ Mantendo opção mais barata existente (R$ ${existingJadlog.price} vs R$ ${option.price})`);
            }
          } else {
            console.log(`   ✅ Mantendo .Package Centralizado existente`);
          }
        }
      }
    });
    
    console.log('\n📋 RESULTADO DA DEDUPLICAÇÃO:');
    const finalJadlog = uniqueOptions.get('jadlog');
    if (finalJadlog) {
      console.log(`Nome: ${finalJadlog.name}`);
      console.log(`Preço: R$ ${finalJadlog.price}`);
      console.log(`Normalizado: ${finalJadlog.normalizedName}`);
      
      console.log('\n🎯 ANÁLISE:');
      if (finalJadlog.normalizedName === 'jadlog_package_centralizado') {
        console.log('✅ CORRETO: .Package Centralizado foi selecionado!');
      } else {
        console.log('❌ PROBLEMA: Outra modalidade foi selecionada em vez do .Package Centralizado');
      }
    } else {
      console.log('❌ Nenhuma opção Jadlog selecionada');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testJadlogDeduplication();