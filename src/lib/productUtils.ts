import { getImageUrl } from './sanityImage';
import type { Product } from '../types/product';

/**
 * Normaliza um produto para garantir compatibilidade
 * entre produtos do Sanity e produtos mock
 */
export const normalizeProduct = (product: any): Product => {
  return {
    _id: product._id || product.id || `temp-${Date.now()}`,
    id: product.id || product._id,
    title: product.title || product.name || 'Produto',
    slug: product.slug || { current: product.slug?.current || 'produto' },
    image: product.image,
    price: Number(product.price) || 0,
    // FRETE FIXO REMOVIDO - AGORA CALCULADO DINAMICAMENTE VIA MELHOR ENVIO
    category: product.category || 'Geral',
    description: product.description || 'Produto PowerHouse',
    featured: Boolean(product.featured),
    inStock: product.inStock !== false, // assume true se não especificado
    variants: product.variants || []
  };
};

/**
 * Obtém URL da imagem de um produto de forma inteligente
 */
export const getProductImageUrl = (product: Product, width?: number, height?: number): string => {
  if (!product.image) return '/img/placeholder.jpg';
  
  // Se é uma string (produtos mock), usa diretamente
  if (typeof product.image === 'string') {
    return product.image;
  }
  
  // Se é um objeto do Sanity, processa com getImageUrl
  const sanityImageUrl = getImageUrl(product.image, width, height);
  return sanityImageUrl || '/img/placeholder.jpg';
};

/**
 * Valida se um produto tem todos os dados necessários para checkout
 */
export const validateProductForCheckout = (product: Product): boolean => {
  return !!(
    (product.id || product._id) &&
    product.title &&
    product.price &&
    product.price > 0
  );
};

/**
 * Obtém o valor do frete de um produto (padrão R$ 25,00)
 */
export const getShippingCost = (product: Product): number => {
  return product.shippingCost || 30.00;
};

/**
 * Calcula o frete total do carrinho
 * Como temos frete fixo, retorna sempre R$ 30,00 independente da quantidade
 */
export const calculateCartShipping = (products: Product[]): number => {
  // Se não há produtos, frete é zero
  if (products.length === 0) return 0;
  
  // Retorna frete fixo de R$ 30,00
  return 30.00;
};

/**
 * Prepara um produto para ser enviado ao Mercado Pago
 */
export const prepareProductForCheckout = (product: Product & { quantity?: number }) => {
  const normalized = normalizeProduct(product);
  
  if (!validateProductForCheckout(normalized)) {
    throw new Error(`Produto inválido para checkout: ${normalized.title}`);
  }
  
  return {
    ...normalized,
    quantity: product.quantity || 1
  };
};