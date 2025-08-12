import Link from 'next/link';
import Image from 'next/image';

const Footer = () => (
  <footer className="bg-gradient-to-b from-[#070707] to-[#000000] text-white border-t border-gray-800">
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Coluna 1 - Brand & Contato */}
        <div className="space-y-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Image 
                src="/img/static/logo.png" 
                alt="Power House Brasil" 
                width={40} 
                height={40} 
                className="rounded-full mr-3" 
              />
              <span className="text-xl font-bold">Power House Brasil</span>
            </div>
            <p className="text-white text-sm max-w-sm">
              Especialistas em ciclismo urbano com produtos de qualidade e conteúdo exclusivo.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contato</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-300">Alameda do Ingá 222/302, Vale do Sereno</p>
                <p className="text-gray-300">Nova Lima – MG – CEP: 34006-069</p>
              </div>
              <div>
                <a href="tel:+5531997725450" className="text-white hover:text-yellow-400 transition-colors">
                  (31) 99772-5450
                </a>
              </div>
              <div>
                <a href="mailto:contato@powerhousebrasil.com.br" className="text-white hover:text-yellow-400 transition-colors">
                  contato@powerhousebrasil.com.br
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2 - Links & Redes Sociais */}
        <div className="space-y-8">
          {/* Links */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 text-sm uppercase tracking-wide">Menu</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">
                Loja
              </Link>
              <Link href="/powercamps" className="text-gray-400 hover:text-white transition-colors">
                PowerCamps
              </Link>
              <Link href="/coaches" className="text-gray-400 hover:text-white transition-colors">
                Coaches
              </Link>
              <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/planos" className="text-gray-400 hover:text-white transition-colors">
                Planos
              </Link>
            </div>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 text-sm uppercase tracking-wide">Suporte</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Central de Ajuda
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4 text-sm uppercase tracking-wide">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} Power House Brasil. Todos os direitos reservados.
          </div>
          <div className="mt-2 md:mt-0">
            Desenvolvido para ciclistas
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 