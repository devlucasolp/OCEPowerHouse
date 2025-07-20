import React from 'react';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

export type ButtonPrimaryProps = (
  | ButtonHTMLAttributes<HTMLButtonElement>
  | AnchorHTMLAttributes<HTMLAnchorElement>
) & {
  children: ReactNode;
  as?: 'button' | 'a';
  href?: string;
};

const ButtonPrimary = ({
  children,
  className = '',
  as = 'button',
  href,
  ...props
}: ButtonPrimaryProps) => {
  if (as === 'a' && href) {
    return (
      <a
        href={href}
        className={`bg-accent text-foreground font-bold px-6 py-3 rounded-full shadow-button transition-all duration-300 ease-in-out hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
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
      className={`bg-accent text-foreground font-bold px-6 py-3 rounded-full shadow-button transition-all duration-300 ease-in-out hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      tabIndex={0}
      aria-label="Botão primário"
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
