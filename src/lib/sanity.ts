import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from '../sanity/env';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_TOKEN,
});

export const getAllPosts = async () => {
  return await sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...10] {
      _id,
      title,
      slug,
      mainImage,
      author->{name},
      publishedAt,
      body
    }`,
  );
};

export const getAllProducts = async () => {
  return await sanityClient.fetch(
    `*[_type == "product"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      image,
      price,
      category,
      description
    }`,
  );
};

export const getProductBySlug = async (slug: string) => {
  return await sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      image,
      price,
      category,
      description
    }`,
    { slug },
  );
};

export const getPostBySlug = async (slug: string) => {
  return await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      mainImage,
      author->{name},
      publishedAt,
      body
    }`,
    { slug },
  );
};
