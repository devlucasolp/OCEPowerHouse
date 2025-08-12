import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from '../sanity/env';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Desabilita CDN para development/debug
  token: process.env.SANITY_TOKEN || process.env.SANITY_TOKEN2,
  perspective: 'previewDrafts', // Inclui drafts para ver conteúdo não publicado
});

export const getAllPosts = async () => {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "post"] | order(publishedAt desc)[0...10] {
        _id,
        _type,
        title,
        slug,
        mainImage{
          asset->{
            _id,
            url,
            originalFilename,
            extension,
            size
          },
          alt,
          crop,
          hotspot
        },
        author->{
          _id,
          name,
          slug
        },
        publishedAt,
        body,
        categories[]->{
          _id,
          title
        },
        _createdAt,
        _updatedAt
      }`
    );

    console.log('Posts fetched from Sanity:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    return [];
  }
};

export const getAllProducts = async () => {
  try {
    return await sanityClient.fetch(
      `*[_type == "product"] | order(_createdAt desc) {
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
        }
      }`
    );
  } catch (error) {
    console.error('Error fetching products from Sanity:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    return await sanityClient.fetch(
      `*[_type == "product" && category == $category] | order(_createdAt desc) {
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
        }
      }`,
      { category }
    );
  } catch (error) {
    console.error('Error fetching products by category from Sanity:', error);
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
        }
      }`,
      { slug }
    );
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

export const getPostBySlug = async (slug: string) => {
  try {
    const post = await sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        _id,
        _type,
        title,
        slug,
        mainImage{
          asset->{
            _id,
            url,
            originalFilename,
            extension,
            size
          },
          alt,
          crop,
          hotspot
        },
        author->{
          _id,
          name,
          slug
        },
        publishedAt,
        body,
        categories[]->{
          _id,
          title
        },
        _createdAt,
        _updatedAt
      }`,
      { slug }
    );

    console.log('Post fetched from Sanity:', post);
    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

// Função para buscar apenas posts com imagens
export const getPostsWithImages = async () => {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "post" && defined(mainImage)] | order(publishedAt desc)[0...10] {
        _id,
        _type,
        title,
        slug,
        mainImage{
          asset->{
            _id,
            url,
            originalFilename,
            extension,
            size
          },
          alt,
          crop,
          hotspot
        },
        author->{
          _id,
          name,
          slug
        },
        publishedAt,
        body,
        categories[]->{
          _id,
          title
        },
        _createdAt,
        _updatedAt
      }`
    );

    console.log('Posts with images fetched from Sanity:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching posts with images from Sanity:', error);
    return [];
  }
};

// Função para atualizar um post com uma imagem (para teste)
export const updatePostWithImage = async (postId: string, imageAssetRef: string) => {
  try {
    const result = await sanityClient
      .patch(postId)
      .set({
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetRef
          }
        }
      })
      .commit();

    console.log('Post updated with image:', result);
    return result;
  } catch (error) {
    console.error('Error updating post with image:', error);
    return null;
  }
};

// Função para testar a conexão com o Sanity
export const testSanityConnection = async () => {
  try {
    const result = await sanityClient.fetch('*[_type == "post"][0...3]{_id, title}');
    console.log('Sanity connection test successful:', result);
    return result;
  } catch (error) {
    console.error('Sanity connection test failed:', error);
    return null;
  }
};