import React from 'react';
import { ShieldCheck, CreditCard, Truck } from 'lucide-react';

const trustItems = [
  {
    icon: <Truck className="w-5 h-5 mr-2" aria-hidden="true" />,
    text: 'Frete grátis acima de R$200 para todo o Brasil',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 mr-2" aria-hidden="true" />,
    text: 'Pagamento seguro e criptografado',
  },
  {
    icon: <CreditCard className="w-5 h-5 mr-2" aria-hidden="true" />,
    text: 'Aceitamos Pix, boleto e cartões',
  },
];

const TrustBar: React.FC = () => {
  return (
    <div
      className="w-full bg-yellow-100 text-blue-900 text-sm py-2 px-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 border-b border-yellow-200 shadow-sm fixed top-24 left-0 z-40"
      role="region"
      aria-label="Informações de segurança e promoções"
    >
      {trustItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1" tabIndex={0} aria-label={item.text}>
          {item.icon}
          <span className="font-medium">{item.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustBar;
