import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { getAllProducts, getProductBySlug } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { getDescriptionText, getTruncatedDescription } from '../../lib/textUtils';
import { useCart } from '../../lib/useCart';
import Seo from '../../components/Seo';
import ButtonPrimary from '../../components/ButtonPrimary';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product, ProductVariant } from '../../types/product';

interface ProductPageProps {
  product: Product;
  related: Product[];
}

const ProductPage = ({ product, related }: ProductPageProps) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  // Selecionar primeira variante em estoque como padrão (se existir)
  const defaultVariantKey = useMemo(() => {
    if (!hasVariants) return null as string | null;
    const firstInStock = product.variants!.find((v) => v?.inStock !== false);
    return (firstInStock?._key as string | undefined) || (product.variants![0]?._key as string | undefined) || null;
  }, [hasVariants, product.variants]);

  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(defaultVariantKey);

  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    if (!hasVariants || !selectedVariantKey) return undefined;
    return product.variants!.find((v) => v._key === selectedVariantKey);
  }, [hasVariants, product.variants, selectedVariantKey]);

  if (!product) return <div className="text-center py-16">Produto não encontrado.</div>;

  const descriptionText = getDescriptionText(product.description);
  const description = getTruncatedDescription(product.description, 160);
  const url = `https://powerhousebrasil.com.br/shop/${(product.slug as any).current}`;

  const basePrice = Number(product.price) || 0;
  const priceModifier = selectedVariant?.priceModifier ? Number(selectedVariant.priceModifier) : 0;
  const finalPrice = basePrice + priceModifier;

  // Escolher imagem de exibição: variante selecionada > imagem do produto
  const displayImageUrl = selectedVariant?.image
    ? urlFor(selectedVariant.image as any).width(800).height(600).url()
    : product.image
    ? urlFor(product.image as any).width(800).height(600).url()
    : '/img/placeholder.jpg';

  const handleAddToCart = () => {
    // Monta um produto com identificação única por variante para o carrinho
    const variantSuffix = selectedVariant?._key ? `::${selectedVariant._key}` : '';
    const productWithVariant = {
      ...product,
      id: `${(product.id || product._id) ?? 'prod'}${variantSuffix}`,
      title: selectedVariant?.name ? `${product.title} - ${selectedVariant.name}` : product.title,
      price: finalPrice,
      image: selectedVariant?.image || product.image,
      // Anexa metadados úteis (não quebram o checkout)
      selectedVariant: selectedVariant ? { _key: selectedVariant._key, name: selectedVariant.name } : undefined,
    } as any as Product;

    addToCart(productWithVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Seo title={product.title} description={description} image={displayImageUrl} url={url} />
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Imagem do produto (ou da variante selecionada) */}
        <div className="w-full flex justify-center">
          <div className="relative w-full aspect-video max-w-md rounded-xl shadow-lg overflow-hidden">
            <Image
              src={displayImageUrl}
              alt={selectedVariant?.name ? `${product.title} - ${selectedVariant.name}` : product.title}
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

          {/* Seletor de variantes */}
          {hasVariants && (
            <div className="flex flex-col gap-3">
              <span className="font-medium text-neutral-700">Selecione uma opção:</span>
              <div className="flex flex-wrap gap-2">
                {product.variants!.map((variant) => {
                  const selected = selectedVariantKey === variant._key;
                  const disabled = variant.inStock === false;
                  return (
                    <button
                      key={variant._key}
                      type="button"
                      onClick={() => !disabled && setSelectedVariantKey(variant._key || null)}
                      className={[
                        'px-4 py-2 rounded-lg border text-sm font-semibold transition-all',
                        selected ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-300 hover:border-black',
                        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                      ].join(' ')}
                      aria-pressed={selected}
                      aria-label={`Selecionar variante ${variant.name}`}
                      disabled={disabled}
                    >
                      {variant.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <span className="text-2xl text-green-600 font-semibold">R$ {finalPrice.toFixed(2)}</span>
          {descriptionText && <p className="text-neutral-700 text-lg leading-relaxed">{descriptionText}</p>}

          <ButtonPrimary
            className="mt-2 w-full md:w-auto"
            onClick={handleAddToCart}
            aria-label="Adicionar ao Carrinho"
            disabled={product.inStock === false || (hasVariants && selectedVariant?.inStock === false)}
          >
            {product.inStock === false || (hasVariants && selectedVariant?.inStock === false)
              ? 'Produto indisponível'
              : 'Adicionar ao Carrinho'}
          </ButtonPrimary>
          {added && (
            <div className="mt-2 text-green-600 font-semibold transition-all">Produto adicionado ao carrinho!</div>
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
                image={item.image ? urlFor(item.image as any).width(400).height(300).url() : '/img/placeholder.jpg'}
                price={item.price}
                slug={(item.slug as any).current}
                description={item.description}
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
    params: { slug: (product.slug as any).current },
  }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const product = await getProductBySlug(slug);
  if (!product) return { notFound: true };
  // Selecionar até 3 produtos relacionados (excluindo o atual)
  const allProducts = await getAllProducts();
  const related = allProducts.filter((p: Product) => (p.slug as any).current !== slug).slice(0, 3);
  return {
    props: { product, related },
    revalidate: 60,
  };
};

export default ProductPage;