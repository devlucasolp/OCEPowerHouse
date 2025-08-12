import React from 'react';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

export type ButtonPrimaryProps = (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>) & {
  children: ReactNode;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
};

const ButtonPrimary = ({ children, className = '', as, href, ...props }: ButtonPrimaryProps) => {
  // Se href for fornecido, use 'a' como elemento padrão, caso contrário use 'button'
  const elementType = href ? 'a' : (as || 'button');
  
  if (elementType === 'a') {
    return (
      <a
        href={href}
        className={`bg-black text-white font-bold px-6 py-3 rounded-full shadow-button transition-all duration-300 ease-in-out hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        tabIndex={0}
        aria-label="Botão primário"
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      className={`bg-black text-white font-bold px-6 py-3 rounded-full shadow-button transition-all duration-300 ease-in-out hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      tabIndex={0}
      aria-label="Botão primário"
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;