import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { items } = req.body;
    
    console.log('🚀 API Checkout - Iniciado com', items?.length, 'itens');

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

    // URL base
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.origin || 'http://localhost:3000';
    
    // Garantir que baseUrl não termine com '/'
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    
    console.log('🔧 Configurações:', {
      baseUrl: cleanBaseUrl,
      itemsCount: items.length,
      hasToken: !!accessToken
    });

    // Função para processar imagem do Sanity
    const processImageUrl = (image: any): string | undefined => {
      if (!image) return undefined;
      
      // Se é string simples (produtos mock)
      if (typeof image === 'string') {
        return image.startsWith('http') ? image : `${cleanBaseUrl}${image}`;
      }
      
      // Se é objeto do Sanity
      if (image._type === 'image' && image.asset?._ref) {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1sbzjovr";
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
        
        // Converte referência Sanity em URL
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

    // Formata itens para Mercado Pago
    const mercadoPagoItems = items.map((item: any) => {
      const pictureUrl = processImageUrl(item.image);
      
      const formattedItem = {
        id: String(item.id || item._id),
        title: item.title || 'Produto PowerHouse',
        description: item.description || item.title || 'Produto PowerHouse Brasil',
        picture_url: pictureUrl,
        category_id: item.category || 'general',
        quantity: parseInt(item.quantity) || 1,
        currency_id: 'BRL' as const,
        unit_price: parseFloat(Number(item.price).toFixed(2))
      };
      
      console.log(`📦 Item processado: ${formattedItem.title}`, {
        id: formattedItem.id,
        price: formattedItem.unit_price,
        quantity: formattedItem.quantity,
        has_image: !!pictureUrl
      });
      
      return formattedItem;
    });

    // Gera referência externa
    const externalReference = `powerhouse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Cria preferência do Mercado Pago
    const preference = {
      items: mercadoPagoItems,
      external_reference: externalReference,
      back_urls: {
        success: `${cleanBaseUrl}/checkout/success`,
        failure: `${cleanBaseUrl}/checkout/failure`,
        pending: `${cleanBaseUrl}/checkout/pending`
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      shipments: {
        cost: 0,
        mode: 'not_specified'
      },
      payer: {
        name: 'Cliente PowerHouse',
        email: 'cliente@powerhouse.com.br'
      },
      statement_descriptor: 'POWERHOUSE BRASIL',
      binary_mode: false,
      expires: false,
      notification_url: `${cleanBaseUrl}/api/webhooks/mercadopago`
    };

    console.log('🔧 Preferência criada:', {
      external_reference: externalReference,
      back_urls: preference.back_urls,
      items_count: mercadoPagoItems.length,
      clean_base_url: cleanBaseUrl
    });

    // Log da preferência completa para debug
    console.log('📋 Preferência completa enviada:', JSON.stringify(preference, null, 2));

    // Envia para Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Idempotency-Key': externalReference
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro do Mercado Pago:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return res.status(500).json({ 
        error: 'Erro ao criar preferência de pagamento',
        details: process.env.NODE_ENV === 'development' ? errorData : undefined
      });
    }

    const data = await response.json();
    
    console.log('✅ Preferência criada no Mercado Pago:', {
      id: data.id,
      external_reference: externalReference,
      init_point: data.init_point ? 'presente' : 'ausente'
    });

    // Calcula total
    const total = mercadoPagoItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    
    return res.status(200).json({ 
      url: data.init_point,
      id: data.id,
      sandbox_init_point: data.sandbox_init_point,
      external_reference: externalReference,
      total,
      is_test: accessToken.startsWith('TEST-')
    });

  } catch (error: any) {
    console.error('❌ Erro no checkout:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 