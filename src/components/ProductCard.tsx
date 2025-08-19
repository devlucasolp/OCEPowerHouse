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
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
        {/* Indicador de promoção */}
        {isOnSale && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            PROMOÇÃO
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        
        {descriptionText && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
            {descriptionText}
          </p>
        )}
        
        {/* Preços */}
        <div className="mt-auto mb-4">
          {isOnSale ? (
            <div className="space-y-1">
              {/* Preço original riscado */}
              <span className="text-sm text-gray-400 line-through block">
                De: R$ {originalPrice?.toFixed(2)}
              </span>
              {/* Preço promocional */}
              <span className="text-xl font-bold text-red-500 block">
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
            <span className="text-xl font-bold text-green-500 block">
              R$ {displayPrice?.toFixed(2)}
            </span>
          )}
          <span className="text-sm text-gray-500">+ frete R$ {shippingCost.toFixed(2)}</span>
        </div>
        
        {/* Botões */}
        <div className="flex gap-2">
          <Link 
            href={`/shop/${slug}`} 
            className="flex-1 inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-all duration-200 text-center font-semibold shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" 
            tabIndex={0} 
            aria-label={`Ver produto ${title}`}
          >
            Ver Produto
          </Link>
          
          {product && (
            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-lg transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              aria-label={`Adicionar ${title} ao carrinho`}
              disabled={product.inStock === false}
            >
              <ShoppingCart className="w-5 h-5" />
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