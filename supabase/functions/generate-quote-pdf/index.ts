import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteItem {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCnpj?: string;
  contactPerson?: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentTerms?: string;
  deliveryTerms?: string;
  warranty?: string;
  notes?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

function generateHTML(quote: QuoteData): string {
  const itemsHTML = quote.items.map((item, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.code || '-'}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.description}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.unit}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orçamento ${quote.quoteNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0B9AD8; padding-bottom: 20px; }
    .header h1 { color: #003D7A; margin: 0; font-size: 28px; }
    .header p { margin: 5px 0; color: #666; font-size: 12px; }
    .quote-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .quote-box { background: #f5f5f5; padding: 15px; border-radius: 5px; width: 48%; }
    .quote-box h3 { margin: 0 0 10px 0; color: #003D7A; font-size: 14px; border-bottom: 2px solid #0B9AD8; padding-bottom: 5px; }
    .quote-box p { margin: 5px 0; font-size: 12px; }
    .quote-box strong { color: #333; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #003D7A; color: white; padding: 10px 8px; text-align: left; font-size: 11px; }
    td { font-size: 11px; }
    .totals { width: 300px; margin-left: auto; background: #f9f9f9; padding: 15px; border-radius: 5px; }
    .totals .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
    .totals .total { font-size: 16px; font-weight: bold; color: #003D7A; border-top: 2px solid #0B9AD8; padding-top: 10px; margin-top: 10px; }
    .conditions { margin-top: 30px; background: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 11px; }
    .conditions h3 { color: #003D7A; margin: 0 0 10px 0; font-size: 14px; }
    .conditions p { margin: 5px 0; }
    .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>WINNET METAIS</h1>
    <p>Av. Wallace Simonsen, 437 - Nova Petrópolis - São Bernardo do Campo - SP</p>
    <p>CNPJ: 57.656.387/0001-26 | Telefone: (11) 4428-9099 | www.winnetmetais.com.br</p>
  </div>

  <h2 style="color: #003D7A; border-bottom: 2px solid #FF6B3D; padding-bottom: 10px;">
    PROPOSTA COMERCIAL Nº ${quote.quoteNumber}
  </h2>

  <div class="quote-info">
    <div class="quote-box">
      <h3>DADOS DO CLIENTE</h3>
      <p><strong>Razão Social:</strong> ${quote.customerName}</p>
      ${quote.customerCnpj ? `<p><strong>CNPJ/CPF:</strong> ${quote.customerCnpj}</p>` : ''}
      ${quote.contactPerson ? `<p><strong>Contato:</strong> ${quote.contactPerson}</p>` : ''}
      ${quote.customerPhone ? `<p><strong>Telefone:</strong> ${quote.customerPhone}</p>` : ''}
      ${quote.customerEmail ? `<p><strong>E-mail:</strong> ${quote.customerEmail}</p>` : ''}
      ${quote.customerAddress ? `<p><strong>Endereço:</strong> ${quote.customerAddress}</p>` : ''}
    </div>
    <div class="quote-box">
      <h3>DADOS DO ORÇAMENTO</h3>
      <p><strong>Data:</strong> ${formatDate(quote.date)}</p>
      <p><strong>Validade:</strong> ${formatDate(quote.validUntil)}</p>
      <p><strong>Vendedor:</strong> Winnet Metais</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px;">Item</th>
        <th style="width: 80px;">Código</th>
        <th>Descrição do Produto</th>
        <th style="width: 60px;">Qtd</th>
        <th style="width: 50px;">Un.</th>
        <th style="width: 100px;">Preço Unit.</th>
        <th style="width: 100px;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Subtotal:</span><span>${formatCurrency(quote.subtotal)}</span></div>
    ${quote.discount > 0 ? `<div class="row"><span>Desconto (${quote.discount}%):</span><span>-${formatCurrency(quote.subtotal * quote.discount / 100)}</span></div>` : ''}
    <div class="row total"><span>TOTAL:</span><span>${formatCurrency(quote.total)}</span></div>
  </div>

  <div class="conditions">
    <h3>CONDIÇÕES COMERCIAIS</h3>
    ${quote.paymentTerms ? `<p><strong>Forma de Pagamento:</strong> ${quote.paymentTerms}</p>` : ''}
    ${quote.deliveryTerms ? `<p><strong>Prazo de Entrega:</strong> ${quote.deliveryTerms}</p>` : ''}
    ${quote.warranty ? `<p><strong>Garantia:</strong> ${quote.warranty}</p>` : ''}
    ${quote.notes ? `<p><strong>Observações:</strong> ${quote.notes}</p>` : ''}
  </div>

  <div class="footer">
    <p>Este orçamento é válido até ${formatDate(quote.validUntil)}.</p>
    <p>Winnet Metais - Qualidade e Confiança em Metais | www.winnetmetais.com.br</p>
  </div>
</body>
</html>
  `;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const quote: QuoteData = await req.json();

    if (!quote.quoteNumber || !quote.customerName) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Dados do orçamento incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const html = generateHTML(quote);

    console.log(`[generate-quote-pdf] Gerado HTML para orçamento ${quote.quoteNumber}`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        html,
        filename: `Orcamento_${quote.quoteNumber}.html`
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('[generate-quote-pdf] Erro:', error);
    return new Response(
      JSON.stringify({ ok: false, error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
