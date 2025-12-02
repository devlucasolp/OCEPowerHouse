const https = require('https');
require('dotenv').config({ path: '.env.local' });

/**
 * Script para consultar métodos de pagamento disponíveis no Mercado Pago
 */
async function checkPaymentMethods() {
  const accessToken = 'APP_USR-834693252311167-072414-601382743fe246f2f08174abd919e166-2579741776';
  
  if (!accessToken) {
    console.error('❌ MERCADOPAGO_ACCESS_TOKEN não encontrado no .env.local');
    process.exit(1);
  }

  console.log('🔍 Consultando métodos de pagamento disponíveis...');
  console.log('🔑 Token:', accessToken.substring(0, 20) + '...');
  
  const options = {
    hostname: 'api.mercadopago.com',
    port: 443,
    path: '/v1/payment_methods',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ Consulta realizada com sucesso!');
            console.log('\n📊 MÉTODOS DE PAGAMENTO DISPONÍVEIS:');
            console.log('=' .repeat(60));
            
            // Separar por tipo de pagamento
            const creditCards = [];
            const debitCards = [];
            const others = [];
            
            response.forEach(method => {
              const info = {
                id: method.id,
                name: method.name,
                payment_type_id: method.payment_type_id,
                status: method.status
              };
              
              if (method.payment_type_id === 'credit_card') {
                creditCards.push(info);
              } else if (method.payment_type_id === 'debit_card') {
                debitCards.push(info);
              } else {
                others.push(info);
              }
            });
            
            // Exibir cartões de crédito
            console.log('\n💳 CARTÕES DE CRÉDITO:');
            console.log('-'.repeat(40));
            creditCards.forEach(card => {
              console.log(`• ${card.name} (${card.id}) - Status: ${card.status}`);
            });
            
            // Exibir cartões de débito
            console.log('\n💰 CARTÕES DE DÉBITO:');
            console.log('-'.repeat(40));
            if (debitCards.length > 0) {
              debitCards.forEach(card => {
                console.log(`• ${card.name} (${card.id}) - Status: ${card.status}`);
              });
            } else {
              console.log('⚠️  Nenhum cartão de débito encontrado!');
              console.log('   Isso pode indicar limitações na conta ou configuração.');
            }
            
            // Exibir outros métodos
            console.log('\n🏦 OUTROS MÉTODOS:');
            console.log('-'.repeat(40));
            others.forEach(method => {
              console.log(`• ${method.name} (${method.id}) - Tipo: ${method.payment_type_id} - Status: ${method.status}`);
            });
            
            console.log('\n' + '='.repeat(60));
            console.log(`📈 Total de métodos: ${response.length}`);
            console.log(`💳 Crédito: ${creditCards.length}`);
            console.log(`💰 Débito: ${debitCards.length}`);
            console.log(`🏦 Outros: ${others.length}`);
            
            // Verificar se há problemas com débito
            if (debitCards.length === 0) {
              console.log('\n⚠️  ATENÇÃO: Nenhum método de débito encontrado!');
              console.log('   Possíveis causas:');
              console.log('   • Conta em processo de verificação');
              console.log('   • Restrições regionais');
              console.log('   • Configurações específicas da conta');
              console.log('   • Entre em contato com o suporte do Mercado Pago');
            }
            
            resolve(response);
          } else {
            console.error('❌ Erro na consulta:', res.statusCode);
            console.error('Resposta:', response);
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (error) {
          console.error('❌ Erro ao processar resposta:', error.message);
          console.error('Dados recebidos:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Erro na requisição:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

// Executar o script
if (require.main === module) {
  checkPaymentMethods()
    .then(() => {
      console.log('\n✅ Consulta finalizada com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erro na execução:', error.message);
      process.exit(1);
    });
}

module.exports = { checkPaymentMethods };