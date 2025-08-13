import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import type { CartProduct } from '../lib/useCart';
import { toSafeNumber, toSafeQuantity, calculateItemTotal } from '../lib/useCart';
import { getProductImageUrl } from '../lib/productUtils';

interface CartItemProps {
  product: CartProduct;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem = ({ product, onRemove, onUpdateQuantity }: CartItemProps) => {
  const imageUrl = getProductImageUrl(product, 200, 200);
  const productId = product.id || product._id;

  // Cálculos seguros usando funções centralizadas
  const itemPrice = toSafeNumber(product.price);
  const itemQuantity = toSafeQuantity(product.quantity);
  const itemTotal = calculateItemTotal(product.price, product.quantity);

  const handleDecrease = () => {
    if (itemQuantity > 1) {
      onUpdateQuantity(productId, itemQuantity - 1);
    } else {
      onRemove(productId);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(productId, itemQuantity + 1);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0">
      {/* Imagem do produto */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="rounded-lg object-cover"
          sizes="80px"
        />
      </div>

      {/* Informações do produto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        
        {/* Controles de quantidade */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-gray-600">Quantidade:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{itemQuantity}</span>
            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preços */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">R$ {itemPrice.toFixed(2)} cada</span>
          <span className="text-lg font-bold text-green-600">
            R$ {itemTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botão de remover */}
      <button
        onClick={() => onRemove(productId)}
        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
        aria-label={`Remover ${product.title} do carrinho`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem; 