import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './sanity';

export const urlFor = (source: any) => imageUrlBuilder(sanityClient).image(source);
