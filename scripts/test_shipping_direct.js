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

// Simular a lógica do MelhorEnvioService
async function calculateShippingDirect(destinationCep, items) {
  try {
    // Preparar produtos para a API do Melhor Envio
    const products = items.map(item => ({
      id: item.id,
      width: item.dimensions?.width || 15, // cm
      height: item.dimensions?.height || 5, // cm
      length: item.dimensions?.length || 20, // cm
      weight: item.weight || 0.5, // kg
      insurance_value: item.price,
      quantity: item.quantity
    }));

    // Preparar endereço de destino
    const destinationAddress = {
      postal_code: destinationCep.replace(/\D/g, '')
    };

    // Dados da requisição
    const requestData = {
      from: originAddress,
      to: destinationAddress,
      products
    };

    console.log('📦 Dados da requisição:', JSON.stringify(requestData, null, 2));

    // Fazer requisição para a API do Melhor Envio
    const response = await fetch(`${baseUrl}/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API do Melhor Envio:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Erro na API do Melhor Envio: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Resposta do Melhor Envio recebida');

    // Processar resposta e converter para formato esperado
    let validOptions = [];

    // Função para normalizar nomes de transportadoras
    const normalizeCarrierName = (name, company) => {
      const lowerName = name.toLowerCase();
      const lowerCompany = company.toLowerCase();
      
      // Normalização para Jadlog (deve vir ANTES do PAC para evitar conflito com "package")
      if (lowerName.includes('jadlog') || lowerCompany.includes('jadlog')) {
        return {
          normalizedName: 'jadlog',
          displayName: 'Jadlog',
          carrierType: 'jadlog'
        };
      }
      
      // Normalização para SEDEX
      if (lowerName.includes('sedex') || lowerCompany.includes('sedex')) {
        return {
          normalizedName: 'sedex',
          displayName: 'SEDEX',
          carrierType: 'correios'
        };
      }
      
      // Normalização para PAC (apenas dos Correios, não Jadlog)
      if ((lowerName.includes('pac') || lowerName.includes('package')) && 
          !lowerCompany.includes('jadlog') && 
          (lowerCompany.includes('correios') || lowerCompany.includes('correio'))) {
        return {
          normalizedName: 'pac',
          displayName: 'PAC',
          carrierType: 'correios'
        };
      }
      
      // Normalização para .Com (Correios)
      if (lowerName.includes('.com') || lowerName.includes('com')) {
        return {
          normalizedName: 'correios_com',
          displayName: 'Correios (.Com)',
          carrierType: 'correios'
        };
      }
      
      // Outros casos - usar nome da empresa
      return {
        normalizedName: lowerCompany.replace(/\s+/g, '_'),
        displayName: company,
        carrierType: lowerCompany
      };
    };

    // Verificar se a resposta é um array direto ou objeto com transportadoras
    if (Array.isArray(data)) {
      // Se for array direto, processar cada opção
      data.forEach(option => {
        // Pular opções com erro ou preço inválido
        if (option.error || !option.price || parseFloat(option.price) <= 0) {
          return;
        }
        
        const price = parseFloat(option.custom_price || option.price);
        const deliveryMin = option.custom_delivery_range?.min || option.delivery_range?.min || 0;
        const deliveryMax = option.custom_delivery_range?.max || option.delivery_range?.max || 0;
        
        let deliveryTime = '';
        if (deliveryMin && deliveryMax) {
          if (deliveryMin === deliveryMax) {
            deliveryTime = `${deliveryMin} dias úteis`;
          } else {
            deliveryTime = `${deliveryMin}-${deliveryMax} dias úteis`;
          }
        } else if (option.custom_delivery_time || option.delivery_time) {
          const days = option.custom_delivery_time || option.delivery_time;
          deliveryTime = `${days} dias úteis`;
        } else {
          deliveryTime = 'Prazo não informado';
        }
        
        const normalized = normalizeCarrierName(option.name, option.company?.name || 'Transportadora');
        
        validOptions.push({
          id: option.id.toString(),
          name: normalized.displayName,
          price: price,
          deliveryTime: deliveryTime,
          company: normalized.displayName,
          normalizedName: normalized.normalizedName
        });
      });
    }

    // Remover duplicatas baseado APENAS no nome normalizado, mantendo a opção mais barata
    const uniqueOptions = new Map();
    
    validOptions.forEach(option => {
      const key = option.normalizedName;
      const existing = uniqueOptions.get(key);
      
      if (!existing || option.price < existing.price) {
        uniqueOptions.set(key, option);
      }
    });
    
    // Converter de volta para array
    const deduplicatedOptions = Array.from(uniqueOptions.values());
    
    // Definir prioridades para transportadoras principais
    const getCarrierPriority = (option) => {
      const normalizedName = option.normalizedName;
      switch (normalizedName) {
        case 'pac': return 1;           // PAC - Correios
        case 'sedex': return 2;         // SEDEX - Correios  
        case 'jadlog': return 3;        // .Package - Jadlog
        case 'correios_com': return 4;  // .Com - Jadlog
        default: return 999;           // Outras transportadoras por último
      }
    };
    
    // Ordenar por prioridade das transportadoras principais, depois por preço
    deduplicatedOptions.sort((a, b) => {
      const priorityA = getCarrierPriority(a);
      const priorityB = getCarrierPriority(b);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return a.price - b.price;
    });
    
    // Filtrar apenas as transportadoras principais se disponíveis
    const mainCarriers = deduplicatedOptions.filter(option => {
      const priority = getCarrierPriority(option);
      return priority <= 4; // PAC, SEDEX, Jadlog, Correios .Com
    });
    
    // Se temos transportadoras principais, usar apenas elas, senão usar todas
    const finalOptions = mainCarriers.length >= 3 ? mainCarriers : deduplicatedOptions;
    
    // Limitar a 3 opções e remover propriedades auxiliares
    const shippingOptions = finalOptions.slice(0, 3).map(option => ({
      id: option.id,
      name: option.name,
      price: option.price,
      deliveryTime: option.deliveryTime,
      company: option.company
    }));

    console.log('📋 Opções de frete processadas:', {
      count: shippingOptions.length,
      cheapest: shippingOptions[0]?.price || 0
    });

    return shippingOptions;

  } catch (error) {
    console.error('❌ Erro ao calcular frete:', error);
    return [];
  }
}

async function testShippingUI() {
  console.log('🧪 Testando interface de frete com CEP 87053-378...');
  
  // Simular produto do carrinho
  const items = [{
    id: 'produto-test',
    name: 'Produto Teste',
    price: 100,
    quantity: 1,
    weight: 0.5,
    dimensions: {
      length: 20,
      width: 15,
      height: 5
    }
  }];
  
  try {
    console.log('📦 Calculando frete para CEP 87053-378...');
    const shippingOptions = await calculateShippingDirect('87053378', items);
    
    console.log('\n🎯 OPÇÕES RETORNADAS PELA INTERFACE:');
    shippingOptions.forEach((option, index) => {
      console.log(`\n--- ${option.name} (${option.company}) ---`);
      console.log(`ID: ${option.id}`);
      console.log(`Preço: R$ ${option.price.toFixed(2)}`);
      console.log(`Tempo: ${option.deliveryTime}`);
    });
    
    // Verificar se PAC está sendo retornado corretamente
    const pacOption = shippingOptions.find(opt => opt.name.toLowerCase().includes('pac'));
    const jadlogOption = shippingOptions.find(opt => opt.company.toLowerCase().includes('jadlog'));
    
    console.log('\n📊 ANÁLISE DOS RESULTADOS:');
    
    if (pacOption) {
      console.log(`✅ PAC encontrado: R$ ${pacOption.price.toFixed(2)}`);
      console.log(`   Esperado da imagem: R$ 27,90`);
      console.log(`   Diferença: R$ ${(pacOption.price - 27.90).toFixed(2)}`);
    } else {
      console.log('❌ PAC não encontrado nas opções!');
    }
    
    if (jadlogOption) {
      console.log(`✅ Jadlog encontrado: R$ ${jadlogOption.price.toFixed(2)} (${jadlogOption.name})`);
      console.log(`   Esperado da imagem: R$ 17,29`);
      console.log(`   Diferença: R$ ${(jadlogOption.price - 17.29).toFixed(2)}`);
    } else {
      console.log('❌ Jadlog não encontrado nas opções!');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testShippingUI();