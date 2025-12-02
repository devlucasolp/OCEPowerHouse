import nodemailer from 'nodemailer';
import type { CartProduct } from '../../lib/useCart';

export interface OrderDetails {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: 'cpf' | 'cnpj';
  items: CartProduct[];
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isPickup?: boolean;
  selectedShippingOption?: {
    id: string;
    name: string;
    price: number;
    deliveryTime: string;
    company: string;
  } | null;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Envia email de confirmação de pedido para o cliente
   */
  async sendOrderConfirmation(orderDetails: OrderDetails): Promise<void> {
    const { customerEmail, customerName, orderId, items, subtotal, shippingCost, discountAmount, total, paymentStatus, paymentMethod, isPickup, selectedShippingOption } = orderDetails;

    const itemsHtml = items.map(item => {
      // Exibe info da variante quando existir
      const variantInfo = item.selectedVariant 
        ? `<br><small style="color: #666;">Variante: ${item.selectedVariant.name}</small>` 
        : '';
      
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #000; background-color: #fff; color: #000;">
            <strong>${item.title}</strong>${variantInfo}<br>
            Quantidade: ${item.quantity}<br>
            Preço unitário: R$ ${item.price.toFixed(2)}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #000; text-align: right; background-color: #fff; color: #000; font-weight: bold;">
            R$ ${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `;
    }).join('');

    const shippingInfo = isPickup 
      ? '<p style="color: #000;"><strong>🏪 Retirada na loja:</strong> Alameda do Ingá 222/302, Vale do Sereno, Nova Lima - MG</p>'
      : selectedShippingOption 
        ? `<p style="color: #000;"><strong>🚚 Frete:</strong> ${selectedShippingOption.name} (${selectedShippingOption.company}) - R$ ${shippingCost.toFixed(2)}</p>`
        : `<p style="color: #000;"><strong>🚚 Frete:</strong> R$ ${shippingCost.toFixed(2)}</p>`;

    const discountInfo = discountAmount && discountAmount > 0 
      ? `<p style="color: #000;"><strong>💰 Desconto:</strong> -R$ ${discountAmount.toFixed(2)}</p>`
      : '';

    // Status baseado no pagamento, mas com fallback para realizado
    const statusColor = paymentStatus === 'approved' ? '#28a745' : paymentStatus === 'pending' ? '#ffc107' : '#28a745';
    const statusText = paymentStatus === 'approved' ? '✅ Aprovado' : paymentStatus === 'pending' ? '⏳ Pendente' : '✅ Realizado';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmação de Pedido - OCE Powerhouse</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; background-color: #fff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff;">
          <div style="text-align: center; margin-bottom: 30px; background-color: #000; padding: 20px; border-radius: 8px;">
            <h1 style="color: #FFD700; margin: 0; font-size: 28px; font-weight: bold;">OCE POWERHOUSE</h1>
            <h2 style="color: #FFD700; margin: 10px 0 0 0; font-size: 20px;">Confirmação de Pedido</h2>
          </div>
          
          <p>Olá ${customerName || 'Cliente'},</p>
          
          <p>Recebemos seu pedido e estamos processando! Aqui estão os detalhes:</p>
          
          <div style="background: #FFD700; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #000;">
            <h3 style="margin-top: 0; color: #000; font-weight: bold;">📋 Detalhes do Pedido</h3>
            <p style="color: #000;"><strong>Número do Pedido:</strong> ${orderId}</p>
            <p style="color: #000;"><strong>Status do Pedido:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
            <p style="color: #000;"><strong>Método de Pagamento:</strong> ${paymentMethod}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #000; font-weight: bold;">🛒 Itens do Pedido</h3>
            <table style="width: 100%; border-collapse: collapse; border: 2px solid #000;">
              <thead>
                <tr style="background: #FFD700;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #000; color: #000; font-weight: bold;">Produto</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #000; color: #000; font-weight: bold;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>
          
          <div style="background: #FFD700; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #000;">
            <h3 style="margin-top: 0; color: #000; font-weight: bold;">💰 Resumo Financeiro</h3>
            <p style="color: #000;"><strong>Subtotal:</strong> R$ ${subtotal.toFixed(2)}</p>
            ${shippingInfo}
            ${discountInfo}
            <hr style="margin: 15px 0; border-color: #000;">
            <p style="font-size: 18px; font-weight: bold; color: #000;"><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
          </div>
          
          ${paymentStatus === 'approved' ? `
            <div style="background: #28a745; border: 2px solid #000; color: #fff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #fff; font-weight: bold;">🎉 Pagamento Aprovado!</h4>
              <p style="color: #fff;">Seu pedido foi confirmado e será processado em breve. ${isPickup ? 'Você receberá um email quando estiver pronto para retirada.' : 'Você receberá o código de rastreamento assim que o produto for enviado.'}</p>
            </div>
          ` : paymentStatus === 'pending' ? `
            <div style="background: #ffc107; border: 2px solid #000; color: #000; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #000; font-weight: bold;">⏳ Pagamento Pendente</h4>
              <p style="color: #000;">Estamos aguardando a confirmação do seu pagamento. Você receberá uma atualização assim que for processado.</p>
              <p style="color: #000; margin-top: 10px; font-size: 14px;">📱 Quando o Mercado Pago confirmar o pagamento, a OCE cuidará automaticamente de todo o processo de envio e acompanhamento do seu pedido.</p>
            </div>
          ` : `
            <div style="background: #28a745; border: 2px solid #000; color: #fff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #fff; font-weight: bold;">🎉 Pedido Realizado com Sucesso!</h4>
              <p style="color: #fff;">Seu pedido foi confirmado e será processado em breve. ${isPickup ? 'Você receberá um email quando estiver pronto para retirada.' : 'Você receberá o código de rastreamento assim que o produto for enviado.'}</p>
              <p style="color: #fff; margin-top: 10px; font-size: 14px;">📱 Quando o Mercado Pago confirmar o pagamento, a OCE cuidará automaticamente de todo o processo de envio e acompanhamento do seu pedido.</p>
            </div>
          `}
          
          <div style="margin: 30px 0; text-align: center; background: #000; padding: 20px; border-radius: 8px;">
            <p style="color: #FFD700; font-weight: bold; margin: 0 0 10px 0;">Precisa de ajuda?</p>
            <p style="color: #FFD700; margin: 5px 0;">📞 (31) 99772-5450</p>
            <p style="color: #FFD700; margin: 5px 0;">📧 contato@powerhousebrasil.com.br</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #000; color: #000; font-size: 12px;">
            <p style="font-weight: bold; margin: 5px 0;">OCE POWERHOUSE - Especialistas em Performance</p>
            <p style="margin: 5px 0;">Alameda do Ingá 222/302, Vale do Sereno, Nova Lima - MG</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"OCE Powerhouse" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Confirmação de Pedido #${orderId} - OCE Powerhouse`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de confirmação enviado para:', customerEmail);
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email de confirmação');
    }
  }

  /**
   * Envia email de notificação para a equipe
   */
  async sendOrderNotificationToTeam(orderDetails: OrderDetails): Promise<void> {
    const { orderId, customerEmail, items, total, paymentStatus, paymentMethod } = orderDetails;

    const itemsList = items.map(item => 
      `- ${item.title} (Qtd: ${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const htmlContent = `
      <h2>🛒 Novo Pedido Recebido</h2>
      <p><strong>Pedido:</strong> ${orderId}</p>
      <p><strong>Cliente:</strong> ${customerEmail}</p>
      <p><strong>Status:</strong> ${paymentStatus === 'approved' ? 'Aprovado' : paymentStatus === 'pending' ? 'Pendente' : 'Realizado'}</p>
      <p><strong>Método:</strong> ${paymentMethod}</p>
      <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
      
      <h3>Itens:</h3>
      <pre>${itemsList}</pre>
    `;

    const mailOptions = {
      from: `"Sistema OCE" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'contato@powerhousebrasil.com.br',
      subject: `🛒 Novo Pedido #${orderId} - ${paymentStatus === 'approved' ? 'APROVADO' : paymentStatus === 'pending' ? 'PENDENTE' : 'REALIZADO'}`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Notificação enviada para equipe');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação para equipe:', error);
    }
  }

  /**
   * Envia email de notificação de novo pedido para a equipe OCE
   */
  async sendNewOrderNotificationToOCE(orderDetails: OrderDetails): Promise<void> {
    const { 
      orderId, 
      customerEmail, 
      customerName,
      customerPhone,
      customerDocument,
      customerDocumentType,
      items, 
      subtotal, 
      shippingCost, 
      discountAmount, 
      total, 
      paymentStatus,
      shippingAddress, 
      isPickup,
      selectedShippingOption
    } = orderDetails;
  
    // Valor de desconto seguro (evita undefined)
    const safeDiscountAmount = typeof discountAmount === 'number' ? discountAmount : 0;
  
    // Formatação detalhada dos itens
    const itemsHtml = items.map(item => {
      const itemTotal = item.price * item.quantity;
  
      // Exibe info da variante e o modificador de preço quando existir
      const variantAddition = typeof item.selectedVariant?.priceModifier === 'number' 
        ? `(+R$ ${item.selectedVariant.priceModifier.toFixed(2)})` 
        : '';
      const variantInfo = item.selectedVariant 
        ? `<br><small style="color: #666;">Variante: ${item.selectedVariant.name} ${variantAddition}</small>` 
        : '';
      
      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px; vertical-align: top;">
            <strong style="color: #333;">${item.title}</strong>${variantInfo}
            <br><small style="color: #666;">Quantidade: ${item.quantity}</small>
            <br><small style="color: #666;">Preço unitário: R$ ${item.price.toFixed(2)}</small>
          </td>
          <td style="padding: 12px; text-align: right; vertical-align: top; font-weight: bold;">
            R$ ${itemTotal.toFixed(2)}
          </td>
        </tr>
      `;
    }).join('');
  
    // Informações de entrega
    const deliveryInfo = isPickup ? `
      <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="margin: 0 0 10px 0; color: #2d5a2d;">🏪 RETIRADA NA LOJA</h4>
        <p style="margin: 0; color: #2d5a2d;">Cliente irá retirar na loja física</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
          <strong>Endereço da loja:</strong> Alameda do Ingá 222/302, Vale do Sereno, Nova Lima - MG
        </p>
      </div>
    ` : `
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="margin: 0 0 10px 0; color: #856404;">🚚 ENTREGA NO ENDEREÇO</h4>
        <p style="margin: 0; color: #856404;">
          <strong>Endereço:</strong> ${shippingAddress?.street}<br>
          <strong>Bairro:</strong> ${shippingAddress?.neighborhood}<br>
          <strong>Cidade:</strong> ${shippingAddress?.city} - ${shippingAddress?.state}<br>
          <strong>CEP:</strong> ${shippingAddress?.zipCode}
        </p>
        <p style="margin: 10px 0 0 0; font-weight: bold; color: #856404;">
          Frete: ${selectedShippingOption ? `${selectedShippingOption.name} (${selectedShippingOption.company}) - ` : ''}R$ ${shippingCost.toFixed(2)}
        </p>
      </div>
    `;
  
    // Informações de desconto
    const discountInfo = discountAmount && discountAmount > 0 ? `
      <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="margin: 0 0 5px 0; color: #0c5460;">💰 DESCONTO APLICADO</h4>
        <p style="margin: 0; color: #0c5460; font-weight: bold;">-R$ ${discountAmount.toFixed(2)}</p>
      </div>
    ` : '';
  
    // Seção de dados do cliente
    const customerInfo = `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h3 style="margin: 0 0 10px 0; color: #495057;">Dados do Cliente</h3>
        <p style="margin: 5px 0;"><strong>Nome:</strong> ${customerName || 'Não informado'}</p>
        <p style="margin: 5px 0;"><strong>E-mail:</strong> <a href="mailto:${customerEmail}" style="color: #007bff;">${customerEmail}</a></p>
        <p style="margin: 5px 0;"><strong>Telefone:</strong> ${customerPhone || 'Não informado'}</p>
        <p style="margin: 5px 0;"><strong>${customerDocumentType?.toUpperCase() || 'Documento'}:</strong> ${customerDocument || 'Não informado'}</p>
        <p style="margin: 5px 0;"><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    `;
  
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Novo Pedido OCE PowerHouse</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">Novo Pedido Recebido</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">OCE PowerHouse</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 15px 0; color: #495057;">Informações do Pedido</h2>
          <p style="margin: 5px 0;"><strong>Número do Pedido:</strong> <span style="color: #007bff;">${orderId}</span></p>
          <p style="margin: 5px 0;"><strong>Cliente:</strong> ${customerName}</p>
          <p style="margin: 5px 0;"><strong>E-mail:</strong> <a href="mailto:${customerEmail}" style="color: #007bff;">${customerEmail}</a></p>
          <p style="margin: 5px 0;"><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        </div>

        ${customerInfo}
        ${deliveryInfo}
        ${discountInfo}

        <div style="background: white; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; margin: 20px 0;">
          <div style="background: #495057; color: white; padding: 15px;">
            <h3 style="margin: 0;">Itens do Pedido</h3>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>
        </div>

        <div style="background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0 0 10px 0;">RESUMO FINANCEIRO</h3>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Subtotal:</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
          </div>
          ${!isPickup ? `
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span>Frete:</span>
              <span>${selectedShippingOption ? `${selectedShippingOption.name} (${selectedShippingOption.company}) - ` : ''}R$ ${shippingCost.toFixed(2)}</span>
            </div>
          ` : ''}
          ${safeDiscountAmount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #ffeb3b;">
              <span>Desconto:</span>
              <span>-R$ ${safeDiscountAmount.toFixed(2)}</span>
            </div>
          ` : ''}
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">
          <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold;">
            <span>TOTAL:</span>
            <span>R$ ${total.toFixed(2)}</span>
          </div>
        </div>

        ${paymentStatus === 'approved' ? `
          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #155724;">✅ PAGAMENTO APROVADO</h4>
            <p style="margin: 0; color: #155724;">
              Este pedido foi <strong>aprovado e pago</strong>. Pode ser processado imediatamente para envio.
            </p>
          </div>
        ` : paymentStatus === 'pending' ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">⏳ PAGAMENTO PENDENTE</h4>
            <p style="margin: 0; color: #856404;">
              Este pedido está <strong>aguardando confirmação de pagamento</strong>. Quando o Mercado Pago confirmar, 
              o sistema notificará automaticamente e o pedido poderá ser processado para envio.
            </p>
          </div>
        ` : `
          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #155724;">✅ PEDIDO REALIZADO</h4>
            <p style="margin: 0; color: #155724;">
              Este pedido foi <strong>realizado com sucesso</strong> na loja online. Quando o Mercado Pago confirmar o pagamento, 
              o sistema notificará automaticamente e o pedido poderá ser processado para envio.
            </p>
          </div>
        `}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #6c757d; font-size: 14px;">
            Este e-mail foi enviado automaticamente pelo sistema OCE PowerHouse<br>
            <a href="mailto:contato@powerhousebrasil.com.br" style="color: #007bff;">contato@powerhousebrasil.com.br</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"🛒 OCE PowerHouse - Novo Pedido" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'contato@powerhousebrasil.com.br',
      subject: `🛒 NOVO PEDIDO #${orderId} - R$ ${total.toFixed(2)} - ${customerName}`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ E-mail de novo pedido enviado para OCE');
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail para OCE:', error);
      throw error;
    }
  }
}