import { createClient } from '@sanity/client';
import type { Product } from '../types/product';
import type { Coupon } from '../types/coupon';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1sbzjovr";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2023-01-01',
});

export const getAllPosts = async () => {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "...",
        body,
        publishedAt,
        "author": author->{
          _id,
          name,
          image
        },
        "categories": categories[]->{
          _id,
          title
        },
        mainImage
      }`
    );
    return posts || [];
  } catch (error) {
    console.error('❌ Erro ao buscar posts do Sanity:', error);

    return [];
  }
};

export const getAllProducts = async () => {
  try {
    const products = await sanityClient.fetch(
      `*[_type == "product"] {
        _id,
        title,
        slug,
        image,
        price,
        category,
        description,
        featured,
        inStock,
        variants[]{
          _key,
          name,
          image,
          priceModifier,
          inStock
        },
        "applicableCoupons": applicableCoupons[]->{
          _id,
          code,
          title,
          description,
          discountType,
          discountValue,
          minPurchaseAmount,
          maxDiscountAmount,
          usageLimit,
          usageCount,
          startDate,
          endDate,
          isActive,
          applicableCategories,
          excludedProducts
        }
      }`
    );
    
    return products || [];
  } catch (error) {
    console.error('❌ Erro ao buscar produtos do Sanity:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    const products = await sanityClient.fetch(
      `*[_type == "product" && category == $category] {
        _id,
        title,
        slug,
        image,
        price,
        category,
        description,
        featured,
        inStock,
        variants[]{
          _key,
          name,
          image,
          priceModifier,
          inStock
        },
        "applicableCoupons": applicableCoupons[]->{
          _id,
          code,
          title,
          description,
          discountType,
          discountValue,
          minPurchaseAmount,
          maxDiscountAmount,
          usageLimit,
          usageCount,
          startDate,
          endDate,
          isActive,
          applicableCategories,
          excludedProducts
        }
      }`,
      { category }
    );
    
    return products || [];
  } catch (error) {
    console.error('❌ Erro ao buscar produtos por categoria:', error);

    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    return await sanityClient.fetch(
      `*[_type == "product" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        image,
        price,
        category,
        description,
        featured,
        inStock,
        variants[]{
          _key,
          name,
          image,
          priceModifier,
          inStock
        },
        "applicableCoupons": applicableCoupons[]->{
          _id,
          code,
          title,
          description,
          discountType,
          discountValue,
          minPurchaseAmount,
          maxDiscountAmount,
          usageLimit,
          usageCount,
          startDate,
          endDate,
          isActive,
          applicableCategories,
          excludedProducts
        }
      }`,
      { slug }
    );
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

// NOVAS FUNÇÕES PARA CUPONS

export const getAllCoupons = async (): Promise<Coupon[]> => {
  try {
    const coupons = await sanityClient.fetch(
      `*[_type == "coupon"] | order(_createdAt desc) {
        _id,
        code,
        title,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        usageCount,
        startDate,
        endDate,
        isActive,
        applicableCategories,
        "excludedProducts": excludedProducts[]->_id
      }`
    );
    
    return coupons || [];
  } catch (error) {
    console.error('❌ Erro ao buscar cupons do Sanity:', error);
    return [];
  }
};

export const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  try {
    return await sanityClient.fetch(
      `*[_type == "coupon" && code == $code][0] {
        _id,
        code,
        title,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        usageCount,
        startDate,
        endDate,
        isActive,
        applicableCategories,
        "excludedProducts": excludedProducts[]->_id
      }`,
      { code: code.toUpperCase() }
    );
  } catch (error) {
    console.error('❌ Erro ao buscar cupom por código:', error);
    return null;
  }
};

export const getActiveCoupons = async (): Promise<Coupon[]> => {
  try {
    const now = new Date().toISOString();
    const coupons = await sanityClient.fetch(
      `*[_type == "coupon" && isActive == true && (startDate == null || startDate <= $now) && (endDate == null || endDate >= $now)] | order(_createdAt desc) {
        _id,
        code,
        title,
        description,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        usageLimit,
        usageCount,
        startDate,
        endDate,
        isActive,
        applicableCategories,
        "excludedProducts": excludedProducts[]->_id
      }`,
      { now }
    );
    
    return coupons || [];
  } catch (error) {
    console.error('❌ Erro ao buscar cupons ativos:', error);
    return [];
  }
};

export const getPostBySlug = async (slug: string) => {
  try {
    return await sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        _id,
        _type,
        title,
        slug,
        body,
        publishedAt,
        "author": author->{
          _id,
          name,
          image
        },
        "categories": categories[]->{
          _id,
          title
        },
        mainImage
      }`,
      { slug }
    );
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

export const getAllProductsAlternative = async () => {
  try {
    const products = await sanityClient.fetch(
      `*[_type == "product"] {
        _id,
        title,
        slug,
        image,
        price,
        category,
        description,
        featured,
        inStock,
        variants[]{
          _key,
          name,
          image,
          priceModifier,
          inStock
        },
        "applicableCoupons": applicableCoupons[]->{
          _id,
          code,
          title,
          description,
          discountType,
          discountValue,
          minPurchaseAmount,
          maxDiscountAmount,
          usageLimit,
          usageCount,
          startDate,
          endDate,
          isActive,
          applicableCategories,
          excludedProducts
        }
      }`
    );
    
    return products || [];
  } catch (error) {
    console.error('❌ Erro ao buscar produtos (alternativo):', error);
    return [];
  }
};