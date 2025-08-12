import Link from 'next/link';
import Image from 'next/image';
import { getDescriptionText } from '../lib/textUtils';

interface ProductCardProps {
  title: string;
  image: string;
  price: number;
  slug: string;
  description?: string | any;
}

const ProductCard = ({ title, image, price, slug, description }: ProductCardProps) => {
  const descriptionText = getDescriptionText(description);
  
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
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-lg md:text-xl font-semibold text-[#1a1a1a] mb-2 line-clamp-2">{title}</h2>
        {descriptionText && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
            {descriptionText}
          </p>
        )}
        <span className="text-xl font-bold text-green-500 mb-4 mt-auto">R$ {price.toFixed(2)}</span>
        <Link href={`/shop/${slug}`} className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-all duration-200 text-center font-semibold shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" tabIndex={0} aria-label={`Ver produto ${title}`}>
          Ver Produto
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 