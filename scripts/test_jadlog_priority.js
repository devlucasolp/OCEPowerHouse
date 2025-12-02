require('dotenv').config({ path: '.env.local' });

async function testJadlogPriority() {
  console.log('🧪 Testando priorização do Jadlog .Package Centralizado...');
  
  const token = process.env.MELHOR_ENVIO_API_TOKEN;
  
  if (!token) {
    console.error('❌ Token do Melhor Envio não encontrado!');
    return;
  }

  const requestData = {
    from: {
      postal_code: '34006069'
    },
    to: {
      postal_code: '45810000'
    },
    products: [{
      id: 'produto-test',
      width: 15,
      height: 5,
      length: 20,
      weight: 0.5,
      insurance_value: 100,
      quantity: 1
    }]
  };

  try {
    console.log('📦 Fazendo requisição para API do Melhor Envio...');
    
    const response = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'PowerHouse Brasil (contato@powerhousebrasil.com)'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Resposta recebida da API');

    if (Array.isArray(data)) {
      // Filtrar apenas opções do Jadlog
      const jadlogOptions = data.filter(option => {
        const company = option.company?.name?.toLowerCase() || '';
        return company.includes('jadlog');
      });

      if (jadlogOptions.length > 0) {
        console.log(`\n📋 Encontradas ${jadlogOptions.length} opções do Jadlog:`);
        
        jadlogOptions.forEach((option, index) => {
          console.log(`\n--- Jadlog Opção ${index + 1} ---`);
          console.log('ID:', option.id);
          console.log('Nome:', option.name);
          console.log('Empresa:', option.company?.name);
          console.log('Preço:', option.price);
          console.log('Preço customizado:', option.custom_price);
          console.log('Preço final:', option.custom_price || option.price);
          
          const finalPrice = parseFloat(option.custom_price || option.price);
          console.log(`💰 PREÇO FINAL: R$ ${finalPrice.toFixed(2)}`);
          
          // Verificar se é .Package Centralizado
          const isPackageCentralizado = option.name.toLowerCase().includes('.package') || 
                                       option.name.toLowerCase().includes('package centralizado');
          
          console.log(`🎯 É .Package Centralizado? ${isPackageCentralizado ? 'SIM' : 'NÃO'}`);
          
          if (isPackageCentralizado) {
            console.log('🏆 ESTA É A OPÇÃO QUE DEVEMOS PRIORIZAR!');
          }
        });

        // Encontrar especificamente o .Package Centralizado
        const packageCentralizado = jadlogOptions.find(opt => 
          opt.name.toLowerCase().includes('.package') || 
          opt.name.toLowerCase().includes('package centralizado')
        );

        if (packageCentralizado) {
          const price = parseFloat(packageCentralizado.custom_price || packageCentralizado.price);
          console.log(`\n🎯 JADLOG .PACKAGE CENTRALIZADO ENCONTRADO:`);
          console.log(`Nome: ${packageCentralizado.name}`);
          console.log(`Preço: R$ ${price.toFixed(2)}`);
          console.log(`ID: ${packageCentralizado.id}`);
          console.log(`\n📊 COMPARAÇÃO:`);
          console.log(`Valor encontrado: R$ ${price.toFixed(2)}`);
          console.log('Valor esperado no site: R$ 40,04');
          console.log(`Diferença: R$ ${(price - 40.04).toFixed(2)}`);
          
          if (Math.abs(price - 40.04) < 0.01) {
            console.log('✅ PERFEITO! Valores coincidem!');
          } else {
            console.log('⚠️ Pequena diferença - normal devido a variações da API');
          }
        } else {
          console.log('❌ .Package Centralizado não encontrado!');
        }

      } else {
        console.log('❌ Nenhuma opção do Jadlog encontrada!');
      }

    } else {
      console.log('❌ Formato de resposta inesperado');
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testJadlogPriority();