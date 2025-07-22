import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { products } from '../data/products';

// Extrai categorias únicas dos produtos
const categories = Array.from(new Set(products.map((p) => p.category)));

type SidebarFilterProps = {
  selectedCategory: string | null;
  handleSelectCategory: (category: string | null) => void;
};

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  selectedCategory,
  handleSelectCategory,
}) => {
  return (
    <aside className="w-full md:w-56 md:sticky md:top-20 z-30">
      {/* Mobile: Disclosure */}
      <div className="block md:hidden mb-4">
        <Disclosure>
          {({ open }: { open: boolean }) => (
            <>
              <Disclosure.Button
                className="flex items-center justify-between w-full px-4 py-2 bg-yellow-100 text-blue-900 font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-900"
                aria-label="Abrir filtro de categorias"
              >
                Categorias
                <ChevronDown
                  className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="mt-2 px-2">
                <ul className="flex flex-col gap-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded font-medium transition-colors ${selectedCategory === null ? 'bg-yellow-400 text-blue-900' : 'hover:bg-yellow-100 text-blue-900'}`}
                      onClick={() => handleSelectCategory(null)}
                      aria-label="Todas as categorias"
                      tabIndex={0}
                    >
                      Todas
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded font-medium transition-colors ${selectedCategory === cat ? 'bg-yellow-400 text-blue-900' : 'hover:bg-yellow-100 text-blue-900'}`}
                        onClick={() => handleSelectCategory(cat)}
                        aria-label={`Filtrar por ${cat}`}
                        tabIndex={0}
                      >
                        {cat}
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
      <div className="hidden md:block bg-yellow-100 rounded shadow p-4">
        <h2 className="text-blue-900 font-semibold text-lg mb-3">Categorias</h2>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded font-medium transition-colors ${selectedCategory === null ? 'bg-yellow-400 text-blue-900' : 'hover:bg-yellow-200 text-blue-900'}`}
              onClick={() => handleSelectCategory(null)}
              aria-label="Todas as categorias"
              tabIndex={0}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className={`w-full text-left px-3 py-2 rounded font-medium transition-colors ${selectedCategory === cat ? 'bg-yellow-400 text-blue-900' : 'hover:bg-yellow-200 text-blue-900'}`}
                onClick={() => handleSelectCategory(cat)}
                aria-label={`Filtrar por ${cat}`}
                tabIndex={0}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarFilter;
