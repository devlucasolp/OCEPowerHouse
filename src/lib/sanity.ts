import { createClient } from '@sanity/client';
import type { Product } from '../types/product';
import type { Coupon } from '../types/coupon';
import { projectId, dataset, apiVersion } from '../sanity/env';

// Cliente Sanity configurado

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  token: process.env.SANITY_TOKEN,
  perspective: 'published',
  ignoreBrowserTokenWarning: true,
  timeout: 30000, // 30 segundos
  maxRetries: 3,
  retryDelay: (attemptNumber: number) => Math.min(1000 * attemptNumber, 5000)
});

// Função para testar a conexão com o Sanity
export const testSanityConnection = async () => {
  try {
    console.log('🔧 Testando conexão com Sanity...');
    console.log('📍 Project ID:', projectId);
    console.log('🗂️ Dataset:', dataset);
    
    // Testa uma query simples
    const test = await sanityClient.fetch('*[_type == "post"] | order(_updatedAt desc) [0...5] { _id, title, _type, _updatedAt }');
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('📊 Posts encontrados (teste):', test?.length || 0);
    
    if (test && test.length > 0) {
      console.log('📝 Primeiros posts:', test.map((p: any) => ({ id: p._id, title: p.title })));
    }
    
    return {
      success: true,
      projectId,
      dataset,
      postsCount: test?.length || 0,
      testPosts: test || []
    };
  } catch (error) {
    console.error('❌ Erro na conexão com Sanity:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      projectId,
      dataset
    };
  }
};

export const getAllPosts = async () => {
  try {
    console.log('📱 Buscando todos os posts...');
    
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
    
    console.log('📊 Posts retornados:', posts?.length || 0);
    
    if (posts && posts.length > 0) {
      console.log('📝 Lista de posts:', posts.map((p: any) => ({ id: p._id, title: p.title, published: p.publishedAt })));
    } else {
      console.log('⚠️ Nenhum post encontrado no dataset');
    }
    
    return posts || [];
  } catch (error) {
    console.error('❌ Erro ao buscar posts do Sanity:', error);
    return [];
  }
};

export const getAllProducts = async () => {
  try {
    console.log('🔍 Buscando produtos do Sanity...');
    console.log('📍 Project ID:', projectId);
    console.log('🗂️ Dataset:', dataset);
    console.log('📅 API Version:', apiVersion);
    
    const products = await sanityClient.fetch(
      `*[_type == "product"] {
        _id,
        title,
        slug,
        image,
        additionalImages,
        price,
        "category": category->{
          _id,
          title,
          slug,
          description,
          color,
          icon,
          order,
          isActive
        },
        description,
        featured,
        inStock,
        stockQuantity,
        isOnSale,
        originalPrice,
        salePrice,
        saleEndDate,
        variants[]{
          _key,
          name,
          image,
          priceModifier,
          inStock,
          stockQuantity
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
    
    console.log(`✅ ${products?.length || 0} produtos encontrados`);
    return products || [];
  } catch (error) {
    console.error('❌ Erro ao buscar produtos do Sanity:', error);
    console.error('📊 Detalhes do erro:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      projectId,
      dataset,
      apiVersion,
      hasToken: !!process.env.SANITY_TOKEN
    });
    return [];
  }
};

export const getProductsByCategory = async (categorySlug: string) => {
  try {
    const products = await sanityClient.fetch(
      `*[_type == "product" && category->slug.current == $categorySlug] {
        _id,
        title,
        slug,
        image,
        additionalImages,
        price,
        "category": category->{
          _id,
          title,
          slug,
          description,
          color,
          icon,
          order,
          isActive
        },
        description,
        featured,
        inStock,
        stockQuantity,
        isOnSale,
        originalPrice,
        salePrice,
        saleEndDate,
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
      { categorySlug }
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
        additionalImages,
        price,
        category,
        description,
        featured,
        inStock,
        stockQuantity,
        isOnSale,
        originalPrice,
        salePrice,
        saleEndDate,
        variants[]{
          _key,
          name,
          image,
          priceModifier,
          inStock,
          stockQuantity
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
    console.log('🔍 Buscando cupom:', code.toUpperCase());

    const result = await sanityClient.fetch(
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
    
    if (result) {
      console.log('✅ Cupom encontrado:', result.code);
    } else {
      console.log('❌ Cupom não encontrado');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erro ao buscar cupom:', error instanceof Error ? error.message : error);
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
    console.log('🔍 Buscando produtos (método alternativo)...');
    
    const products = await sanityClient.fetch(
      `*[_type == "product"] {
        _id,
        title,
        slug,
        image,
        price,
        "category": category->{
          _id,
          title,
          slug,
          description,
          color,
          icon,
          order,
          isActive
        },
        description,
        featured,
        inStock
      }`
    );
    
    console.log(`✅ ${products?.length || 0} produtos encontrados (alternativo)`);
    return products || [];
  } catch (error) {
    console.error('❌ Erro ao buscar produtos (alternativo):', error);
    return [];
  }
};

// Funções para Categorias
export const getAllCategories = async () => {
  try {
    console.log('🏷️ Buscando categorias do Sanity...');
    
    const categories = await sanityClient.fetch(
      `*[_type == "category" && isActive == true] | order(order asc, title asc) {
        _id,
        title,
        slug,
        description,
        color,
        icon,
        order,
        isActive
      }`
    );
    
    console.log(`✅ ${categories?.length || 0} categorias encontradas`);
    return categories || [];
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    return [];
  }
};

// Funções para Planos
export const getAllPlans = async () => {
  try {
    console.log('💳 Buscando planos do Sanity...');
    
    const plans = await sanityClient.fetch(
      `*[_type == "plan" && ativo == true] | order(ordem asc, valorNumerico asc) {
        _id,
        nome,
        slug,
        valor,
        valorNumerico,
        coach,
        descricao,
        beneficios,
        imagemPlano,
        corDestaque,
        planoDestaque,
        linkCompra,
        textoButton,
        ordem,
        ativo,
        mostrarTituloCoach,
        mostrarTituloCoach
      }`
    );
    
    console.log(`✅ ${plans?.length || 0} planos encontrados`);
    return plans || [];
  } catch (error) {
    console.error('❌ Erro ao buscar planos:', error);
    return [];
  }
};

export const getPlanBySlug = async (slug: string) => {
  try {
    const plan = await sanityClient.fetch(
      `*[_type == "plan" && slug.current == $slug][0] {
        _id,
        nome,
        slug,
        valor,
        valorNumerico,
        coach,
        descricao,
        beneficios,
        imagemPlano,
        corDestaque,
        planoDestaque,
        linkCompra,
        textoButton,
        ordem,
        ativo
      }`,
      { slug }
    );
    
    return plan || null;
  } catch (error) {
    console.error('❌ Erro ao buscar plano por slug:', error);
    return null;
  }
};

// Funções para Coaches
export const getAllCoaches = async () => {
  try {
    console.log('👥 Buscando coaches do Sanity...');
    
    const coaches = await sanityClient.fetch(
      `*[_type == "coach" && ativo == true] | order(ordem asc, name asc) {
        _id,
        name,
        slug,
        role,
        image,
        "bioResumo": bio,

        cardsEstatisticas,
        "badges": badges[].titulo,
        secoesDinamicas,
        "linkPersonalizado": link,
        "redesSociais": [
          {"plataforma": "instagram", "url": redesSociais.instagram},
          {"plataforma": "linkedin", "url": redesSociais.linkedin},
          {"plataforma": "youtube", "url": redesSociais.youtube},
          {"plataforma": "facebook", "url": redesSociais.facebook}
        ][url != null],
        ordem,
        ativo,
        destaque
      }`
    );
    
    console.log(`✅ ${coaches?.length || 0} coaches encontrados`);
    return coaches || [];
  } catch (error) {
    console.error('❌ Erro ao buscar coaches:', error);
    return [];
  }
};

export const getCoachBySlug = async (slug: string) => {
  try {
    const coach = await sanityClient.fetch(
      `*[_type == "coach" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        role,
        image,
        "bioResumo": bio,

        cardsEstatisticas,
         "badges": badges[].titulo,
         secoesDinamicas,
        "linkPersonalizado": link,
        "redesSociais": [
          {"plataforma": "instagram", "url": redesSociais.instagram},
          {"plataforma": "linkedin", "url": redesSociais.linkedin},
          {"plataforma": "youtube", "url": redesSociais.youtube},
          {"plataforma": "facebook", "url": redesSociais.facebook}
        ][url != null],
        ordem,
        ativo,
        destaque
      }`,
      { slug }
    );
    
    return coach || null;
  } catch (error) {
    console.error('❌ Erro ao buscar coach por slug:', error);
    return null;
  }
};