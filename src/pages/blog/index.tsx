import { GetStaticProps } from 'next';
import BlogCard from '../../components/BlogCard';
import { getAllPosts, testSanityConnection } from '../../lib/sanity';
import type { Post } from '../../types/post';
import Seo from '../../components/Seo';
import { motion } from 'framer-motion';

interface BlogIndexProps {
  posts: (Post & { _id?: string })[];
  connectionTest?: any;
}

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7,
      when: "beforeChildren" as const, 
      staggerChildren: 0.12 
    } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlogIndex = ({ posts, connectionTest }: BlogIndexProps) => {
  const isFewPosts = posts.length < 3;
  
  // Debug: Log posts data
  console.log('Blog posts received:', posts);
  console.log('Sanity connection test:', connectionTest);
  
  return (
    <>
      <Seo title="Blog Power House Brasil - Notícias e Conteúdo para Ciclistas" description="Dicas, novidades e notícias para ciclistas urbanos e apaixonados por bike." />
      <motion.div
        className={`max-w-6xl mx-auto py-12 pt-20 px-4 ${isFewPosts ? 'flex flex-col items-center' : ''}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-3xl font-bold mb-8 text-primary" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Notícias e Dicas de Ciclismo
        </motion.h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-600 mb-4">Nenhum post encontrado</h2>
            <p className="text-gray-500">
              Verifique a conexão com o Sanity CMS ou se há posts publicados.
            </p>
            {connectionTest && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <h3 className="font-semibold">Debug - Teste de Conexão:</h3>
                <pre className="text-sm text-left mt-2">
                  {JSON.stringify(connectionTest, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 w-full ${isFewPosts ? 'max-w-4xl mx-auto' : ''}`}
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
        )}
      </motion.div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    console.log('Fetching posts from Sanity...');
    
    // Test connection
    const connectionTest = await testSanityConnection();
    
    // Get posts
    const posts = await getAllPosts();
    
    console.log('Posts fetched successfully:', posts?.length || 0);
    
    return {
      props: { 
        posts: posts || [],
        connectionTest: connectionTest || null
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      props: { 
        posts: [],
        connectionTest: { error: errorMessage }
      },
      revalidate: 10, // Retry more frequently on error
    };
  }
};

export default BlogIndex;