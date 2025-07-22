import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = '' }: ContainerProps) => (
  <div
    className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    tabIndex={-1}
    aria-label="Container centralizador"
  >
    {children}
  </div>
);

export default Container;
