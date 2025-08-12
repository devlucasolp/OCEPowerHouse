import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityClient } from './sanity';

// Configuração do builder de imagens
const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

// Função para converter referência de asset em URL direta
const getDirectImageUrl = (assetRef: string, projectId: string = "1sbzjovr", dataset: string = "production") => {
  if (!assetRef || !assetRef.startsWith('image-')) return null;
  
  try {
    // Extrair ID, dimensões e formato da referência
    const parts = assetRef.replace('image-', '').split('-');
    const imageId = parts[0];
    const dimensions = parts[1];
    const format = parts[2];
    
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}-${dimensions}.${format}`;
  } catch (error) {
    console.error('Erro ao processar referência de imagem:', error);
    return null;
  }
};

// Função auxiliar para gerar URL com fallback
export const getImageUrl = (image: any, width?: number, height?: number) => {
  if (!image) return null;
  
  console.log('getImageUrl - Entrada:', image);
  
  try {
    // Método 1: Tentar usar urlFor do Sanity
    if (image.asset) {
      let url = urlFor(image);
      if (width) url = url.width(width);
      if (height) url = url.height(height);
      const generatedUrl = url.url();
      console.log('getImageUrl - URL gerada pelo urlFor:', generatedUrl);
      return generatedUrl;
    }
    
    // Método 2: Se só temos a referência, usar URL direta
    if (image.asset && image.asset._ref) {
      const directUrl = getDirectImageUrl(image.asset._ref);
      console.log('getImageUrl - URL direta:', directUrl);
      return directUrl;
    }
    
    // Método 3: Se a imagem é só uma string de referência
    if (typeof image === 'string' && image.startsWith('image-')) {
      const directUrl = getDirectImageUrl(image);
      console.log('getImageUrl - URL da string:', directUrl);
      return directUrl;
    }
    
    console.log('getImageUrl - Nenhum método funcionou');
    return null;
  } catch (error) {
    console.error('Erro ao gerar URL da imagem:', error);
    
    // Fallback: tentar URL direta se temos asset._ref
    if (image?.asset?._ref) {
      const fallbackUrl = getDirectImageUrl(image.asset._ref);
      console.log('getImageUrl - URL de fallback:', fallbackUrl);
      return fallbackUrl;
    }
    
    return null;
  }
}; 