import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { getDescriptionText } from '../lib/textUtils';
import { useCart } from '../lib/useCart';
import { getShippingCost } from '../lib/productUtils';
import { useState } from 'react';
import type { Product } from '../types/product';

interface ProductCardProps {
  title: string;
  image: string;
  price: number;
  slug: string;
  description?: string;
  product?: Product; // Produto completo para adicionar ao carrinho
}

// Função para verificar se a promoção ainda é válida
const isPromotionValid = (saleEndDate?: string): boolean => {
  if (!saleEndDate) return true; // Se não há data de fim, a promoção é válida
  return new Date(saleEndDate) > new Date();
};

const ProductCard = ({ title, image, price, slug, description, product }: ProductCardProps) => {
  const descriptionText = getDescriptionText(description);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const shippingCost = product ? getShippingCost(product) : 25.00;
  
  // Lógica de promoção
  const isOnSale = product?.isOnSale && isPromotionValid(product?.saleEndDate);
  const displayPrice = isOnSale ? product?.salePrice || price : price;
  const originalPrice = isOnSale ? (product?.originalPrice || price) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede a navegação do Link
    e.stopPropagation();
    
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all duration-200 hover:scale-105 focus-within:scale-105 border border-gray-100">
      <Link href={`/shop/${slug}`} className="relative w-full h-32 sm:h-40 md:h-48 block cursor-pointer">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 33vw"
          priority={false}
        />
        {/* Indicador de promoção */}
        {isOnSale && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            PROMOÇÃO
          </div>
        )}
      </Link>
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 line-clamp-2">{title}</h3>
        
        {descriptionText && (
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {descriptionText}
          </p>
        )}
        
        {/* Preços */}
        <div className="mt-auto mb-3 sm:mb-4">
          {isOnSale ? (
            <div className="space-y-1">
              {/* Preço original riscado */}
              <span className="text-xs sm:text-sm text-gray-400 line-through block">
                De: R$ {originalPrice?.toFixed(2)}
              </span>
              {/* Preço promocional */}
              <span className="text-lg sm:text-xl font-bold text-red-500 block">
                Por: R$ {displayPrice?.toFixed(2)}
              </span>
              {/* Economia */}
              {originalPrice && displayPrice && (
                <span className="text-xs text-green-600 font-semibold block">
                  Economize R$ {(originalPrice - displayPrice).toFixed(2)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-lg sm:text-xl font-bold text-green-500 block">
              R$ {displayPrice?.toFixed(2)}
            </span>
          )}
      
        </div>
        
        {/* Botões */}
        <div className="flex gap-1 sm:gap-2">
          {product && product.inStock === false ? (
            <button
              type="button"
              disabled
              className="flex-1 flex items-center justify-center bg-gray-300 text-gray-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg cursor-not-allowed text-xs sm:text-sm md:text-base font-semibold shadow"
              aria-label={`${title} sem estoque`}
              aria-disabled="true"
            >
              Sem estoque
            </button>
          ) : (
            <Link 
              href={`/shop/${slug}`} 
              className="flex-1 flex items-center justify-center bg-black text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-black/90 transition-all duration-200 text-xs sm:text-sm md:text-base font-semibold shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" 
              tabIndex={0} 
              aria-label={`Ver produto ${title}`}
            >
              Ver Produto
            </Link>
          )}
          
          {product && (
            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 hover:bg-yellow-500 text-black p-1.5 sm:p-2 rounded-lg transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 flex items-center justify-center"
              aria-label={`Adicionar ${title} ao carrinho`}
              disabled={product.inStock === false}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
        
        {/* Feedback de produto adicionado */}
        {added && (
          <div className="mt-2 text-green-600 font-semibold text-sm text-center transition-all">
            Produto adicionado!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;