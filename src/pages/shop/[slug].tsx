import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { getAllProducts, getProductBySlug } from '../../lib/sanity';
import { useCart } from '../../lib/useCart';
import Seo from '../../components/Seo';
import ButtonPrimary from '../../components/ButtonPrimary';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import { useState } from 'react';

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  image?: any;
  price: number;
  category: string;
  description: string;
}

interface ProductPageProps {
  product: Product;
  related: Product[];
}

const ProductPage = ({ product, related }: ProductPageProps) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  if (!product) return <div className="text-center py-16">Produto não encontrado.</div>;
  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  const description = product.description.slice(0, 160);
  const url = `https://powerhousebrasil.com.br/shop/${product.slug.current}`;
  return (
    <>
      <Seo
        title={product.title}
        description={description}
        image={product.image?.asset?.url || ''}
        url={url}
      />
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Imagem do produto */}
        <div className="w-full flex justify-center">
          <div className="relative w-full aspect-video max-w-md rounded-xl shadow-lg overflow-hidden">
            <Image
              src={product.image?.asset?.url || ''}
              alt={product.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        {/* Detalhes do produto */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-primary mb-2">{product.title}</h1>
          <span className="text-2xl text-accent font-semibold">R$ {product.price.toFixed(2)}</span>
          <p className="text-neutral-700 text-lg leading-relaxed">{product.description}</p>
          <ButtonPrimary
            className="mt-4 w-full md:w-auto"
            onClick={handleAddToCart}
            aria-label="Adicionar ao Carrinho"
          >
            Adicionar ao Carrinho
          </ButtonPrimary>
          {added && (
            <div className="mt-2 text-green-600 font-semibold transition-all">
              Produto adicionado ao carrinho!
            </div>
          )}
        </div>
      </div>
      {/* Produtos relacionados */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-primary mb-8">Você também pode gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {related.map((item) => (
              <ProductCard
                key={item._id}
                title={item.title}
                image={item.image?.asset?.url || ''}
                price={item.price}
                slug={item.slug.current}
              />
            ))}
          </div>
        </section>
      )}
      <div className="flex justify-center mb-12">
        <Link href="/shop" aria-label="Voltar para a loja">
          <ButtonPrimary className="mt-12">← Voltar para a Loja</ButtonPrimary>
        </Link>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await getAllProducts();
  const paths = products.map((product: Product) => ({
    params: { slug: product.slug.current },
  }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const product = await getProductBySlug(slug);
  if (!product) return { notFound: true };
  // Selecionar até 3 produtos relacionados (excluindo o atual)
  const allProducts = await getAllProducts();
  const related = allProducts.filter((p: Product) => p.slug.current !== slug).slice(0, 3);
  return {
    props: { product, related },
    revalidate: 60,
  };
};

export default ProductPage;
