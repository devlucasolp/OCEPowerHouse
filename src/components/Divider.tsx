import React from 'react';

interface DividerProps {
  className?: string;
}

const Divider = ({ className = '' }: DividerProps) => (
  <hr className={`border-t border-muted my-8 ${className}`} aria-label="Divisor de sessão" />
);

export default Divider;
