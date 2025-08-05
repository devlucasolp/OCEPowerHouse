import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import mpClient from '@/app/lib/mercado-pago';
import { sanityClient } from '@/lib/sanity';

export async function POST(req: NextRequest) {
  const { cartItems, userEmail } = await req.json();

  try {
    // Buscar todos os produtos do carrinho no Sanity pelo _id
    const ids = cartItems.map((item: any) => item.id);
    const products = await sanityClient.fetch(
      `*[_type == "product" && _id in $ids]{
        _id,
        title,
        price,
        category,
        description
      }`,
      { ids }
    );

    // Montar os itens para o Mercado Pago
    const items = cartItems.map((item: any) => {
      const product = products.find((p: any) => p._id === item.id);
      return {
        id: product._id,
        title: product.title,
        description: product.description || '',
        quantity: item.quantity || 1,
        unit_price: product.price,
        currency_id: 'BRL',
        category_id: product.category || 'default',
      };
    });

    const preference = new Preference(mpClient);
    const createdPreference = await preference.create({
      body: {
        external_reference: userEmail || '',
        metadata: {
          userEmail,
          cart: items,
        },
        ...(userEmail && {
          payer: {
            email: userEmail,
          },
        }),
        items,
        payment_methods: {
          installments: 12,
        },
        auto_return: 'approved',
        back_urls: {
          success: `${req.headers.get('origin')}/?status=sucesso`,
          failure: `${req.headers.get('origin')}/?status=falha`,
          pending: `${req.headers.get('origin')}/api/mercado-pago/pending`,
        },
      },
    });

    if (!createdPreference.id) {
      throw new Error('No preferenceID');
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
