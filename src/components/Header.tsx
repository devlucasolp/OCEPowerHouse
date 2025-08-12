import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/useCart';
import { useRouter } from 'next/router';
import React from 'react';
import { Search, ShoppingCart, Menu, X, Home, Zap, CreditCard, BookOpen, Store, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home, dropdown: [
  { href: '/coaches', label: 'Quem são os coaches' },
  ] },
  { href: '/planos', label: 'Planos', icon: CreditCard },
  { href: '/powercamps', label: 'PowerCamps', icon: Zap },
  { href: '/shop', label: 'Loja', icon: Store },
  { href: '/blog', label: 'Blog', icon: BookOpen },
];

const Header = () => {
  const { cartItems } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = React.useState(false);

  // Verifica se estamos na página principal
  const isHomePage = router.pathname === '/';

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

  // Função para determinar qual logo usar
  const getLogoSrc = () => {
    if (isHomePage) {
      // Na página principal, sempre usar a logo.png (mantém as cores originais)
      return "/img/static/logo.png";
    } else {
      // Nas outras páginas, mudar conforme o scroll
      return scrolled ? "/img/static/logo.png" : "/img/static/logopyb.png";
    }
  };

  // Função para determinar a cor dos ícones
  const getIconColor = () => {
    if (isHomePage) {
      // Na página principal, sempre branco
      return 'text-white';
    } else {
      // Nas outras páginas, mudar conforme o scroll
      return scrolled ? 'text-white' : 'text-gray-800';
    }
  };

  // Função para determinar as classes de cor dos links
  const getLinkClasses = () => {
    if (isHomePage) {
      // Na página principal, sempre branco com hover amarelo e melhor visibilidade
      return scrolled 
        ? 'text-white hover:text-yellow-400 focus:ring-offset-yellow-400'
        : 'text-white hover:text-yellow-400 focus:ring-offset-yellow-400 drop-shadow-lg';
    } else {
      // Nas outras páginas, mudar conforme o scroll
      return scrolled 
        ? 'text-white hover:text-yellow-400 focus:ring-offset-yellow-400' 
        : 'text-gray-800 hover:text-gray-600 focus:ring-offset-transparent';
    }
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        isHomePage && !scrolled
          ? 'bg-transparent' // Transparente na home sem scroll
          : scrolled || isHomePage
          ? 'bg-[#000000] border-yellow-400' 
          : 'bg-transparent'
      } h-16`}
      tabIndex={-1}
      aria-label="Cabeçalho do site"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center" tabIndex={0} aria-label="Power House Brasil">
          <Image 
            src={getLogoSrc()}
            alt="Logo Power House Brasil" 
            width={60} 
            height={60} 
            className="rounded-full transition-all duration-300" 
            priority 
          />
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-4 md:gap-6 items-center font-roboto">
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
                className={`flex items-center transition-colors font-semibold px-2 py-1 rounded focus:outline-none ${getLinkClasses()}`}
                tabIndex={0}
                aria-label="Home"
              >
                <Home className={`w-4 h-4 mr-2 ${getIconColor()}`} aria-hidden="true" />
                Home
                <ChevronDown className={`w-4 h-4 ml-1 ${getIconColor()}`} aria-hidden="true" />
              </Link>
              {/* Dropdown */}
              <div
                className={`absolute left-0 mt-2 min-w-[200px] bg-white shadow-xl rounded-xl py-3 z-30 transition-all duration-200 ${homeDropdownOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'} border border-yellow-200 backdrop-blur-sm`}
                role="menu"
                aria-label="Submenu Home"
                style={{
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)'
                }}
              >
                <Link
                  href="/coaches"
                  className="group flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100 focus:bg-gradient-to-r focus:from-yellow-50 focus:to-yellow-100 transition-all duration-200 rounded-lg mx-2 font-medium"
                  tabIndex={homeDropdownOpen ? 0 : -1}
                  role="menuitem"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:bg-yellow-500 transition-colors"></span>
                  Quem são os coaches
                </Link>
              </div>
            </li>
            {/* Demais links */}
            {navLinks.slice(1).map((link) => {
              const IconComponent = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center transition-colors font-semibold px-2 py-1 rounded focus:outline-none ${getLinkClasses()}`}
                    tabIndex={0}
                    aria-label={link.label}
                  >
                    <IconComponent className={`w-4 h-4 mr-2 ${getIconColor()}`} aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {/* Ícone de busca */}
            <li>
              <button
                className={`flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 transition-colors ${getLinkClasses()}`}
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
                className={`relative flex items-center ml-2 transition-colors focus:outline-none focus:ring-2 ${getLinkClasses()}`}
                tabIndex={0}
                aria-label="Carrinho"
              >
                <ShoppingCart className="w-6 h-6" aria-hidden="true" />
                {cartItems.length > 0 && (
                  <span className={`absolute -top-2 -right-2 text-xs rounded-full px-2 py-0.5 font-bold border ${
                    isHomePage && !scrolled
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg' // Sombra para destaque na home transparente
                      : scrolled || isHomePage
                      ? 'bg-yellow-400 text-black border-yellow-400' 
                      : 'bg-white text-gray-800 border-gray-800'
                  }`}>
                    {cartItems.reduce((acc, item) => acc + ((item as any).quantity || 1), 0)}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
        {/* Mobile menu button */}
        <button
          className={`md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none ${
            isHomePage && !scrolled
              ? 'text-white' // Melhor visibilidade na home
              : scrolled || isHomePage
              ? 'text-white' 
              : 'text-black focus:ring-offset-transparent'
          }`}
          onClick={handleToggleMenu}
          onKeyDown={handleKeyDownMenu}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          tabIndex={0}
        >
          <span className="sr-only">Abrir menu</span>
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
      {/* Mobile sidebar */}
      {menuOpen && (
        <>
          {/* Backdrop/Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sidebar */}
          <nav 
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-label="Menu mobile"
          >
            {/* Header do sidebar */}
            <div className="flex items-center justify-between p-2 border-b bg-black border-gray-200">
              <Image 
                src="/img/static/logo.png" 
                alt="Logo Power House Brasil" 
                width={50} 
                height={50} 
                className="rounded-full" 
              />
              <button
                className="flex items-center justify-center w-7 h-7 rounded-full text-white hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Menu items */}
            <ul className="flex flex-col p-4 space-y-2 font-roboto">
              {/* Home com dropdown mobile */}
              <li className="border-b border-gray-100 pb-2">
                <Link
                  href="/"
                  className="flex items-center text-gray-800 hover:text-blue-700 transition-colors font-semibold py-3 px-2 rounded-lg hover:bg-gray-50"
                  tabIndex={0}
                  aria-label="Home"
                  onClick={() => setMenuOpen(false)}
                >
                  <Home className="w-5 h-5 mr-2 text-gray-800" aria-hidden="true" />
                  Home
                </Link>
                <div className="ml-4 mt-2 space-y-1">
                  <Link
                    href="/coaches"
                    className="block py-2 px-3 text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-lg"
                    tabIndex={0}
                    onClick={() => setMenuOpen(false)}
                  >
                    Quem são os coaches
                  </Link>

                </div>
              </li>
              
              {/* Demais links */}
              {navLinks.slice(1).map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.href} className="border-b border-gray-100 last:border-b-0">
                    <Link
                      href={link.href}
                      className="block text-gray-800 hover:text-blue-700 transition-colors font-semibold py-3 px-2 rounded-lg hover:bg-gray-50"
                      tabIndex={0}
                      aria-label={link.label}
                      onClick={() => setMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5 mr-2 text-gray-800" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Bottom actions */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              {/* Ícone de busca */}
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                aria-label="Buscar produtos"
                tabIndex={0}
                type="button"
              >
                <Search className="w-6 h-6" aria-hidden="true" />
              </button>
              
              {/* Ícone do carrinho */}
              <Link
                href="/checkout"
                className="relative flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                tabIndex={0}
                aria-label="Carrinho"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingCart className="w-6 h-6" aria-hidden="true" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartItems.reduce((acc, item) => acc + ((item as any).quantity || 1), 0)}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;