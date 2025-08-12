export class ImageProcessor {
  private readonly projectId: string;
  private readonly dataset: string;

  constructor() {
    this.projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1sbzjovr";
    this.dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  }

  /**
   * Processa imagem de forma inteligente para o Mercado Pago
   */
  processProductImage(image: any): string | undefined {
    if (!image) return undefined;
    
    try {
      // Método 1: Se é uma string (produtos mock), usa diretamente
      if (typeof image === 'string') {
        return this.processStringImage(image);
      }
      
      // Método 2: Se é um objeto do Sanity, tenta extrair URL
      if (image.asset) {
        return this.processSanityImage(image);
      }
      
      console.warn('Formato de imagem não reconhecido:', image);
      return undefined;
      
    } catch (error) {
      console.error('Erro ao processar imagem do produto:', error);
      return undefined;
    }
  }

  /**
   * Processa imagem quando é uma string
   */
  private processStringImage(image: string): string {
    // Se for um caminho relativo, adiciona o domínio base
    if (!image.startsWith('http')) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      return `${baseUrl}${image}`;
    }
    return image;
  }

  /**
   * Processa imagem do Sanity
   */
  private processSanityImage(image: any): string | undefined {
    // Tenta usar asset.url se disponível
    if (image.asset.url) {
      return image.asset.url;
    }
    
    // Se tem _ref, constrói URL direta do Sanity
    if (image.asset._ref && image.asset._ref.startsWith('image-')) {
      return this.buildSanityImageUrl(image.asset._ref);
    }

    return undefined;
  }

  /**
   * Constrói URL direta do Sanity a partir da referência
   */
  private buildSanityImageUrl(assetRef: string): string | undefined {
    try {
      const parts = assetRef.replace('image-', '').split('-');
      const imageId = parts[0];
      const dimensions = parts[1];
      const format = parts[2];
      
      return `https://cdn.sanity.io/images/${this.projectId}/${this.dataset}/${imageId}-${dimensions}.${format}`;
    } catch (error) {
      console.warn('Erro ao processar referência de imagem Sanity:', error);
      return undefined;
    }
  }

  /**
   * Valida se uma URL de imagem é válida
   */
  isValidImageUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }
} 