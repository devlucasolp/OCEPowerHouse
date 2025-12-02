import { NextPage } from 'next';
import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import Seo from '../components/Seo';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Pedidos e Entregas",
    question: "Qual o prazo de entrega dos produtos?",
    answer: "O prazo de entrega varia de acordo com sua localização. Para a região Sudeste, o prazo é de 3 a 7 dias úteis. Para outras regiões, pode variar de 5 a 12 dias úteis. Você receberá o código de rastreamento por e-mail assim que o produto for despachado."
  },
  {
    category: "Pedidos e Entregas",
    question: "Como posso acompanhar meu pedido?",
    answer: "Após a confirmação do pagamento, você receberá um e-mail com o código de rastreamento. Você pode acompanhar o status da entrega diretamente no site dos Correios ou da transportadora responsável."
  },
  {
    category: "Pedidos e Entregas",
    question: "Vocês entregam em todo o Brasil?",
    answer: "Sim! Realizamos entregas para todo o território nacional. O frete é calculado automaticamente no checkout com base no seu CEP."
  },
  {
    category: "Produtos",
    question: "Como escolher o tamanho correto?",
    answer: "Cada produto possui uma tabela de medidas específica. Recomendamos sempre consultar o guia de tamanhos disponível na página do produto. Em caso de dúvidas, entre em contato conosco pelo WhatsApp (31) 99772-5450."
  },
  {
    category: "Produtos",
    question: "Os produtos têm garantia?",
    answer: "Sim! Todos os nossos produtos possuem garantia contra defeitos de fabricação. O prazo varia de acordo com o fabricante, geralmente entre 6 meses a 2 anos. Consulte as especificações de cada produto para mais detalhes."
  },
  {
    category: "Produtos",
    question: "Posso trocar um produto se não servir?",
    answer: "Sim! Você tem até 7 dias após o recebimento para solicitar a troca por tamanho. O produto deve estar em perfeitas condições, sem uso, com etiquetas e na embalagem original. O frete da devolução fica por conta do cliente."
  },
  {
    category: "Pagamento",
    question: "Quais formas de pagamento vocês aceitam?",
    answer: "Aceitamos cartões de crédito (Visa, Mastercard, Elo), cartão de débito, PIX e boleto bancário. Para cartão de crédito, oferecemos parcelamento em até 12x, sendo parcela mínima de R$ 150,00 sem juros. Valores abaixo de R$ 150,00 são parcelados com juros."
  },
  {
    category: "Pagamento",
    question: "Quando o pagamento é processado?",
    answer: "PIX: Aprovação imediata. Cartão de crédito: Aprovação em até 2 dias úteis. Boleto bancário: Aprovação em até 3 dias úteis após o pagamento. Você receberá uma confirmação por e-mail."
  },
  {
    category: "Pedidos e Entregas",
    question: "Como funciona a confirmação do meu pedido?",
    answer: "Após realizar seu pedido no site, você receberá um e-mail informando que o pagamento está pendente. Assim que o Mercado Pago processar e confirmar o pagamento, você receberá o comprovante por e-mail e seu pedido será automaticamente confirmado pela nossa loja. A partir desse momento, iniciaremos o processo de separação e envio do seu produto."
  },
  {
    category: "Pagamento",
    question: "Posso cancelar meu pedido?",
    answer: "Sim! Você pode cancelar seu pedido enquanto ele não foi despachado. Entre em contato conosco o mais rápido possível pelo e-mail contato@powerhousebrasil.com.br ou WhatsApp (31) 99772-5450."
  },
  {
    category: "Suporte",
    question: "Como entrar em contato com o suporte?",
    answer: "Você pode entrar em contato conosco pelo WhatsApp (31) 99772-5450, e-mail contato@powerhousebrasil.com.br ou através da nossa Central de Ajuda. Nosso horário de atendimento é de segunda a sexta, das 8h às 18h, e sábado das 8h às 12h."
  }
];

const FAQPage: NextPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', ...Array.from(new Set(faqData.map(item => item.category)))];
  
  const filteredFAQ = selectedCategory === 'Todos' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <PageLayout>
      <Seo 
        title="FAQ - Perguntas Frequentes | Power House Brasil"
        description="Encontre respostas para as perguntas mais frequentes sobre nossos produtos, entregas, pagamentos e muito mais."
      />
      
      <Container className="py-16">
        <SectionTitle>
          Perguntas Frequentes
        </SectionTitle>
        <p className="text-lg text-gray-600 text-center mb-8">Encontre respostas rápidas para as dúvidas mais comuns</p>
        
        <div className="max-w-4xl mx-auto mt-12">
          {/* Filtros por Categoria */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de FAQ */}
          <div className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="text-xs text-yellow-600 font-medium uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {item.question}
                    </h3>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        openItems.includes(index) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Seção de Contato */}
          <div className="mt-12 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ainda tem dúvidas?</h3>
            <p className="text-gray-700 mb-6">
              Nossa equipe está pronta para ajudar você com qualquer questão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/5531997725450" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">💬</span>
                WhatsApp
              </a>
              <a 
                href="mailto:contato@powerhousebrasil.com.br" 
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">✉️</span>
                E-mail
              </a>
            </div>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default FAQPage;