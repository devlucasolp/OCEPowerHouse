import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { items, subtotal, appliedCoupon, total } = req.body;
    
    console.log('🚀 API Checkout - Iniciado com', items?.length, 'itens');
    console.log('💰 Valores recebidos:', { subtotal, appliedCoupon, total });

    // Validações básicas
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Itens inválidos' });
    }

    if (items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // Configuração do Mercado Pago
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ error: 'Token do Mercado Pago não configurado' });
    }

    // URL base - garantir que seja HTTPS em produção
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.origin || 'http://localhost:3000';
    
    // Garantir que a URL seja válida
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }
    
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    
    console.log('🔧 Configurações:', {
      baseUrl: cleanBaseUrl,
      itemsCount: items.length,
      hasToken: !!accessToken,
      hasCoupon: !!appliedCoupon
    });

    // Função para processar imagem do Sanity
    const processImageUrl = (image: any): string | undefined => {
      if (!image) return undefined;
      
      if (typeof image === 'string') {
        return image.startsWith('http') ? image : `${cleanBaseUrl}${image}`;
      }
      
      if (image._type === 'image' && image.asset?._ref) {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1sbzjovr";
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
        
        const ref = image.asset._ref;
        if (ref.startsWith('image-')) {
          try {
            const parts = ref.replace('image-', '').split('-');
            const imageId = parts[0];
            const dimensions = parts[1];
            const format = parts[2];
            
            return `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}-${dimensions}.${format}`;
          } catch (error) {
            console.warn('Erro ao processar imagem Sanity:', error);
          }
        }
      }
      
      return undefined;
    };

    // Formata itens para Mercado Pago com validação mais rigorosa
    const mercadoPagoItems = items.map((item: any, index: number) => {
      const pictureUrl = processImageUrl(item.image);
      
      // Validar dados do item
      let price = parseFloat(Number(item.price || 0).toFixed(2));
      const quantity = parseInt(item.quantity || 1);
      
      if (price <= 0) {
        throw new Error(`Item ${index + 1}: Preço inválido (${price})`);
      }
      
      if (quantity <= 0) {
        throw new Error(`Item ${index + 1}: Quantidade inválida (${quantity})`);
      }

      // AJUSTE: Se há cupom aplicado, calcular preço unitário com desconto
      if (appliedCoupon && appliedCoupon.discountAmount > 0) {
        const itemTotal = price * quantity;
        const discountPercentage = appliedCoupon.discountAmount / (subtotal || itemTotal);
        const itemDiscount = itemTotal * discountPercentage;
        price = (itemTotal - itemDiscount) / quantity;
        
        console.log(`🎫 Item ${index + 1} com cupom aplicado:`, {
          originalPrice: parseFloat(Number(item.price || 0).toFixed(2)),
          discountAmount: itemDiscount.toFixed(2),
          newPrice: price.toFixed(2)
        });
      }

      const formattedItem = {
        id: String(item.id || item._id || `item-${index + 1}`),
        title: String(item.title || 'Produto PowerHouse').substring(0, 256),
        description: String(item.description || item.title || 'Produto PowerHouse Brasil').substring(0, 600),
        picture_url: pictureUrl,
        category_id: String(item.category || 'general'),
        quantity: quantity,
        currency_id: 'BRL' as const,
        unit_price: parseFloat(price.toFixed(2))
      };
      
      console.log(`📦 Item ${index + 1} processado: ${formattedItem.title}`, {
        id: formattedItem.id,
        price: formattedItem.unit_price,
        quantity: formattedItem.quantity,
        has_image: !!pictureUrl,
        has_coupon_discount: appliedCoupon && appliedCoupon.discountAmount > 0
      });
      
      return formattedItem;
    });

    // Gera referência externa
    const externalReference = `powerhouse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calcular total dos itens (agora já com desconto aplicado se houver)
    const itemsTotal = mercadoPagoItems.reduce((acc, item) => {
      return acc + (item.unit_price * item.quantity);
    }, 0);
    
    // Usar o total recebido do frontend (que já tem desconto) ou total calculado
    const finalTotal = total && total > 0 ? 
      parseFloat(total.toFixed(2)) : 
      parseFloat(itemsTotal.toFixed(2));
    
    console.log('💰 Totais calculados:', {
      originalSubtotal: subtotal || 0,
      itemsTotalWithDiscount: itemsTotal.toFixed(2),
      finalTotalSent: finalTotal.toFixed(2),
      hasCouponDiscount: appliedCoupon && appliedCoupon.discountAmount > 0,
      couponCode: appliedCoupon?.code || 'nenhum',
      discountAmount: appliedCoupon?.discountAmount || 0
    });

    // URLs de retorno - certificar que estão completas e válidas
    const backUrls = {
      success: `${cleanBaseUrl}/checkout/success`,
      failure: `${cleanBaseUrl}/checkout/failure`,
      pending: `${cleanBaseUrl}/checkout/pending`
    };

    // Validar se as URLs são válidas
    Object.entries(backUrls).forEach(([key, url]) => {
      try {
        new URL(url);
      } catch (error) {
        throw new Error(`URL inválida para ${key}: ${url}`);
      }
    });

    console.log('🔗 URLs de retorno configuradas e validadas:', backUrls);

    // Configuração da preferência - versão sem auto_return
    const preferenceData: any = {
      items: mercadoPagoItems,
      back_urls: backUrls,
      external_reference: externalReference,
      notification_url: `${cleanBaseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: 'POWERHOUSE BRASIL',
      metadata: {
        store_name: 'PowerHouse Brasil',
        external_reference: externalReference,
        coupon_applied: appliedCoupon ? appliedCoupon.code : null,
        discount_amount: appliedCoupon ? appliedCoupon.discountAmount : 0,
        original_total: subtotal || itemsTotal,
        final_total: finalTotal
      }
    };

    console.log('🔄 Criando preferência no Mercado Pago...', {
      itemsCount: preferenceData.items.length,
      total: finalTotal,
      external_reference: externalReference,
      coupon: appliedCoupon?.code || 'nenhum',
      success_url: backUrls.success
    });

    // Log da preferência completa para debug
    console.log('📋 Dados enviados para MP:', JSON.stringify(preferenceData, null, 2));

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

    const responseText = await mpResponse.text();
    
    if (!mpResponse.ok) {
      console.error('❌ Erro do Mercado Pago:', {
        status: mpResponse.status,
        statusText: mpResponse.statusText,
        headers: Object.fromEntries(mpResponse.headers.entries()),
        body: responseText
      });
      
      let errorMessage = 'Erro ao criar preferência de pagamento';
      
      try {
        const errorData = JSON.parse(responseText);
        console.error('❌ Detalhes do erro MP:', errorData);
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.cause && errorData.cause.length > 0) {
          const cause = errorData.cause[0];
          errorMessage = cause.description || cause.code || errorMessage;
          console.error('❌ Causa específica:', cause);
        }
      } catch (e) {
        console.error('❌ Erro ao fazer parse da resposta de erro:', e);
      }
      
      return res.status(500).json({ 
        error: errorMessage,
        details: responseText,
        status: mpResponse.status
      });
    }

    let preference;
    try {
      preference = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Erro ao fazer parse da resposta do MP:', responseText);
      return res.status(500).json({ 
        error: 'Resposta inválida do Mercado Pago',
        details: responseText
      });
    }
    
    console.log('✅ Preferência criada com sucesso:', {
      id: preference.id,
      init_point: preference.init_point,
      external_reference: preference.external_reference
    });

    return res.status(200).json({
      url: preference.init_point,
      preference_id: preference.id,
      external_reference: externalReference,
      total: finalTotal,
      coupon_applied: appliedCoupon?.code || null,
      discount_amount: appliedCoupon?.discountAmount || 0
    });

  } catch (error) {
    console.error('❌ Erro geral no checkout:', error);
    
    let errorMessage = 'Erro interno do servidor';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.stack : 'Erro desconhecido'
    });
  }
} 