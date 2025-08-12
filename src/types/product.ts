export interface ProductVariant {
  _key?: string;
  name: string;
  image?: any;
  priceModifier?: number;
  inStock?: boolean;
}

export interface Product {
  _id: string;
  id?: string; // compatibilidade com produtos mockados
  title: string;
  slug: string | { current: string };
  image?: any;
  price: number;
  category: string;
  description: string | any;
  featured?: boolean;
  inStock?: boolean;
  variants?: ProductVariant[];
}