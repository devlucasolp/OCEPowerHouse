import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from '../sanity/env';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_TOKEN,
});

// GROQ queries seguindo as melhores práticas
const postQuery = `*[_type == "post"] {
  _id,
  title,
  slug,
  mainImage {
    asset-> {
      _id,
      url
    },
    alt
  },
  author-> {
    name,
    slug,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  publishedAt,
  body,
  categories[]-> {
    title,
    slug
  }
}`;

const productQuery = `*[_type == "product"] {
  _id,
  title,
  slug,
  price,
  category,
  description,
  image {
    asset-> {
      _id,
      url
    },
    alt
  },
  featured,
  inStock
}`;

const powercampQuery = `*[_type == "powercamp"] {
  _id,
  title,
  slug,
  image {
    asset-> {
      _id,
      url
    },
    alt
  },
  date,
  description,
  year,
  location,
  featured
}`;

// Posts functions
export const getAllPosts = async () => {
  return await sanityClient.fetch(`${postQuery} | order(publishedAt desc)[0...10]`);
};

export const getPostBySlug = async (slug: string) => {
  return await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      mainImage {
        asset-> {
          _id,
          url
        },
        alt
      },
      author-> {
        name,
        slug,
        image {
          asset-> {
            _id,
            url
          }
        }
      },
      publishedAt,
      body,
      categories[]-> {
        title,
        slug
      }
    }`,
    { slug },
  );
};

export const getFeaturedPosts = async (limit = 3) => {
  return await sanityClient.fetch(`${postQuery} | order(publishedAt desc)[0...${limit}]`);
};

// Products functions
export const getAllProducts = async () => {
  return await sanityClient.fetch(`${productQuery} | order(_createdAt desc)`);
};

export const getProductBySlug = async (slug: string) => {
  return await sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      price,
      category,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      featured,
      inStock
    }`,
    { slug },
  );
};

export const getFeaturedProducts = async (limit = 6) => {
  return await sanityClient.fetch(
    `${productQuery}[featured == true] | order(_createdAt desc)[0...${limit}]`,
  );
};

export const getProductsByCategory = async (category: string) => {
  return await sanityClient.fetch(
    `${productQuery}[category == $category] | order(_createdAt desc)`,
    { category },
  );
};

// Powercamps functions
export const getAllPowercamps = async () => {
  return await sanityClient.fetch(`${powercampQuery} | order(date desc)`);
};

export const getPowercampBySlug = async (slug: string) => {
  return await sanityClient.fetch(
    `*[_type == "powercamp" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      date,
      description,
      year,
      location,
      featured
    }`,
    { slug },
  );
};

export const getFeaturedPowercamps = async (limit = 3) => {
  return await sanityClient.fetch(
    `${powercampQuery}[featured == true] | order(date desc)[0...${limit}]`,
  );
};

export const getPowercampsByYear = async (year: number) => {
  return await sanityClient.fetch(`${powercampQuery}[year == $year] | order(date desc)`, { year });
};

// Utility functions
export const getAllCategories = async () => {
  return await sanityClient.fetch(
    `*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`,
  );
};

export const getAllAuthors = async () => {
  return await sanityClient.fetch(
    `*[_type == "author"] | order(name asc) {
      _id,
      name,
      slug,
      image {
        asset-> {
          _id,
          url
        }
      },
      bio
    }`,
  );
};

// Search functions
export const searchContent = async (searchTerm: string) => {
  const query = `*[
    _type in ["post", "product", "powercamp"] && 
    (title match $searchTerm || description match $searchTerm)
  ] {
    _type,
    _id,
    title,
    slug,
    description,
    "imageUrl": image.asset->url
  }`;

  return await sanityClient.fetch(query, {
    searchTerm: `*${searchTerm}*`,
  });
};
