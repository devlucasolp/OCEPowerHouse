import ProductCard from '../../components/ProductCard';
import Seo from '../../components/Seo';
import SidebarFilter from '../../components/SidebarFilter';
import React from 'react';
import ButtonPrimary from '../../components/ButtonPrimary';
import { GetServerSideProps } from 'next';
import { getAllProducts, getAllProductsAlternative, getAllCategories } from '../../lib/sanity';
import { urlFor } from '../../lib/sanityImage';
import { useRouter } from 'next/router';
import { Search, X, ArrowUpDown } from 'lucide-react';

import type { Product, Category } from '../../types/product';

interface CategoryDisplay {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface ShopIndexProps {
  products: Product[];
  categories: CategoryDisplay[];
}

const ShopIndex = ({ products, categories }: ShopIndexProps) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortBy, setSortBy] = React.useState<string>('default');

  // Inicializar busca a partir da URL
  React.useEffect(() => {
    const { search } = router.query;
    if (search && typeof search === 'string') {
      setSearchTerm(search);
    }
  }, [router.query]);

  // Criar mapa de slugs de categoria para facilitar a busca
  const categorySlugMap = React.useMemo(() => {
    const map = new Map();
    categories.forEach(cat => {
      map.set(cat.slug.current, cat.title);
    });
    return map;
  }, [categories]);

  // Opções de ordenação
  const sortOptions = React.useMemo(
    () => [
      { value: 'default', label: 'Padrão' },
      { value: 'price-asc', label: 'Preço: Menor para Maior' },
      { value: 'price-desc', label: 'Preço: Maior para Menor' },
      { value: 'name-asc', label: 'Nome: A-Z' },
      { value: 'name-desc', label: 'Nome: Z-A' },
      { value: 'featured', label: 'Produtos em Destaque' },
      { value: 'in-stock', label: 'Disponíveis Primeiro' },
    ],
    []
  );

  // Normaliza categorias vindas do Sanity para compatibilidade
  const normalizeCategory = (product: Product): string | null => {
    if (!product.category) return null;
    
    // Se a categoria é um objeto (nova estrutura da Sanity)
    if (typeof product.category === 'object' && product.category) {
      const categoryObj = product.category as Category;
      if (categoryObj.slug && categoryObj.slug.current) {
        return categoryObj.slug.current;
      }
    }
    
    // Se a categoria é uma string (estrutura legada), mapear para slugs
    const categoryStr = String(product.category).toLowerCase();
    const legacyMap: Record<string, string> = {
      'vestuário': 'vestuario',
      'suplemento': 'suplementos',
      'equipamento': 'equipamento',
      'componentes': 'componentes',
      'bolsas': 'bolsas',
      'bikes': 'bikes',
      'livro': 'livro',
      'acessórios': 'equipamento',
      'nutrição': 'suplementos',
      'nutrição & géis': 'suplementos',
      'comestíveis': 'suplementos',
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

    return legacyMap[categoryStr] || categoryStr;
  };

  // Filtra e ordena produtos por categoria, busca e ordenação
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        const normalizedCategory = normalizeCategory(product);
        return normalizedCategory === selectedCategory;
      });
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((product) => {
        const categoryObj = product.category as any;
        const categoryTitle = typeof product.category === 'object' && categoryObj?.title
          ? categoryObj.title.toLowerCase()
          : String(product.category || '').toLowerCase();
        
        return product.title.toLowerCase().includes(searchLower) ||
               categoryTitle.includes(searchLower) ||
               (product.description && 
                typeof product.description === 'string' && 
                product.description.toLowerCase().includes(searchLower));
      });
    }

    // Ordenar produtos: sempre colocar com estoque primeiro, depois aplicar o critério selecionado
    const sorted = [...filtered].sort((a, b) => {
      const aStock = a.inStock === false ? 0 : 1; // trata undefined como em estoque
      const bStock = b.inStock === false ? 0 : 1;

      // Regra global: com estoque primeiro
      if (aStock !== bStock) {
        return bStock - aStock; // b=1 e a=0 -> 1 (a vai depois), garantindo sem estoque no fim
      }

      // Empate por estoque: aplicar ordenação selecionada
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title, 'pt-BR');
        case 'name-desc':
          return b.title.localeCompare(a.title, 'pt-BR');
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.title.localeCompare(b.title, 'pt-BR');
        case 'in-stock':
          // Aqui a regra global já resolveu estoque; desempate por nome
          return a.title.localeCompare(b.title, 'pt-BR');
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.title.localeCompare(b.title, 'pt-BR');
      }
    });

    return sorted;
  }, [products, selectedCategory, searchTerm, sortBy]);

  // Função para limpar busca
  const clearSearch = () => {
    setSearchTerm('');
    router.push('/shop', undefined, { shallow: true });
  };

  // Função para selecionar categoria
  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Função para limpar categoria
  const clearCategory = () => {
    setSelectedCategory(null);
  };

  // Função para limpar ordenação
  const clearSort = () => {
    setSortBy('default');
  };

  return (
    <>
      <Seo title="Produtos - Power House Brasil" description="Vitrine de produtos para ciclismo urbano." />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold mb-8 text-black-900 font-roboto">Produtos</h1>
        
        {/* Barra de busca e ordenação */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Barra de busca */}
          <div className="relative flex-1 max-w-md">
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
          
          {/* Dropdown de ordenação */}
          <div className="relative min-w-[200px]">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 bg-white appearance-none cursor-pointer"
              aria-label="Ordenar produtos"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* Seta customizada para o select */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtros ativos */}
        {(selectedCategory || searchTerm || sortBy !== 'default') && (
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
            {sortBy !== 'default' && (
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <ArrowUpDown className="w-4 h-4 mr-1" />
                Ordenação: {sortOptions.find(opt => opt.value === sortBy)?.label}
                <button
                  onClick={clearSort}
                  className="ml-2 hover:text-green-900 transition-colors"
                  aria-label="Remover filtro de ordenação"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={() => {
                clearSearch();
                clearCategory();
                clearSort();
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
            handleSelectCategory={handleSelectCategory}
            categories={categories}
          />
          {/* Listagem de produtos */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
    const [products, categories] = await Promise.all([
      getAllProductsAlternative(),
      getAllCategories()
    ]);
    
    return {
      props: {
        products,
        categories,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return {
      props: {
        products: [],
        categories: [],
      },
    };
  }
};

export default ShopIndex;