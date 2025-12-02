import Link from 'next/link';
import Image from 'next/image';
import { urlFor, getImageUrl } from '../lib/sanityImage';
import { getDescriptionText } from '../lib/textUtils';
import type { Post } from '../types/post';

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Debug: Log post data
  console.log('BlogCard post data:', post);
  
  // Extract description from post body
  const description = getDescriptionText(post.body);
  console.log('Extracted description:', description);
  
  // Debug: Check mainImage
  console.log('Post mainImage:', post.mainImage);
  
  // Get slug string
  const getSlugString = (slug: any) => {
    if (typeof slug === 'string') return slug;
    if (slug && typeof slug === 'object' && slug.current) return slug.current;
    return '';
  };
  
  const slugString = getSlugString(post.slug);
  
  // Check if image URL can be generated
  const imageUrl = getImageUrl(post.mainImage, 800, 400);
  console.log('Generated image URL:', imageUrl);
  
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all duration-200 hover:scale-105 focus-within:scale-105 border border-gray-100">
      {imageUrl ? (
        <div className="relative w-full aspect-[16/7]">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
            onError={(e) => {
              console.error('Image failed to load:', e);
              console.error('Failed URL:', imageUrl);
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', imageUrl);
            }}
          />
        </div>
      ) : (
        <div className="w-full aspect-[16/7] bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center border-b border-yellow-200">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
              </svg>
            </div>
            <span className="text-yellow-800 text-sm font-medium">Notícias e Dicas de Ciclismo</span>
          </div>
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2 line-clamp-2">{post.title}</h2>
        
        <span className="text-sm text-neutral-500 mb-3">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
        </span>
        
        {description ? (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {description.slice(0, 150)}...
          </p>
        ) : (
          <p className="text-gray-400 text-sm mb-4 italic">
            Descrição não disponível
          </p>
        )}
        
        {slugString ? (
          <Link
            href={`/blog/${slugString}`}
            className="mt-auto inline-block bg-black text-white px-4 py-2 rounded-lg transition-all duration-200 text-center font-semibold shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            tabIndex={0}
            aria-label={`Ler mais sobre ${post.title}`}
          >
            Ler mais
          </Link>
        ) : (
          <div className="mt-auto text-red-500 text-sm">
            Erro: Slug inválido
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;