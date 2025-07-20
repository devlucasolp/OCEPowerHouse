import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle = ({ children, className = '' }: SectionTitleProps) => (
  <h2
    className={`text-2xl md:text-3xl font-extrabold text-primary mb-8 tracking-tight leading-tight ${className}`}
    tabIndex={0}
    aria-label="Título de sessão"
  >
    {children}
  </h2>
);

export default SectionTitle;
