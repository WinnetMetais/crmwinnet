import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  to: string;
  customerName: string;
  quoteNumber: string;
  quoteValue: number;
  subject?: string;
  customMessage?: string;
  template?: 'quote_send' | 'quote_follow_up' | 'quote_reminder';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      to, 
      customerName, 
      quoteNumber, 
      quoteValue, 
      subject, 
      customMessage, 
      template = 'quote_send' 
    }: QuoteEmailRequest = await req.json();

    // Validate required fields
    if (!to || !customerName || !quoteNumber) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, customerName, quoteNumber" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email templates
    const templates = {
      quote_send: {
        subject: `Cotação #${quoteNumber} - Winnet Metais`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Winnet Metais</h1>
              <p style="color: #e0e7ff; margin: 5px 0 0 0;">Excelência em produtos siderúrgicos</p>
            </div>
            
            <div style="padding: 30px; background: #ffffff;">
              <h2 style="color: #1e40af; margin-bottom: 20px;">Cotação #${quoteNumber}</h2>
              
              <p>Prezado(a) <strong>${customerName}</strong>,</p>
              
              <p>Esperamos que esteja bem!</p>
              
              <p>Conforme solicitado, segue nossa cotação #${quoteNumber} com os produtos e valores para sua análise.</p>
              
              <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px;"><strong>Valor Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quoteValue)}</strong></p>
              </div>
              
              <h3 style="color: #1e40af;">Diferenciais da Winnet Metais:</h3>
              <ul style="line-height: 1.6;">
                <li>✓ Qualidade certificada em todos os produtos</li>
                <li>✓ Entrega rápida e confiável</li>
                <li>✓ Melhor custo-benefício do mercado</li>
                <li>✓ Suporte técnico especializado</li>
              </ul>
              
              <p>Estamos à disposição para esclarecer qualquer dúvida e negociar as melhores condições para sua empresa.</p>
              
              <p>Aguardamos seu retorno!</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0;"><strong>Atenciosamente,</strong></p>
                <p style="margin: 0;">Equipe Comercial Winnet Metais</p>
                <p style="margin: 0; color: #6b7280;">www.winnetmetais.com.br</p>
              </div>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">Este é um email automático. Para dúvidas, responda este email ou entre em contato conosco.</p>
            </div>
          </div>
        `
      },
      quote_follow_up: {
        subject: `Follow-up - Cotação #${quoteNumber} - Winnet Metais`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Winnet Metais</h1>
              <p style="color: #e0e7ff; margin: 5px 0 0 0;">Excelência em produtos siderúrgicos</p>
            </div>
            
            <div style="padding: 30px; background: #ffffff;">
              <h2 style="color: #1e40af; margin-bottom: 20px;">Follow-up - Cotação #${quoteNumber}</h2>
              
              <p>Prezado(a) <strong>${customerName}</strong>,</p>
              
              <p>Espero que esteja bem!</p>
              
              <p>Gostaria de verificar se teve a oportunidade de analisar nossa cotação #${quoteNumber} enviada anteriormente.</p>
              
              <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px;"><strong>Valor da Cotação: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quoteValue)}</strong></p>
              </div>
              
              <p>Caso tenha alguma dúvida ou precise de ajustes, estarei à disposição para encontrarmos a melhor solução para sua necessidade.</p>
              
              <p>Também gostaria de lembrá-lo de nossas condições especiais e da qualidade diferenciada dos nossos produtos.</p>
              
              <p>Aguardo seu retorno!</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0;"><strong>Atenciosamente,</strong></p>
                <p style="margin: 0;">Equipe Comercial Winnet Metais</p>
                <p style="margin: 0; color: #6b7280;">www.winnetmetais.com.br</p>
              </div>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">Este é um email automático. Para dúvidas, responda este email ou entre em contato conosco.</p>
            </div>
          </div>
        `
      },
      quote_reminder: {
        subject: `Lembrete - Cotação #${quoteNumber} - Winnet Metais`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Winnet Metais</h1>
              <p style="color: #fecaca; margin: 5px 0 0 0;">Última oportunidade!</p>
            </div>
            
            <div style="padding: 30px; background: #ffffff;">
              <h2 style="color: #dc2626; margin-bottom: 20px;">⏰ Lembrete - Cotação #${quoteNumber}</h2>
              
              <p>Prezado(a) <strong>${customerName}</strong>,</p>
              
              <p>Este é um lembrete sobre nossa cotação #${quoteNumber} que tem validade até breve.</p>
              
              <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; color: #dc2626;"><strong>Valor Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quoteValue)}</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #7f1d1d;">⚠️ Oferta por tempo limitado</p>
              </div>
              
              <p>Para não perder esta oportunidade e garantir os preços atuais, recomendamos que confirme seu pedido o quanto antes.</p>
              
              <p>Nossa equipe está pronta para processar seu pedido imediatamente após a confirmação.</p>
              
              <p>Caso precise de algum esclarecimento adicional, entre em contato conosco.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0;"><strong>Atenciosamente,</strong></p>
                <p style="margin: 0;">Equipe Comercial Winnet Metais</p>
                <p style="margin: 0; color: #6b7280;">www.winnetmetais.com.br</p>
              </div>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">Este é um email automático. Para dúvidas, responda este email ou entre em contato conosco.</p>
            </div>
          </div>
        `
      }
    };

    const selectedTemplate = templates[template];
    const emailSubject = subject || selectedTemplate.subject;
    const emailContent = customMessage || selectedTemplate.html;

    const emailResponse = await resend.emails.send({
      from: "Winnet Metais <comercial@winnetmetais.com.br>",
      to: [to],
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Quote email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.data?.id,
      ...emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send quote email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);