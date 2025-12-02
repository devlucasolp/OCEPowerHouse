import { NextPage } from 'next';
import PageLayout from '../components/PageLayout';
import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import Seo from '../components/Seo';

const AjudaPage: NextPage = () => {
  return (
    <PageLayout>
      <Seo 
        title="Central de Ajuda - Power House Brasil"
        description="Encontre respostas para suas dúvidas sobre nossos produtos e serviços. Estamos aqui para ajudar você."
      />
      
      <Container className="py-16">
        <SectionTitle>
          Central de Ajuda
        </SectionTitle>
        <p className="text-lg text-gray-600 text-center mb-8">Estamos aqui para ajudar você com todas as suas dúvidas</p>
        
        <div className="max-w-4xl mx-auto mt-12 space-y-12">
          {/* Seção de Contato */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Entre em Contato</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Atendimento ao Cliente</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-3">📞</span>
                    <a href="tel:+5531997725450" className="text-gray-700 hover:text-yellow-600 transition-colors">
                      (31) 99772-5450
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-3">✉️</span>
                    <a href="mailto:contato@powerhousebrasil.com.br" className="text-gray-700 hover:text-yellow-600 transition-colors">
                      contato@powerhousebrasil.com.br
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Horário de Atendimento</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábado: 8h às 12h</p>
                  <p>Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seções de Ajuda */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pedidos */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📦 Pedidos e Entregas</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Como acompanhar meu pedido?</li>
                <li>• Prazo de entrega</li>
                <li>• Política de trocas e devoluções</li>
                <li>• Problemas com a entrega</li>
              </ul>
            </div>

            {/* Produtos */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚴 Produtos</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Guia de tamanhos</li>
                <li>• Especificações técnicas</li>
                <li>• Cuidados e manutenção</li>
                <li>• Garantia dos produtos</li>
              </ul>
            </div>

            {/* Pagamento */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💳 Pagamento</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Formas de pagamento aceitas</li>
                <li>• Problemas com pagamento</li>
                <li>• Parcelamento</li>
                <li>• Reembolsos</li>
              </ul>
            </div>

            {/* Conta */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">👤 Minha Conta</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Como criar uma conta</li>
                <li>• Alterar dados pessoais</li>
                <li>• Esqueci minha senha</li>
                <li>• Histórico de pedidos</li>
              </ul>
            </div>
          </div>

          {/* Seção de Suporte Adicional */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Não encontrou o que procurava?</h3>
            <p className="text-gray-700 mb-6">
              Nossa equipe está sempre pronta para ajudar você com qualquer dúvida ou problema.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:contato@powerhousebrasil.com.br" 
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Enviar E-mail
              </a>
              <a 
                href="tel:+5531997725450" 
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default AjudaPage;