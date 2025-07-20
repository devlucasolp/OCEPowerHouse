import Image from 'next/image';
import type { Product } from '../types/product';

interface CartItemProps {
  product: Product & { quantity?: number };
  onRemove: (id: string) => void;
}

const CartItem = ({ product, onRemove }: CartItemProps) => (
  <div className="flex items-center gap-4 p-4 border-b">
    <div className="relative w-20 h-20 flex-shrink-0">
      <Image
        src={product.image}
        alt={product.title}
        fill
        className="object-cover rounded"
        sizes="80px"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
      <span className="text-sm text-neutral-500">Qtd: {product.quantity || 1}</span>
      <div className="text-blue-700 font-bold">
        R$ {(product.price * (product.quantity || 1)).toFixed(2)}
      </div>
    </div>
    <button
      className="ml-4 text-red-600 hover:text-red-800 font-bold text-xl"
      onClick={() => onRemove(product.id || product._id)}
      aria-label={`Remover ${product.title} do carrinho`}
      tabIndex={0}
    >
      &times;
    </button>
  </div>
);

export default CartItem;
