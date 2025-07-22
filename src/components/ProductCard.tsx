import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  title: string;
  image: string;
  price: number;
  slug: string;
}

const ProductCard = ({ title, image, price, slug }: ProductCardProps) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all duration-200 hover:scale-105 focus-within:scale-105 border border-yellow-100">
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
      <h2 className="text-lg md:text-xl font-semibold text-blue-900 mb-2 line-clamp-2">{title}</h2>
      <span className="text-xl font-bold text-yellow-500 mb-4">R$ {price.toFixed(2)}</span>
      <Link
        href={`/shop/${slug}`}
        className="mt-auto inline-block bg-blue-900 text-yellow-400 px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-yellow-200 transition-all duration-200 text-center font-semibold shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
        tabIndex={0}
        aria-label={`Ver produto ${title}`}
      >
        Ver Produto
      </Link>
    </div>
  </div>
);

export default ProductCard;
