import type { Coupon } from './coupon';

export interface ProductVariant {
  _key?: string;
  name?: string;
  image?: any;
  priceModifier?: number;
  inStock?: boolean;
}

export interface ShippingDimensions {
  weight: number; // Peso em quilogramas (kg)
  width: number;  // Largura em centímetros (cm)
  height: number; // Altura em centímetros (cm)
  length: number; // Comprimento em centímetros (cm)
}

export interface Product {
  _id: string;
  id?: string; // compatibilidade com produtos mockados
  title: string;
  slug: string | { current: string };
  image?: any;
  price: number;
  shippingCost?: number; // Valor do frete (padrão R$ 25,00)
  category: string;
  description: string | any;
  featured?: boolean;
  inStock?: boolean;
  variants?: ProductVariant[];
  applicableCoupons?: Coupon[]; // Cupons que podem ser aplicados a este produto
  shippingDimensions?: ShippingDimensions; // Dimensões para cálculo de frete via Melhor Envio
}