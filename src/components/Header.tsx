import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/useCart';
import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const navLinks = [
  {
    href: '/',
    label: 'Home',
    dropdown: [
      { href: '/coaches', label: 'Quem são os coaches' },
      { href: '/planos', label: 'Planos' },
    ],
  },
  { href: '/powercamps', label: 'PowerCamps' },
  { href: '/planos', label: 'Planos' },
  { href: '/shop', label: 'Loja' },
  { href: '/blog', label: 'Blog' },
];

const Header = () => {
  const { cartItems, hasHydrated } = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMenu = () => setMenuOpen((open) => !open);
  const handleKeyDownMenu = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') handleToggleMenu();
  };

  // Dropdown handlers para acessibilidade
  const handleHomeMouseEnter = () => setHomeDropdownOpen(true);
  const handleHomeMouseLeave = () => setHomeDropdownOpen(false);
  const handleHomeFocus = () => setHomeDropdownOpen(true);
  const handleHomeBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setHomeDropdownOpen(false);
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 bg-yellow-400 shadow-md border-b border-yellow-400 h-24`}
      tabIndex={-1}
      aria-label="Cabeçalho do site"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-20 md:h-24">
        <Link href="/" className="flex items-center" tabIndex={0} aria-label="Power House Brasil">
          <Image
            src="/img/static/logo.jpg"
            alt="Logo Power House Brasil"
            width={100}
            height={100}
            className="rounded-full"
            priority
          />
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-4 md:gap-6 items-center">
            {/* Home com dropdown */}
            <li
              className="relative"
              onMouseEnter={handleHomeMouseEnter}
              onMouseLeave={handleHomeMouseLeave}
              onFocus={handleHomeFocus}
              onBlur={handleHomeBlur}
              tabIndex={-1}
            >
              <Link
                href="/"
                className="flex items-center text-black hover:text-blue-700 transition-colors font-semibold px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400"
                tabIndex={0}
                aria-label="Home"
              >
                Home
                <ChevronDown className="w-4 h-4 ml-1 text-black" aria-hidden="true" />
              </Link>
              {/* Dropdown */}
              <div
                className={`absolute left-0 mt-2 min-w-[180px] bg-white shadow-lg rounded-lg py-2 z-30 transition-all ${homeDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} border border-neutral-200`}
                role="menu"
                aria-label="Submenu Home"
              >
                <Link
                  href="/coaches"
                  className="block px-4 py-2 text-black hover:bg-yellow-100 hover:text-blue-700 focus:bg-yellow-100 focus:text-blue-700 transition-colors rounded"
                  tabIndex={homeDropdownOpen ? 0 : -1}
                  role="menuitem"
                >
                  Quem são os coaches
                </Link>
                <Link
                  href="/planos"
                  className="block px-4 py-2 text-black hover:bg-yellow-100 hover:text-blue-700 focus:bg-yellow-100 focus:text-blue-700 transition-colors rounded"
                  tabIndex={homeDropdownOpen ? 0 : -1}
                  role="menuitem"
                >
                  Planos
                </Link>
              </div>
            </li>
            {/* Demais links */}
            {navLinks.slice(1).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-black hover:text-blue-700 transition-colors font-semibold px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400"
                  tabIndex={0}
                  aria-label={link.label}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Ícone de busca */}
            <li>
              <button
                className="flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400 hover:text-blue-700 text-blue-900"
                aria-label="Buscar produtos"
                tabIndex={0}
                type="button"
              >
                <Search className="w-6 h-6" aria-hidden="true" />
              </button>
            </li>
            {/* Ícone do carrinho */}
            <li>
              <Link
                href="/checkout"
                className="relative flex items-center ml-2 text-blue-900 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400"
                tabIndex={0}
                aria-label="Carrinho"
              >
                <span className="text-2xl">🛒</span>
                {hasHydrated && cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-xs rounded-full px-2 py-0.5 font-bold border border-blue-900">
                    {cartItems.reduce((acc, item) => acc + ((item as any).quantity || 1), 0)}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400 text-blue-900"
          onClick={handleToggleMenu}
          onKeyDown={handleKeyDownMenu}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          tabIndex={0}
        >
          <span className="sr-only">Abrir menu</span>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-900"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-yellow-400 shadow-md px-4 py-4" aria-label="Menu mobile">
          <ul className="flex flex-col gap-4">
            {/* Home com dropdown mobile */}
            <li className="relative">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="flex items-center text-black hover:text-blue-700 transition-colors font-semibold px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400"
                  tabIndex={0}
                  aria-label="Home"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                  <ChevronDown className="w-4 h-4 ml-1 text-black" aria-hidden="true" />
                </Link>
              </div>
              <div className="ml-6 mt-1 flex flex-col gap-1">
                <Link
                  href="/coaches"
                  className="block px-4 py-2 text-black bg-white hover:bg-yellow-100 hover:text-blue-700 focus:bg-yellow-100 focus:text-blue-700 transition-colors rounded"
                  tabIndex={0}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Quem são os coaches
                </Link>
                <Link
                  href="/planos"
                  className="block px-4 py-2 text-black bg-white hover:bg-yellow-100 hover:text-blue-700 focus:bg-yellow-100 focus:text-blue-700 transition-colors rounded"
                  tabIndex={0}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Planos
                </Link>
              </div>
            </li>
            {/* Demais links */}
            {navLinks.slice(1).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-black hover:text-blue-700 transition-colors font-semibold px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400"
                  tabIndex={0}
                  aria-label={link.label}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Ícone de busca */}
            <li>
              <button
                className="flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400 hover:text-blue-700 text-blue-900"
                aria-label="Buscar produtos"
                tabIndex={0}
                type="button"
              >
                <Search className="w-6 h-6" aria-hidden="true" />
              </button>
            </li>
            {/* Ícone do carrinho */}
            <li>
              <Link
                href="/checkout"
                className="relative flex items-center text-blue-900 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-yellow-400"
                tabIndex={0}
                aria-label="Carrinho"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-2xl">🛒</span>
                {hasHydrated && cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-xs rounded-full px-2 py-0.5 font-bold border border-blue-900">
                    {cartItems.reduce((acc, item) => acc + ((item as any).quantity || 1), 0)}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
