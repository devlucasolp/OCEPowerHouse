import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDown, Package, Shirt, Pill, Cog, Wrench, Backpack, Bike, BookOpen, Trophy } from 'lucide-react';

interface Category {
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

type SidebarFilterProps = {
  selectedCategory: string | null;
  handleSelectCategory: (category: string | null) => void;
  categories: Category[]; // Categorias vindas do Sanity
};

// Função para obter o ícone baseado no nome
const getCategoryIcon = (iconName: string | undefined) => {
  if (!iconName) return null;
  
  switch (iconName) {
    case 'shirt':
      return <Shirt className="w-4 h-4" />;
    case 'pill':
      return <Pill className="w-4 h-4" />;
    case 'gear':
      return <Cog className="w-4 h-4" />;
    case 'wrench':
      return <Wrench className="w-4 h-4" />;
    case 'bag':
      return <Backpack className="w-4 h-4" />;
    case 'bike':
      return <Bike className="w-4 h-4" />;
    case 'book':
      return <BookOpen className="w-4 h-4" />;
    case 'trophy':
      return <Trophy className="w-4 h-4" />;
    default:
      return null; // Não exibe ícone se não houver correspondência
  }
};

const SidebarFilter: React.FC<SidebarFilterProps> = ({ 
  selectedCategory, 
  handleSelectCategory,
  categories 
}) => {
  // Ordenar categorias por ordem definida no Sanity
  const sortedCategories = React.useMemo(() => {
    return [...categories].sort((a, b) => a.order - b.order);
  }, [categories]);

  return (
    <aside className="w-full md:w-64 md:sticky md:top-20 md:self-start z-30 md:max-h-[calc(100vh-5rem)] md:overflow-y-auto">
      {/* Mobile: Disclosure */}
      <div className="block md:hidden mb-4">
        <Disclosure>
          {({ open }) => (
            <div>
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
                  {sortedCategories.map((category) => (
                    <li key={category._id}>
                      <button
                        className={`w-full text-left px-4 py-3 font-medium transition-all duration-200 ${
                          selectedCategory === category.slug.current 
                            ? 'text-black font-bold' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category.slug.current ? category.color : 'transparent'
                        }}
                        onClick={() => handleSelectCategory(category.slug.current)}
                        aria-label={`Filtrar por ${category.title}`}
                        tabIndex={0}
                      >
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.icon)}
                          {category.title}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </Disclosure.Panel>
            </div>
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
            {sortedCategories.map((category) => (
              <li key={category._id}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.slug.current 
                      ? 'text-black font-bold shadow-md transform scale-105' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.slug.current ? category.color : 'transparent'
                  }}
                  onClick={() => handleSelectCategory(category.slug.current)}
                  aria-label={`Filtrar por ${category.title}`}
                  tabIndex={0}
                  title={category.description}
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.icon)}
                    {category.title}
                  </div>
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