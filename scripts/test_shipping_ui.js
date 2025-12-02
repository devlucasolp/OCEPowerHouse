require('dotenv').config({ path: '.env.local' });
const { MelhorEnvioService } = require('./src/services/melhorenvio/melhorenvio.service.ts');

async function testShippingUI() {
  console.log('🧪 Testando interface de frete com CEP 87053-378...');
  
  const melhorEnvio = new MelhorEnvioService();
  
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
    const shippingOptions = await melhorEnvio.calculateShipping('87053378', items);
    
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