import React from 'react';

const WHATSAPP_LINK =
  'https://web.whatsapp.com/send?phone=5531997725450&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20sobre%20os%20servi%C3%A7os%20e%2Fou%20produtos%20oferecidos%20pela%20OCE.';

const WhatsAppFloatButton = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco no WhatsApp"
    className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 bg-green-500 hover:bg-green-600 transition-colors duration-300 rounded-full shadow-lg flex items-center justify-center w-16 h-16 md:w-20 md:h-20 focus:outline-none focus:ring-4 focus:ring-green-300"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 32 32"
      fill="white"
      className="w-8 h-8 md:w-10 md:h-10"
      aria-hidden="true"
    >
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.36 7.13L4 29l7.13-2.36A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.52-5.56-1.5l-.39-.23-4.13 1.37 1.37-4.13-.23-.39A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.61-.48-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.22.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
    </svg>
  </a>
);

export default WhatsAppFloatButton; 