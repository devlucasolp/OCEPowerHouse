export interface Post {
  _id: string;
  id?: string; // compatibilidade
  title: string;
  slug: string | { current: string };
  mainImage?: any;
  author?: { name: string } | string;
  publishedAt?: string;
  body: any;
}
