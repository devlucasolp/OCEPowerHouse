import ProductCard from '../../components/ProductCard';
import Seo from '../../components/Seo';
import SidebarFilter from '../../components/SidebarFilter';
import React from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { GetServerSideProps } from 'next';
import { getAllProducts, getAllProductsAlternative } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';

import type { Product } from '../../types/product';

interface ShopIndexProps {
  products: Product[];
}

const ShopIndex = ({ products }: ShopIndexProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Categorias oficiais exibidas no filtro (novas categorias)
  const categories = React.useMemo(
    () => [
      'vestuario',
      'suplementos',
      'equipamento',
      'bolsas',
      'bikes',
    ],
    []
  );

  // Normaliza categorias vindas do Sanity (inclui valores legados e novos)
  const normalizeCategory = (raw?: string | null): string | null => {
    if (!raw) return null;
    const base = String(raw)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // remove acentos

    const map: Record<string, string> = {
      // Mapeamento das categorias atuais
      vestuario: 'vestuario',
      suplementos: 'suplementos',
      equipamento: 'equipamento',
      bolsas: 'bolsas',
      bikes: 'bikes',
      
      // Mapeamento de categorias legadas (para compatibilidade)
      acessorios: 'equipamento',
      nutricao: 'suplementos',
      'nutricao & geis': 'suplementos',
      comestiveis: 'suplementos',
      geis: 'suplementos',
      ciclismo: 'bikes',
      bike: 'bikes',
      'acessorios de bike': 'equipamento',
      'bike_acessorios': 'equipamento',
      pneus: 'bikes',
      'pneus de bike': 'bikes',
      'bike_pneus': 'bikes',
    };

    return map[base] || base;
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => normalizeCategory(product.category) === selectedCategory)
    : products;

  return (
    <>
      <Seo title="Produtos - Power House Brasil" description="Vitrine de produtos para ciclismo urbano." />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8 text-black-900 font-roboto">Produtos</h1>
        {selectedCategory && (
          <div className="mb-6">
            <ButtonPrimary onClick={() => setSelectedCategory(null)} className="text-base px-6 py-3 rounded-xl">
              Ver todos os produtos
            </ButtonPrimary>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar de categorias */}
          <SidebarFilter
            selectedCategory={selectedCategory}
            handleSelectCategory={setSelectedCategory}
            categories={categories}
          />
          {/* Listagem de produtos */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-blue-900 font-semibold py-12">
                  Nenhum produto encontrado para esta categoria.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    title={product.title}
                    image={product.image ? urlFor(product.image as any).width(400).height(300).url() : '/img/placeholder.jpg'}
                    price={product.price}
                    slug={(product.slug as any).current}
                    description={product.description}
                    product={product}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const products = await getAllProducts();
    
    return {
      props: { 
        products: products || [] 
      },
    };
  } catch (error) {
    console.error('❌ [SSR] Erro ao buscar produtos:', error);
    return {
      props: { 
        products: [] 
      },
    };
  }
};

export default ShopIndex;