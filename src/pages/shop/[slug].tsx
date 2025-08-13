import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { getAllProducts, getProductBySlug } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { getDescriptionText, getTruncatedDescription } from '../../lib/textUtils';
import { getProductImageUrl } from '../../lib/productUtils';
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

  // Placeholder SVG como data URI
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%236b7280'%3EProduto%3C/text%3E%3C/svg%3E";

  // Escolher imagem de exibição: variante selecionada > imagem do produto
  let displayImageUrl = '';
  
  try {
    if (selectedVariant?.image) {
      displayImageUrl = getProductImageUrl({ ...product, image: selectedVariant.image } as Product, 800, 600) || '';
    } else {
      displayImageUrl = getProductImageUrl(product, 800, 600) || '';
    }
    
    // Se ainda não temos URL, usar placeholder
    if (!displayImageUrl) {
      displayImageUrl = placeholderImage;
    }
    
    console.log('🖼️ URL da imagem final:', displayImageUrl);
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    displayImageUrl = placeholderImage;
  }

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
          <div className="absolute w-full aspect-square max-w-md rounded-xl overflow-hidden">
            {displayImageUrl && displayImageUrl !== placeholderImage ? (
               <>
                {/* Teste com img tag normal */}
                <img
                  src={displayImageUrl}
                  alt={selectedVariant?.name ? `${product.title} - ${selectedVariant.name}` : product.title}
                  className="w-full h-full object-cover object-center"
                  onLoad={() => {
                    console.log('✅ Imagem carregada com sucesso (img tag):', displayImageUrl);
                  }}
                  onError={(e) => {
                    console.error('❌ Erro ao carregar imagem (img tag):', displayImageUrl);
                    // Fallback para Image do Next.js se img falhar
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.style.display = 'none';
                    const nextImageContainer = imgElement.parentElement?.querySelector('.next-image-fallback');
                    if (nextImageContainer) {
                      (nextImageContainer as HTMLElement).style.display = 'block';
                    }
                  }}
                />
                
                {/* Fallback com Next.js Image (inicialmente escondido) */}
                <div className="next-image-fallback absolute inset-0" style={{ display: 'none' }}>
                  <Image
                    src={displayImageUrl}
                    alt={selectedVariant?.name ? `${product.title} - ${selectedVariant.name}` : product.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                    onLoad={() => {
                      console.log('✅ Imagem carregada com sucesso (Next.js Image):', displayImageUrl);
                    }}
                    onError={(e) => {
                      console.error('❌ Erro ao carregar imagem (Next.js Image):', displayImageUrl);
                      (e.target as HTMLImageElement).src = placeholderImage;
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <div>Imagem não disponível</div>
                  <div className="text-xs mt-2">URL: {displayImageUrl}</div>
                </div>
              </div>
            )}
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
                product={item}
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