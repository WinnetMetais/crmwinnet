import { supabase } from "@/integrations/supabase/client";
import { QuoteFormData } from "@/types/quote";

export async function generateQuotePDF(quote: QuoteFormData): Promise<{ html: string; filename: string }> {
  const payload = {
    quoteNumber: quote.quoteNumber,
    date: quote.date,
    validUntil: quote.validUntil,
    customerName: quote.customerName,
    customerEmail: quote.customerEmail,
    customerPhone: quote.customerPhone,
    customerAddress: quote.customerAddress,
    customerCnpj: quote.customerCnpj,
    contactPerson: quote.contactPerson,
    items: quote.items.map(item => ({
      code: item.code,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    subtotal: quote.subtotal,
    discount: quote.discount,
    total: quote.total,
    paymentTerms: quote.paymentTerms,
    deliveryTerms: quote.deliveryTerms,
    warranty: quote.warranty,
    notes: quote.notes,
  };

  const { data, error } = await supabase.functions.invoke('generate-quote-pdf', {
    body: payload,
  });

  if (error) throw error;
  if (!data.ok) throw new Error(data.error || 'Erro ao gerar PDF');

  return { html: data.html, filename: data.filename };
}

export function downloadQuoteAsHTML(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printQuote(html: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
