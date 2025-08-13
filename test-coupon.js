const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCouponSystem() {
  try {
    console.log('🧪 Testando sistema de cupom...\n');
    
    // 1. Listar todos os cupons
    console.log('📋 1. Buscando cupons cadastrados...');
    const couponsResponse = await fetch('http://localhost:3000/api/test-coupon', {
      method: 'GET'
    });
    
    const couponsData = await couponsResponse.json();
    console.log('Cupons encontrados:', couponsData.count);
    
    if (couponsData.coupons && couponsData.coupons.length > 0) {
      console.log('Cupons disponíveis:');
      couponsData.coupons.forEach(coupon => {
        console.log(`- ${coupon.code}: ${coupon.title} (${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : 'R$ ' + coupon.discountValue})`);
      });
      
      // 2. Testar um cupom específico
      const testCode = couponsData.coupons[0].code;
      console.log(`\n🎯 2. Testando cupom: ${testCode}`);
      
      const couponTestResponse = await fetch('http://localhost:3000/api/test-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: testCode })
      });
      
      const couponTestData = await couponTestResponse.json();
      console.log('Detalhes do cupom:', JSON.stringify(couponTestData.coupon, null, 2));
      
      // 3. Testar checkout com cupom simulado
      console.log('\n💰 3. Testando checkout com cupom...');
      
      const checkoutData = {
        items: [
          {
            id: 'test-product',
            title: 'Produto de Teste',
            price: 100.00,
            quantity: 1,
            description: 'Produto para teste'
          }
        ],
        subtotal: 100.00,
        appliedCoupon: {
          code: testCode,
          discountAmount: couponTestData.coupon.discountType === 'percentage' 
            ? 100 * (couponTestData.coupon.discountValue / 100)
            : couponTestData.coupon.discountValue
        },
        total: 100.00 - (couponTestData.coupon.discountType === 'percentage' 
          ? 100 * (couponTestData.coupon.discountValue / 100)
          : couponTestData.coupon.discountValue)
      };
      
      console.log('Dados enviados para checkout:', JSON.stringify(checkoutData, null, 2));
      
      const checkoutResponse = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
      });
      
      const checkoutResult = await checkoutResponse.json();
      
      if (checkoutResponse.ok) {
        console.log('✅ Checkout bem-sucedido!');
        console.log('Total enviado para MP:', checkoutResult.total);
        console.log('Cupom aplicado:', checkoutResult.coupon_applied);
        console.log('Valor do desconto:', checkoutResult.discount_amount);
        console.log('URL de pagamento:', checkoutResult.url);
      } else {
        console.log('❌ Erro no checkout:', checkoutResult.error);
      }
      
    } else {
      console.log('⚠️ Nenhum cupom encontrado no Sanity');
      console.log('Crie um cupom no Sanity Studio primeiro');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testCouponSystem(); 