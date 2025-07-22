import { GetStaticProps } from 'next';
import BlogCard from '../../components/BlogCard';
import { getAllPosts } from '../../lib/sanity';
import type { Post } from '../../types/post';
import Seo from '../../components/Seo';
import { motion } from 'framer-motion';

interface BlogIndexProps {
  posts: (Post & { _id?: string })[];
}

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlogIndex = ({ posts }: BlogIndexProps) => {
  const isFewPosts = posts.length < 3;
  return (
    <>
      <Seo
        title="Blog Power House Brasil - Notícias e Conteúdo para Ciclistas"
        description="Dicas, novidades e notícias para ciclistas urbanos e apaixonados por bike."
      />
      <motion.div
        className={`max-w-6xl mx-auto py-12 px-4 ${isFewPosts ? 'flex flex-col items-center' : ''}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold mb-8 text-primary"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Notícias e Dicas de Ciclismo
        </motion.h1>
        <motion.div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ${isFewPosts ? 'max-w-2xl mx-auto' : ''}`}
          variants={containerVariants}
        >
          {posts.map((post) => (
            <motion.div
              key={post.id || post._id}
              variants={cardVariants}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              whileFocus={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="focus:outline-none"
              tabIndex={0}
              aria-label={`Card do post ${post.title}`}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();
  return {
    props: { posts },
    revalidate: 60,
  };
};

export default BlogIndex;
