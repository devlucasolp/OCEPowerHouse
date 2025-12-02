import React, { useEffect, useMemo, useState } from 'react';
import { Mail, User, MapPin, Home, Hash, Building2, Navigation, Map, Phone, FileText } from 'lucide-react';
import { 
  CustomerAddress, 
  formatCep, 
  isValidCep, 
  isValidCPF, 
  isValidCNPJ, 
  formatPhone, 
  formatCPF, 
  formatCNPJ
} from '../lib/addressUtils';

type DeliveryType = 'delivery' | 'pickup';

interface BuyerInfo {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  documentType: 'cpf' | 'cnpj';
  address: CustomerAddress | null;
}

interface SimplePurchaseFormProps {
  deliveryType: DeliveryType;
  onChange?: (info: BuyerInfo & { isValid: boolean }) => void;
  className?: string;
}

const emailIsValid = (email: string) => /\S+@\S+\.\S+/.test(email);
const phoneIsValid = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

export const SimplePurchaseForm: React.FC<SimplePurchaseFormProps> = ({
  deliveryType,
  onChange,
  className = ''
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  // NOVOS ESTADOS
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');

  // Campos de endereço
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [noComplement, setNoComplement] = useState(false);
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [stateUF, setStateUF] = useState('');

  const address: CustomerAddress | null = useMemo(() => {
    if (deliveryType === 'pickup') return null;
    if (
      !isValidCep(cep) ||
      !street.trim() ||
      !number.trim() ||
      !neighborhood.trim() ||
      !city.trim() ||
      !stateUF.trim() ||
      !phoneIsValid(phone) ||
      !document.trim() ||
      !(documentType === 'cpf' ? isValidCPF(document) : isValidCNPJ(document))
    ) {
      return null;
    }
    return {
      cep,
      street: street.trim(),
      number: number.trim(),
      complement: noComplement ? undefined : complement.trim() || undefined,
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: stateUF.trim(),
      country: 'Brasil',
      phone: phone.replace(/\D/g, ''),
      document: document.replace(/\D/g, ''),
      documentType
    };
  }, [deliveryType, cep, street, number, complement, noComplement, neighborhood, city, stateUF, phone, document, documentType]);

  const isValid = useMemo(() => {
    const baseValid = 
      fullName.trim().length >= 3 && 
      emailIsValid(email) &&
      phoneIsValid(phone) &&
      document.trim().length > 0 &&
      (documentType === 'cpf' ? isValidCPF(document) : isValidCNPJ(document));
    
    if (deliveryType === 'pickup') {
      return baseValid;
    }
    return baseValid && !!address;
  }, [fullName, email, phone, document, documentType, deliveryType, address]);

  useEffect(() => {
    onChange?.({
      fullName,
      email,
      phone: phone.replace(/\D/g, ''),
      document: document.replace(/\D/g, ''),
      documentType,
      address,
      isValid
    });
  }, [fullName, email, phone, document, documentType, address, isValid, onChange]);

  // NOVAS FUNÇÕES
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setPhone(formatPhone(value));
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxLength = documentType === 'cpf' ? 11 : 14;
    if (value.length <= maxLength) {
      const formatted = documentType === 'cpf' ? formatCPF(value) : formatCNPJ(value);
      setDocument(formatted);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCep(e.target.value);
    setCep(value);
  };

  const handleNoComplementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setNoComplement(checked);
    if (checked) setComplement('');
  };

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Dados do Comprador</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Nome completo *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ex: João da Silva"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            E-mail *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: joao@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* NOVOS CAMPOS - Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Telefone *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Ex: (11) 99999-9999"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* NOVOS CAMPOS - Tipo de documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-4 h-4 inline mr-1" />
            Tipo de documento *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="cpf"
                checked={documentType === 'cpf'}
                onChange={(e) => {
                  setDocumentType('cpf');
                  setDocument('');
                }}
                className="mr-2"
              />
              CPF (Pessoa Física)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="cnpj"
                checked={documentType === 'cnpj'}
                onChange={(e) => {
                  setDocumentType('cnpj');
                  setDocument('');
                }}
                className="mr-2"
              />
              CNPJ (Pessoa Jurídica)
            </label>
          </div>
        </div>

        {/* NOVOS CAMPOS - CPF ou CNPJ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-4 h-4 inline mr-1" />
            {documentType === 'cpf' ? 'CPF' : 'CNPJ'} *
          </label>
          <input
            type="text"
            value={document}
            onChange={handleDocumentChange}
            placeholder={documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {document && !(documentType === 'cpf' ? isValidCPF(document) : isValidCNPJ(document)) && (
            <p className="text-xs text-red-600 mt-1">
              {documentType === 'cpf' ? 'CPF inválido' : 'CNPJ inválido'}
            </p>
          )}
        </div>

        {/* CAMPOS DE ENDEREÇO - DE VOLTA! */}
        {deliveryType === 'delivery' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  CEP *
                </label>
                <input
                  type="text"
                  value={cep}
                  onChange={handleCepChange}
                  placeholder="Ex: 30130-000"
                  maxLength={9}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Home className="w-4 h-4 inline mr-1" />
                Endereço (logradouro) *
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Ex: Rua das Flores"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Número *
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ex: 123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Complemento
                </label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Ex: Apto 101"
                  disabled={noComplement}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <label className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={noComplement}
                    onChange={(e) => {
                      setNoComplement(e.target.checked);
                      if (e.target.checked) setComplement('');
                    }}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-600">Sem complemento</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Navigation className="w-4 h-4 inline mr-1" />
                Bairro *
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Centro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Map className="w-4 h-4 inline mr-1" />
                  Cidade *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Belo Horizonte"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado (UF) *
                </label>
                <input
                  type="text"
                  value={stateUF}
                  onChange={(e) => setStateUF(e.target.value.toUpperCase())}
                  placeholder="Ex: MG"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SimplePurchaseForm;