import { MercadoPagoItem, ProcessedItem } from '../types';
import { ImageProcessor } from './image.processor';
import { validateProductForCheckout, normalizeProduct } from '../../../lib/productUtils';

export class ItemProcessor {
  private readonly imageProcessor: ImageProcessor;

  constructor() {
    this.imageProcessor = new ImageProcessor();
  }

  /**
   * Processa e valida itens do carrinho
   */
  processCartItems(cartItems: any[]): MercadoPagoItem[] {
    const validatedItems = this.validateAndNormalizeItems(cartItems);
    const formattedItems = this.formatItemsForMercadoPago(validatedItems);
    
    this.validateFormattedItems(formattedItems);
    
    return formattedItems;
  }

  /**
   * Valida e normaliza itens do carrinho
   */
  private validateAndNormalizeItems(items: any[]): ProcessedItem[] {
    const validatedItems: ProcessedItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      try {
        const normalizedItem = normalizeProduct(item);
        
        if (!validateProductForCheckout(normalizedItem)) {
          throw new Error(`Produto inválido: ${item.title || 'sem título'}`);
        }
        
        validatedItems.push({
          id: normalizedItem.id || normalizedItem._id,
          title: normalizedItem.title,
          description: normalizedItem.description,
          image: normalizedItem.image,
          price: normalizedItem.price,
          category: normalizedItem.category,
          quantity: item.quantity || 1
        });
        
      } catch (error) {
        console.error(`❌ Erro ao processar produto ${i}:`, error);
        throw error;
      }
    }

    console.log('✅ Produtos validados:', validatedItems.length);
    return validatedItems;
  }

  /**
   * Formata itens para o formato do Mercado Pago
   */
  private formatItemsForMercadoPago(items: ProcessedItem[]): MercadoPagoItem[] {
    return items.map((item) => {
      const pictureUrl = this.imageProcessor.processProductImage(item.image);

      const formattedItem: MercadoPagoItem = {
        id: String(item.id),
        title: item.title || 'Produto PowerHouse',
        description: item.description || item.title || 'Produto PowerHouse Brasil',
        picture_url: pictureUrl,
        category_id: item.category || 'general',
        quantity: parseInt(String(item.quantity)) || 1,
        currency_id: 'BRL',
        unit_price: parseFloat(Number(item.price).toFixed(2))
      };

      // Log para debugging
      console.log('📦 Item formatado para MP:', {
        original_id: item.id,
        original_image: typeof item.image,
        processed_image: pictureUrl ? 'URL válida' : 'sem imagem',
        title: formattedItem.title,
        price: formattedItem.unit_price
      });

      return formattedItem;
    });
  }

  /**
   * Valida itens formatados
   */
  private validateFormattedItems(items: MercadoPagoItem[]): void {
    const invalidItems = items.filter(item => !this.validateMercadoPagoItem(item));
    
    if (invalidItems.length > 0) {
      console.error('❌ Itens inválidos após formatação:', invalidItems);
      throw new Error('Itens com dados inválidos após formatação');
    }
  }

  /**
   * Valida se um item está no formato correto para o Mercado Pago
   */
  private validateMercadoPagoItem(item: any): item is MercadoPagoItem {
    return (
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.quantity === 'number' &&
      typeof item.unit_price === 'number' &&
      item.quantity > 0 &&
      item.unit_price > 0 &&
      item.title.length > 0 &&
      (item.picture_url === undefined || typeof item.picture_url === 'string')
    );
  }

  /**
   * Calcula o valor total dos itens
   */
  calculateTotal(items: MercadoPagoItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.unit_price * item.quantity);
    }, 0);
  }
} 