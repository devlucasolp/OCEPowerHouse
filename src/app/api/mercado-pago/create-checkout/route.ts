import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import mpClient from '@/app/lib/mercado-pago';
import { sanityClient } from '@/lib/sanity';

export async function POST(req: NextRequest) {
  try {
    const { cartItems, userEmail } = await req.json();
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error('Invalid cart items:', cartItems);
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    if (!userEmail) {
      console.error('Missing user email');
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }
    
    console.log('Creating checkout for:', { cartItems, userEmail });
    // Buscar todos os produtos do carrinho no Sanity pelo _id
    const ids = cartItems.map((item: any) => item._id || item.id);
    console.log('Fetching products with ids:', ids);
    
    // Consulta GROQ para buscar produtos no Sanity
    // Nota: No Sanity, os documentos têm um ID interno que começa com 'drafts.' para rascunhos
    // Vamos tentar buscar tanto pelo ID direto quanto pelo ID sem o prefixo 'drafts.'
    const products = await sanityClient.fetch(
      `*[_type == "product" && (_id in $ids || _id in $draftIds)]{
        _id,
        title,
        price,
        category,
        description
      }`,
      { 
        ids,
        draftIds: ids.map((id: string) => id.startsWith('drafts.') ? id : `drafts.${id}`)
      },
    );
    
    if (!products || products.length === 0) {
      console.error('No products found in Sanity with ids:', ids);
      return NextResponse.json({ error: 'Products not found' }, { status: 404 });
    }
    
    console.log('Products fetched successfully:', products);

    // Montar os itens para o Mercado Pago
    // Primeiro, vamos filtrar quaisquer itens que possam causar problemas
    const validCartItems = cartItems.filter((item: any) => {
      if (!item || typeof item !== 'object') {
        console.error('Invalid cart item (not an object):', item);
        return false;
      }
      return true;
    });
    
    if (validCartItems.length === 0) {
      console.error('No valid cart items found');
      return NextResponse.json({ error: 'No valid cart items found' }, { status: 400 });
    }
    
    const items = validCartItems.map((item: any) => {
      try {
        const itemId = item._id || item.id;
        const product = products.find((p: any) => p._id === itemId);
        
        if (!product) {
          // Se não encontrar o produto no Sanity, use os dados do carrinho
          // Isso pode acontecer se o produto foi adicionado ao carrinho com variantes
          console.log(`Product not found in Sanity, using cart data for: ${itemId}`);
          
          // Verificar se o item do carrinho tem todas as informações necessárias
          if (!item.title || typeof item.price !== 'number' || isNaN(item.price)) {
            console.error('Invalid cart item data:', item);
            throw new Error(`Invalid cart item data for id: ${itemId}`);
          }
          
          return {
            id: itemId,
            title: item.title,
            description: item.description || '',
            quantity: item.quantity || 1,
            unit_price: item.price,
            currency_id: 'BRL',
            category_id: item.category || 'default',
          };
        }
        
        // Se encontrou o produto no Sanity, use os dados do Sanity
        // mas considere possíveis variantes do carrinho (preço pode ser diferente)
        const price = typeof item.price === 'number' && !isNaN(item.price) 
          ? item.price 
          : product.price;
        
        if (typeof price !== 'number' || isNaN(price)) {
          console.error(`Invalid price for product: ${product.title}`, price);
          throw new Error(`Invalid price for product: ${product.title}`);
        }
        
        return {
          id: product._id,
          title: product.title + (item.variant ? ` - ${item.variant}` : ''),
          description: product.description || '',
          quantity: item.quantity || 1,
          unit_price: price,
          currency_id: 'BRL',
          category_id: product.category || 'default',
        };
      } catch (error) {
        console.error(`Error processing item:`, item, error);
        throw new Error(`Error processing item: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
    
    // Log the cart items structure to help diagnose issues
    console.log('Original cart items:', JSON.stringify(cartItems.map(item => {
      // Create a safe copy without complex objects that can't be stringified
      const safeCopy = { ...item };
      if (safeCopy.image && typeof safeCopy.image === 'object') {
        safeCopy.image = '[Complex Image Object]';
      }
      return safeCopy;
    }), null, 2));
    
    console.log('Items prepared for MercadoPago:', JSON.stringify(items, null, 2));
    
    // Filtrar itens inválidos (undefined) que podem ter sido retornados por erros no map
    const validItems = items.filter(item => item !== undefined);
    
    if (validItems.length === 0) {
      console.error('No valid items found for checkout');
      return NextResponse.json({ error: 'No valid items found for checkout' }, { status: 400 });
    }
    
    // Verificar se todos os itens têm as propriedades necessárias
    const invalidItems = validItems.filter(item => {
      return !item.title || typeof item.unit_price !== 'number' || isNaN(item.unit_price);
    });
    
    if (invalidItems.length > 0) {
      console.error('Some items have invalid data:', invalidItems);
      return NextResponse.json({ error: 'Some items have invalid data for checkout' }, { status: 400 });
    }

    const preference = new Preference(mpClient);
    console.log('Creating preference with MercadoPago client');
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get('origin') || 'http://localhost:3000';
    
    const preferenceData = {
      body: {
        external_reference: userEmail,
        metadata: {
          userEmail,
          teste_id: 'teste-123', // Exemplo de metadado adicional
        },
        payer: {
          email: userEmail,
        },
        items: validItems, // Usar os itens validados
        payment_methods: {
          excluded_payment_types: [
            // Você pode excluir métodos de pagamento se necessário
            // { id: "ticket" }
          ],
          installments: 12,
        },
        auto_return: 'approved',
        back_urls: {
          success: `${baseUrl}/api/mercado-pago/success`,
          failure: `${baseUrl}/api/mercado-pago/failure`,
          pending: `${baseUrl}/api/mercado-pago/pending`,
        },
        notification_url: `${baseUrl}/api/mercado-pago/webhook`,
        statement_descriptor: 'OCE PowerHouse'
      },
    };
    
    console.log('Preference data:', JSON.stringify(preferenceData, null, 2));
    
    const createdPreference = await preference.create(preferenceData);

    if (!createdPreference.id) {
      console.error('No preferenceID returned from MercadoPago');
      throw new Error('No preferenceID');
    }
    
    console.log('Preference created successfully:', {
      id: createdPreference.id,
      init_point: createdPreference.init_point
    });

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (err) {
    console.error('Error creating MercadoPago checkout:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error creating checkout' },
      { status: 500 }
    );
  }
}
