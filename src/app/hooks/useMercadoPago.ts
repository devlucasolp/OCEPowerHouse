import { useEffect, useState } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useRouter } from 'next/navigation';

const useMercadoPago = () => {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      try {
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
        setIsInitialized(true);
        console.log('MercadoPago SDK initialized successfully');
      } catch (error) {
        console.error('Error initializing MercadoPago SDK:', error);
      }
    }
  }, [isInitialized]);

  async function createMercadoPagoCheckout(checkoutData: any) {
    try {
      console.log('Creating MercadoPago checkout with data:', checkoutData);
      
      const response = await fetch('/api/mercado-pago/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Checkout created successfully:', data);

      if (!data.initPoint) {
        throw new Error('No initPoint returned from server');
      }

      // Redirecionar para a página de pagamento do MercadoPago
      window.location.href = data.initPoint;
    } catch (error) {
      console.error('Error creating MercadoPago checkout:', error);
      throw error;
    }
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;
