import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { 
      items, 
      subtotal, 
      shippingCost, 
      appliedCoupon, 
      total, 
      deliveryType, 
      customerAddress,
      customerName,
      customerEmail 
    } = req.body;
    
    console.log('🚀 API Checkout - Iniciado com', items?.length, 'itens');

    // Validações básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens inválidos ou carrinho vazio' });
    }

    // Configuração do Mercado Pago
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ error: 'Token do Mercado Pago não configurado' });
    }

    // URL base - CORRIGIDO para funcionar em dev e produção
    const getBaseUrl = () => {
      // Em produção, usar a URL do domínio
      if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_BASE_URL || 'https://powerhousebrasil.com.br';
      }
      // Em desenvolvimento, usar domínio também
      return process.env.NEXT_PUBLIC_BASE_URL || 'https://powerhousebrasil.com.br';
    };
    
    const baseUrl = getBaseUrl();
    const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

    // Formatar itens - VERSÃO SIMPLIFICADA E SEGURA
    const mercadoPagoItems = items.map((item: any, index: number) => {
      let price = parseFloat(Number(item.price || 0).toFixed(2));
      const quantity = parseInt(item.quantity || 1);
      
      // Validações básicas
      if (price <= 0 || quantity <= 0) {
        throw new Error(`Item ${index + 1}: Preço (${price}) ou quantidade (${quantity}) inválidos`);
      }

      // CORREÇÃO: Aplicar desconto de forma segura
      if (appliedCoupon && appliedCoupon.discountAmount > 0 && subtotal > 0) {
        const discountRatio = Math.min(appliedCoupon.discountAmount / subtotal, 0.99); // Max 99% desconto
        price = Math.max(price * (1 - discountRatio), 0.01); // Mínimo R$ 0,01
      }

      return {
        id: String(item.id || item._id || `item-${index + 1}`),
        title: String(item.title || item.name || 'Produto PowerHouse').substring(0, 256),
        description: String(item.description || item.title || item.name || 'Produto de alta qualidade da PowerHouse Brasil').substring(0, 600),
        category_id: String(item.category_id || item.categoryId || item.category || 'others'),
        quantity: quantity,
        unit_price: parseFloat(price.toFixed(2)),
        currency_id: 'BRL'
      };
    });

    // CORREÇÃO: Adicionar frete de forma segura
    if (shippingCost && shippingCost > 0) {
      mercadoPagoItems.push({
        id: 'shipping',
        title: 'Frete',
        description: 'Taxa de entrega para o endereço informado',
        category_id: 'services',
        quantity: 1,
        unit_price: parseFloat(Number(shippingCost).toFixed(2)),
        currency_id: 'BRL'
      });
    }

    // Gerar referência externa
    const externalReference = `powerhouse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Preparar dados do pagador com nome e email para melhorar aprovação
    const extractNames = (fullName: string) => {
      if (!fullName || typeof fullName !== 'string') {
        return { firstName: 'Cliente', lastName: 'PowerHouse' };
      }
      
      const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
      
      if (nameParts.length === 0) {
        return { firstName: 'Cliente', lastName: 'PowerHouse' };
      } else if (nameParts.length === 1) {
        return { firstName: nameParts[0], lastName: 'PowerHouse' };
      } else {
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        return { firstName, lastName };
      }
    };

    const { firstName, lastName } = extractNames(customerName);
    const validEmail = customerEmail && customerEmail.includes('@') ? customerEmail : 'cliente@powerhouse.com.br';

    // Dados básicos do pagador (OBRIGATÓRIO para melhorar aprovação)
    let payerData: any = {
      payer: {
        first_name: firstName,
        last_name: lastName,
        email: validEmail
      }
    };

    // Adicionar endereço se fornecido (para entrega)
    if (deliveryType === 'delivery' && customerAddress) {
      payerData.payer.address = {
        street_name: customerAddress.street,
        street_number: customerAddress.number,
        zip_code: customerAddress.cep.replace(/\D/g, ''),
        city: customerAddress.city,
        state: customerAddress.state,
        country: 'BR'
      };
      
      payerData.shipments = {
        receiver_address: {
          street_name: customerAddress.street,
          street_number: customerAddress.number,
          zip_code: customerAddress.cep.replace(/\D/g, ''),
          city_name: customerAddress.city,
          state_name: customerAddress.state,
          country_name: 'Brasil',
          apartment: customerAddress.complement || undefined
        }
      };
    }
    
    // CORREÇÃO: Configuração mínima e segura
    const preferenceData = {
      items: mercadoPagoItems,
      // CORREÇÃO: Apenas URL de sucesso (obrigatória)
      back_urls: {
        success: `${cleanBaseUrl}/checkout/success`,
        pending: `${cleanBaseUrl}/checkout/pending`,
        failure: `${cleanBaseUrl}/checkout/failure`
      },
      auto_return: 'approved',
      notification_url: `${cleanBaseUrl}/api/webhooks/mercadopago`,
      external_reference: externalReference,
      metadata: {
        external_reference: externalReference,
        coupon_code: appliedCoupon?.code || null,
        original_total: subtotal || 0,
        delivery_type: deliveryType || 'delivery',
        customer_name: customerName || 'Cliente PowerHouse',
        customer_email: validEmail,
        customer_address: customerAddress ? JSON.stringify(customerAddress) : null
      },
      ...payerData
    };

    console.log('🔄 Criando preferência no Mercado Pago...', {
      itemsCount: preferenceData.items.length,
      external_reference: externalReference,
      success_url: preferenceData.back_urls.success
    });

    // Criar preferência no Mercado Pago
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': externalReference
      },
      body: JSON.stringify(preferenceData),
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error('❌ Erro do Mercado Pago:', {
        status: mpResponse.status,
        body: errorText
      });
      
      return res.status(500).json({ 
        error: 'Erro ao criar preferência de pagamento',
        details: errorText,
        status: mpResponse.status
      });
    }

    const preference = await mpResponse.json();
    
    console.log('✅ Preferência criada com sucesso:', {
      id: preference.id,
      init_point: preference.init_point
    });

    return res.status(200).json({
      url: preference.init_point,
      preference_id: preference.id,
      external_reference: externalReference,
      total: total || mercadoPagoItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)
    });

  } catch (error) {
    console.error('❌ Erro geral no checkout:', error);
    
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}