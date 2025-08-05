const Footer = () => (
  <footer className="w-full bg-accent text-black py-10 mt-8 border-t border-accent shadow-inner">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-8 md:gap-4">
      <div className="flex flex-col items-center md:items-start text-sm gap-1 mb-4 md:mb-0">
        <span className="font-semibold text-black uppercase tracking-wide">Endereço</span>
        <span>Alameda do Ingá 222/302 – Vale do Sereno – Nova Lima – MG – Cep: 34006069</span>
        <span className="font-semibold text-black mt-2 uppercase tracking-wide">Telefone</span>
        <a href="tel:+5531997725450" className="hover:text-blue-700 transition-colors">
          (31) 99772-5450
        </a>
        <span className="font-semibold text-black mt-2 uppercase tracking-wide">E-mail</span>
        <a
          href="mailto:contato@powerhousebrasil.com.br"
          className="hover:text-blue-700 transition-colors"
        >
          contato@powerhousebrasil.com.br
        </a>
      </div>
      <div className="flex flex-col items-center md:items-end gap-2">
        <span className="text-sm font-semibold">
          &copy; {new Date().getFullYear()} Power House Brasil. Todos os direitos reservados.
        </span>
        <div className="flex gap-4 items-center mt-2">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors"
            tabIndex={0}
            aria-label="Instagram Power House"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
          </a>
          <a
            href="#"
            className="hover:text-blue-700 transition-colors font-semibold"
            tabIndex={0}
            aria-label="Institucional"
          >
            Institucional
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
