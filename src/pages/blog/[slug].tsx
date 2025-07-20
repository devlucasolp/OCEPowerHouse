import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import type { Post } from '../../types/post';
import Seo from '../../components/Seo';
import ButtonPrimary from '../../components/ButtonPrimary';
import { PortableText } from '@portabletext/react';
import { motion } from 'framer-motion';

interface BlogPostProps {
  post: Post | null;
}

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const BlogPost = ({ post }: BlogPostProps) => {
  if (!post) return <div className="text-center py-16">Post não encontrado.</div>;
  const getSlugString = (slug: any) => (typeof slug === 'string' ? slug : slug?.current || '');
  const description =
    post.body && typeof post.body === 'string'
      ? post.body.replace(/<[^>]+>/g, '').slice(0, 160)
      : '';
  const url = `https://powerhousebrasil.com.br/blog/${getSlugString(post.slug)}`;
  return (
    <>
      <Seo
        title={post.title}
        description={description}
        image={post.mainImage ? urlFor(post.mainImage).width(800).height(400).url() : undefined}
        url={url}
      />
      <motion.article
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-card p-4 md:p-10 mt-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {post.mainImage && (
          <motion.div
            className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-8"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src={urlFor(post.mainImage).width(1200).height(525).url()}
              alt={post.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 70vw"
              priority
            />
          </motion.div>
        )}
        <header className="mb-8">
          <motion.h1
            className="text-4xl font-bold text-primary mb-4 leading-tight"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {post.title}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 mb-2">
            <span>
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : ''}
            </span>
            {post.author && (
              <span className="pl-2 border-l border-neutral-200">
                {typeof post.author === 'object' ? post.author.name : post.author}
              </span>
            )}
          </div>
        </header>
        <motion.section
          className="prose prose-lg max-w-none mx-auto text-neutral-900 transition-all duration-300 px-0 md:px-0"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <PortableText value={post.body} />
        </motion.section>
        <div className="flex justify-center">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link href="/blog" aria-label="Voltar para o Blog">
              <ButtonPrimary className="mt-12">← Voltar para o Blog</ButtonPrimary>
            </Link>
          </motion.div>
        </div>
      </motion.article>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  const paths = posts.map((post: Post) => ({
    params: { slug: typeof post.slug === 'object' ? post.slug.current : post.slug },
  }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const post = await getPostBySlug(slug);
  if (!post) return { notFound: true };
  return {
    props: { post },
    revalidate: 60,
  };
};

export default BlogPost;
