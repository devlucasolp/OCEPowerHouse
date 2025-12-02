import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
// REMOVER esta importação, pois o browser não deve chamar a Sanity diretamente
// import { getAllProductsAlternative } from '../lib/sanity';
import { urlFor } from '../lib/sanityImage';
import type { Product } from '../types/product';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  iconColor: string;
  linkClasses: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ 
  isOpen, 
  onClose, 
  iconColor, 
  linkClasses 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Carregar produtos quando o dropdown abre pela primeira vez
  useEffect(() => {
    if (isOpen && !isInitialized) {
      loadProducts();
    }
  }, [isOpen, isInitialized]);

  // Focar no input quando o dropdown abre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filtrar produtos baseado no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter(product => {
      const categoryText = typeof product.category === 'string' 
        ? product.category 
        : product.category?.title || '';
      
      return product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryText.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredProducts(filtered.slice(0, 8)); // Limitar a 8 resultados
  }, [searchTerm, products]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Fechar dropdown com ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      console.log('🔍 SearchDropdown: Carregando produtos via API...');
      const resp = await fetch('/api/products/all', { method: 'GET' });
      if (!resp.ok) {
        throw new Error(`Falha ao buscar produtos: ${resp.status}`);
      }
      const data = await resp.json();
      const allProducts: Product[] = data?.products ?? [];
      console.log(`✅ SearchDropdown: ${allProducts.length} produtos carregados (API)`);
      setProducts(allProducts);
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ SearchDropdown: Erro ao carregar produtos (API):', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setFilteredProducts([]);
    onClose();
  };

  const getProductImageUrl = (product: Product) => {
    if (product.image) {
      return urlFor(product.image).width(60).height(60).url();
    }
    return '/img/static/placeholder-product.svg';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getProductSlug = (product: Product) => {
    if (typeof product.slug === 'string') {
      return product.slug;
    }
    return product.slug?.current || '';
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-96 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 overflow-hidden"
      style={{
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header do dropdown */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800"
          />
          <button
            onClick={handleClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar busca"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo do dropdown */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto mb-2"></div>
            Carregando produtos...
          </div>
        ) : !searchTerm.trim() ? (
          <div className="p-6 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            Digite para buscar produtos
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="text-gray-400 mb-2">🔍</div>
            Nenhum produto encontrado para "{searchTerm}"
          </div>
        ) : (
          <div className="py-2">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                href={`/shop/${getProductSlug(product)}`}
                onClick={handleClose}
                className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <div className="flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={getProductImageUrl(product)}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </h4>
                  <p className="text-xs text-gray-500 capitalize">
                    {typeof product.category === 'string' ? product.category : product.category?.title || ''}
                  </p>
                  <p className="text-sm font-semibold text-yellow-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
            
            {/* Link para ver todos os resultados */}
            {filteredProducts.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <Link
                  href={`/shop?search=${encodeURIComponent(searchTerm)}`}
                  onClick={handleClose}
                  className="block text-center text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                >
                  Ver todos os resultados para "{searchTerm}"
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;