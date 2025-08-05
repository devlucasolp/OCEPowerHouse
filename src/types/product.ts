export interface Product {
  _id: string;
  id?: string; // compatibilidade com produtos mockados
  title: string;
  slug: string | { current: string };
  image?: any;
  price: number;
  category: string;
  description: string;
}
