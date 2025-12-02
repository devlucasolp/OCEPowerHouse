import { NextPage } from 'next';
import PageLayout from '../components/PageLayout';
import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import Seo from '../components/Seo';

const TermosUsoPage: NextPage = () => {
  return (
    <PageLayout>
      <Seo 
        title="Termos de Uso - Power House Brasil"
        description="Conheça os termos e condições de uso da Power House Brasil. Leia nossos termos antes de utilizar nossos serviços."
      />
      
      <Container className="py-16">
        <SectionTitle>
          Termos de Uso
        </SectionTitle>
        <p className="text-lg text-gray-600 text-center mb-8">Condições gerais de uso dos nossos serviços</p>
        
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            
            {/* Introdução */}
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bem-vindo à Power House Brasil! Estes Termos de Uso ("Termos") regem o uso do nosso 
                site e serviços. Ao acessar ou usar nosso site, você concorda em cumprir estes termos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
              </p>
            </div>

            {/* 1. Definições */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Definições</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>"Empresa", "nós", "nosso":</strong> Power House Brasil</li>
                <li><strong>"Usuário", "você":</strong> Pessoa que acessa ou usa nossos serviços</li>
                <li><strong>"Site":</strong> powerhousebrasil.com.br</li>
                <li><strong>"Serviços":</strong> Todos os produtos e serviços oferecidos pela Power House Brasil</li>
                <li><strong>"Conteúdo":</strong> Textos, imagens, vídeos e outros materiais disponíveis no site</li>
              </ul>
            </div>

            {/* 2. Aceitação dos Termos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Aceitação dos Termos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ao usar nosso site, você declara que:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Tem pelo menos 18 anos de idade ou possui autorização dos pais/responsáveis</li>
                <li>Possui capacidade legal para celebrar contratos</li>
                <li>Concorda em cumprir todos os termos e condições</li>
                <li>Fornecerá informações verdadeiras e atualizadas</li>
              </ul>
            </div>

            {/* 3. Uso do Site */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uso do Site</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Uso Permitido</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Você pode usar nosso site para navegar, pesquisar e comprar produtos, 
                    desde que seja para uso pessoal e não comercial.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Uso Proibido</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">É proibido:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Usar o site para atividades ilegais</li>
                    <li>Tentar hackear ou comprometer a segurança</li>
                    <li>Reproduzir ou distribuir conteúdo sem autorização</li>
                    <li>Criar contas falsas ou fornecer informações incorretas</li>
                    <li>Interferir no funcionamento normal do site</li>
                    <li>Usar bots ou scripts automatizados</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Produtos e Preços */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Produtos e Preços</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Todos os preços estão em Reais (BRL) e incluem impostos aplicáveis</li>
                <li>Preços podem ser alterados sem aviso prévio</li>
                <li>Ofertas promocionais têm validade limitada</li>
                <li>Reservamo-nos o direito de limitar quantidades</li>
                <li>Disponibilidade de produtos sujeita ao estoque</li>
                <li>Imagens são meramente ilustrativas</li>
              </ul>
            </div>

            {/* 5. Pedidos e Pagamentos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pedidos e Pagamentos</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Processamento de Pedidos</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Pedidos estão sujeitos à confirmação de pagamento</li>
                    <li>Reservamo-nos o direito de cancelar pedidos suspeitos</li>
                    <li>Confirmação será enviada por e-mail</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Formas de Pagamento</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Cartões de crédito e débito</li>
                    <li>PIX</li>
                    <li>Boleto bancário</li>
                    <li>Outras formas conforme disponibilidade</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 6. Entrega */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Entrega</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Prazos de entrega são estimativas e podem variar</li>
                <li>Entregas são realizadas em dias úteis</li>
                <li>É necessário haver alguém no endereço para receber</li>
                <li>Frete é calculado conforme localização e peso</li>
                <li>Não nos responsabilizamos por atrasos dos Correios/transportadoras</li>
              </ul>
            </div>

            {/* 7. Trocas e Devoluções */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Trocas e Devoluções</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">7.1 Direito de Arrependimento</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Conforme o Código de Defesa do Consumidor, você tem até 7 dias corridos 
                    após o recebimento para desistir da compra, sem necessidade de justificativa.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">7.2 Condições para Troca/Devolução</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Produto em perfeitas condições</li>
                    <li>Embalagem original</li>
                    <li>Etiquetas preservadas</li>
                    <li>Nota fiscal</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 8. Propriedade Intelectual */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propriedade Intelectual</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todo o conteúdo do site (textos, imagens, logos, design) é protegido por 
                direitos autorais e propriedade intelectual da Power House Brasil ou de terceiros licenciados.
              </p>
              <p className="text-gray-700 leading-relaxed">
                É proibida a reprodução, distribuição ou uso comercial sem autorização expressa.
              </p>
            </div>

            {/* 9. Privacidade */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacidade</h2>
              <p className="text-gray-700 leading-relaxed">
                O tratamento de seus dados pessoais é regido por nossa 
                <a href="/politica-privacidade" className="text-yellow-600 hover:text-yellow-700 ml-1">
                  Política de Privacidade
                </a>, 
                que faz parte integrante destes Termos.
              </p>
            </div>

            {/* 10. Limitação de Responsabilidade */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A Power House Brasil não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Danos indiretos ou consequenciais</li>
                <li>Perda de dados ou lucros</li>
                <li>Interrupções no serviço por motivos técnicos</li>
                <li>Ações de terceiros (transportadoras, operadoras de pagamento)</li>
                <li>Uso inadequado dos produtos</li>
              </ul>
            </div>

            {/* 11. Modificações */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modificações dos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação no site. 
                O uso continuado dos serviços constitui aceitação dos novos termos.
              </p>
            </div>

            {/* 12. Lei Aplicável */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Lei Aplicável e Foro</h2>
              <p className="text-gray-700 leading-relaxed">
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será 
                resolvida no foro da comarca de Nova Lima/MG, com renúncia a qualquer outro, 
                por mais privilegiado que seja.
              </p>
            </div>

            {/* 13. Contato */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contato</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para dúvidas sobre estes Termos de Uso:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>E-mail:</strong> contato@powerhousebrasil.com.br</p>
                <p className="text-gray-700"><strong>Telefone:</strong> (31) 99772-5450</p>
                <p className="text-gray-700">
                  <strong>Endereço:</strong> Alameda do Ingá 222/302, Vale do Sereno, Nova Lima – MG – CEP: 34006-069
                </p>
              </div>
            </div>

            {/* Data de Atualização */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default TermosUsoPage;