import ProductCard from '../../components/ProductCard';
import Seo from '../../components/Seo';
import SidebarFilter from '../../components/SidebarFilter';
import React from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { GetServerSideProps } from 'next';
import { getAllProducts, getAllProductsAlternative } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { useRouter } from 'next/router';
import { Search, X } from 'lucide-react';

import type { Product } from '../../types/product';

interface ShopIndexProps {
  products: Product[];
}

const ShopIndex = ({ products }: ShopIndexProps) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  // Inicializar busca a partir da URL
  React.useEffect(() => {
    const { search } = router.query;
    if (search && typeof search === 'string') {
      setSearchTerm(search);
    }
  }, [router.query]);

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

  // Filtra produtos por categoria e busca
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter((product) => normalizeCategory(product.category) === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.description && 
         typeof product.description === 'string' && 
         product.description.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Função para limpar busca
  const clearSearch = () => {
    setSearchTerm('');
    router.push('/shop', undefined, { shallow: true });
  };

  // Função para limpar categoria
  const clearCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      <Seo title="Produtos - Power House Brasil" description="Vitrine de produtos para ciclismo urbano." />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8 text-black-900 font-roboto">Produtos</h1>
        
        {/* Barra de busca */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Limpar busca"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filtros ativos */}
        {(selectedCategory || searchTerm) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {searchTerm && (
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                <Search className="w-4 h-4 mr-1" />
                Busca: "{searchTerm}"
                <button
                  onClick={clearSearch}
                  className="ml-2 hover:text-yellow-900 transition-colors"
                  aria-label="Remover filtro de busca"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {selectedCategory && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                Categoria: {selectedCategory}
                <button
                  onClick={clearCategory}
                  className="ml-2 hover:text-blue-900 transition-colors"
                  aria-label="Remover filtro de categoria"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={() => {
                clearSearch();
                clearCategory();
              }}
              className="text-gray-600 hover:text-gray-800 text-sm underline transition-colors"
            >
              Limpar todos os filtros
            </button>
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
                <div className="col-span-full text-center text-gray-600 py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm && selectedCategory
                      ? `Não encontramos produtos para "${searchTerm}" na categoria "${selectedCategory}"`
                      : searchTerm
                      ? `Não encontramos produtos para "${searchTerm}"`
                      : selectedCategory
                      ? `Não encontramos produtos na categoria "${selectedCategory}"`
                      : 'Nenhum produto disponível no momento.'}
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={() => {
                        clearSearch();
                        clearCategory();
                      }}
                      className="mt-4 text-yellow-600 hover:text-yellow-700 underline transition-colors"
                    >
                      Ver todos os produtos
                    </button>
                  )}
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