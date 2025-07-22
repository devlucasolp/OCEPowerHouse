import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../lib/sanityImage';
import type { Post } from '../types/post';
import { formatDate } from '../lib/dateUtils';

interface BlogCardProps {
  post: Post;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all duration-200 hover:scale-105 focus-within:scale-105 border border-yellow-100">
      {post.mainImage && (
        <div className="relative w-full h-48">
          <Image
            src={urlFor(post.mainImage).width(800).height(400).url()}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-blue-900 mb-2 line-clamp-2">{post.title}</h2>
        <span className="text-sm text-neutral-500 mb-4">
          {post.publishedAt ? formatDate(post.publishedAt) : ''}
        </span>
        <Link
          href={`/blog/${typeof post.slug === 'object' && post.slug !== null && Object.prototype.hasOwnProperty.call(post.slug, 'current') ? (post.slug as any).current : post.slug}`}
          className="mt-auto inline-block bg-blue-900 text-yellow-400 px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-yellow-200 transition-all duration-200 text-center font-semibold shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          tabIndex={0}
          aria-label={`Ler mais sobre ${post.title}`}
        >
          Ler mais
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
