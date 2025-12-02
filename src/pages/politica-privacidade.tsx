import { NextPage } from 'next';
import PageLayout from '../components/PageLayout';
import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import Seo from '../components/Seo';

const PoliticaPrivacidadePage: NextPage = () => {
  return (
    <PageLayout>
      <Seo 
        title="Política de Privacidade - Power House Brasil"
        description="Conheça nossa política de privacidade e como protegemos seus dados pessoais na Power House Brasil."
      />
      
      <Container className="py-16">
        <SectionTitle>
          Política de Privacidade
        </SectionTitle>
        <p className="text-lg text-gray-600 text-center mb-8">Transparência e segurança no tratamento dos seus dados</p>
        
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            
            {/* Introdução */}
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                A Power House Brasil, pessoa jurídica de direito privado, com sede na Alameda do Ingá 222/302, 
                Vale do Sereno, Nova Lima – MG – CEP: 34006-069, inscrita no CNPJ sob o nº [CNPJ], 
                doravante denominada "Power House Brasil", está comprometida com a proteção da privacidade 
                e dos dados pessoais de seus usuários.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos 
                suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD) 
                - Lei nº 13.709/2018.
              </p>
            </div>

            {/* 1. Informações que Coletamos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Dados Pessoais Fornecidos</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Nome completo</li>
                    <li>E-mail</li>
                    <li>Telefone</li>
                    <li>CPF</li>
                    <li>Endereço completo</li>
                    <li>Data de nascimento</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Dados de Navegação</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador</li>
                    <li>Páginas visitadas</li>
                    <li>Tempo de permanência no site</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. Como Utilizamos suas Informações */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Utilizamos suas Informações</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Processar e gerenciar seus pedidos</li>
                <li>Comunicar sobre o status dos pedidos</li>
                <li>Fornecer suporte ao cliente</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Enviar comunicações promocionais (com seu consentimento)</li>
                <li>Cumprir obrigações legais e regulamentares</li>
                <li>Prevenir fraudes e garantir a segurança</li>
              </ul>
            </div>

            {/* 3. Base Legal */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Base Legal para o Tratamento</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                O tratamento de seus dados pessoais é realizado com base nas seguintes hipóteses legais:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Execução de contrato:</strong> Para processar pedidos e fornecer produtos/serviços</li>
                <li><strong>Consentimento:</strong> Para comunicações promocionais e cookies não essenciais</li>
                <li><strong>Legítimo interesse:</strong> Para melhorias do site e prevenção de fraudes</li>
                <li><strong>Cumprimento de obrigação legal:</strong> Para atender exigências fiscais e regulamentares</li>
              </ul>
            </div>

            {/* 4. Compartilhamento de Dados */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartilhamento de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Empresas de logística e entrega</li>
                <li>Processadores de pagamento</li>
                <li>Prestadores de serviços de TI</li>
                <li>Autoridades competentes, quando exigido por lei</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>Importante:</strong> Nunca vendemos seus dados pessoais para terceiros.
              </p>
            </div>

            {/* 5. Segurança dos Dados */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Segurança dos Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Criptografia de dados sensíveis</li>
                <li>Controle de acesso restrito</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares</li>
                <li>Treinamento da equipe sobre proteção de dados</li>
              </ul>
            </div>

            {/* 6. Retenção de Dados */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Retenção de Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades 
                descritas nesta política, respeitando os prazos legais aplicáveis. Dados de transações 
                comerciais são mantidos por até 5 anos, conforme exigido pela legislação brasileira.
              </p>
            </div>

            {/* 7. Seus Direitos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Seus Direitos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Você tem os seguintes direitos em relação aos seus dados pessoais:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Acesso:</strong> Saber quais dados temos sobre você</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos</li>
                <li><strong>Exclusão:</strong> Solicitar a eliminação de dados desnecessários</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento em certas situações</li>
                <li><strong>Revogação do consentimento:</strong> Retirar consentimento a qualquer momento</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Para exercer seus direitos, entre em contato conosco através do e-mail: 
                <a href="mailto:privacidade@powerhousebrasil.com.br" className="text-yellow-600 hover:text-yellow-700">
                  privacidade@powerhousebrasil.com.br
                </a>
              </p>
            </div>

            {/* 8. Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies para melhorar sua experiência de navegação. Os cookies são pequenos 
                arquivos armazenados em seu dispositivo que nos ajudam a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Lembrar suas preferências</li>
                <li>Analisar o tráfego do site</li>
                <li>Personalizar conteúdo</li>
                <li>Facilitar o processo de compra</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </div>

            {/* 9. Alterações na Política */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Alterações nesta Política</h2>
              <p className="text-gray-700 leading-relaxed">
                Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre 
                mudanças significativas através do nosso site ou por e-mail. A versão mais atual 
                estará sempre disponível em nosso site.
              </p>
            </div>

            {/* 10. Contato */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>E-mail:</strong> privacidade@powerhousebrasil.com.br</p>
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

export default PoliticaPrivacidadePage;