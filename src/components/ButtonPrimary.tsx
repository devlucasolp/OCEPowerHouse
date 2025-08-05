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
  const baseClass =
    `bg-accent text-black font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-500 ease-out ` +
    `hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ` +
    `active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ` +
    `hover:scale-105 hover:-translate-y-0.5 hover:drop-shadow-[0_0_6px_#FED600] focus:scale-105 focus:-translate-y-0.5 focus:drop-shadow-[0_0_6px_#FED600] ` +
    `transition-transform transition-shadow ` +
    className;

  if (as === 'a' && href) {
    return (
      <a
        href={href}
        className={baseClass}
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
      className={baseClass}
      tabIndex={0}
      aria-label="Botão primário"
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
