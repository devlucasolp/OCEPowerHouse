import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDown, Package } from 'lucide-react';

// Mapeamento de categorias para nomes elegantes
const categoryMapping = {
  'vestuario': 'Vestuário',
  'acessorios': 'Acessórios',
  'suplementos': 'Suplementos',
  'nutricao': 'Nutrição & Géis',
  'bike_pneus': 'Pneus de Bike',
  'bike_acessorios': 'Acessórios de Bike'
};

type SidebarFilterProps = {
  selectedCategory: string | null;
  handleSelectCategory: (category: string | null) => void;
  categories?: string[]; // Categorias vindas do Sanity
};

const SidebarFilter: React.FC<SidebarFilterProps> = ({ 
  selectedCategory, 
  handleSelectCategory,
  categories = [] 
}) => {
  // Função para obter nome elegante da categoria
  const getCategoryDisplayName = (category: string) => {
    return categoryMapping[category as keyof typeof categoryMapping] || category;
  };

  return (
    <aside className="w-full md:w-64 md:sticky md:top-20 z-30">
      {/* Mobile: Disclosure */}
      <div className="block md:hidden mb-4">
        <Disclosure>
          {({ open }: { open: boolean }) => (
            <>
              <Disclosure.Button className="flex items-center justify-between w-full px-4 py-3 bg-black text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 hover:bg-black/90">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Categorias
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="mt-3 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  <li>
                    <button
                      className={`w-full text-left px-4 py-3 font-medium transition-all duration-200 ${
                        selectedCategory === null 
                          ? 'bg-accent text-black font-bold' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                      }`}
                      onClick={() => handleSelectCategory(null)}
                      aria-label="Todas as categorias"
                      tabIndex={0}
                    >
                      Todas as Categorias
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`w-full text-left px-4 py-3 font-medium transition-all duration-200 ${
                          selectedCategory === cat 
                            ? 'bg-accent text-black font-bold' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                        }`}
                        onClick={() => handleSelectCategory(cat)}
                        aria-label={`Filtrar por ${getCategoryDisplayName(cat)}`}
                        tabIndex={0}
                      >
                        {getCategoryDisplayName(cat)}
                      </button>
                    </li>
                  ))}
                </ul>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>

      {/* Desktop: Fixo */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-black px-6 py-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Categorias
          </h2>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === null 
                    ? 'bg-accent text-black font-bold shadow-md transform scale-105' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
                onClick={() => handleSelectCategory(null)}
                aria-label="Todas as categorias"
                tabIndex={0}
              >
                Todas as Categorias
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === cat 
                      ? 'bg-accent text-black font-bold shadow-md transform scale-105' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                  onClick={() => handleSelectCategory(cat)}
                  aria-label={`Filtrar por ${getCategoryDisplayName(cat)}`}
                  tabIndex={0}
                >
                  {getCategoryDisplayName(cat)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilter;