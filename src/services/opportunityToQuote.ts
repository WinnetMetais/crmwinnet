import { supabase } from "@/integrations/supabase/client";
import { quoteService, QuoteInsert, QuoteItemInsert } from "@/services/quotes";
import { toast } from "@/hooks/use-toast";

interface OpportunityWithItems {
  id: string;
  title: string;
  customer_id: string;
  value?: number;
  description?: string;
  customers?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    cnpj?: string;
    contact_person?: string;
  };
  opportunity_items?: Array<{
    id: string;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total: number;
    product_id?: string;
    products?: {
      sku?: string;
      name?: string;
    };
  }>;
}

export async function getOpportunityForQuote(opportunityId: string): Promise<OpportunityWithItems | null> {
  const { data, error } = await supabase
    .from('opportunities')
    .select(`
      id,
      title,
      customer_id,
      value,
      description,
      customers (
        id,
        name,
        email,
        phone,
        address,
        city,
        state,
        cnpj,
        contact_person
      ),
      opportunity_items (
        id,
        description,
        quantity,
        unit,
        unit_price,
        total,
        product_id,
        products (
          sku,
          name
        )
      )
    `)
    .eq('id', opportunityId)
    .single();

  if (error) {
    console.error('Erro ao buscar oportunidade:', error);
    return null;
  }

  return data as unknown as OpportunityWithItems;
}

export async function convertOpportunityToQuote(opportunityId: string): Promise<string | null> {
  try {
    const opportunity = await getOpportunityForQuote(opportunityId);
    if (!opportunity) {
      throw new Error('Oportunidade não encontrada');
    }

    const quoteNumber = await quoteService.generateQuoteNumber();
    const customer = opportunity.customers;

    const quoteData: QuoteInsert = {
      quote_number: quoteNumber,
      title: opportunity.title,
      customer_id: opportunity.customer_id,
      customer_name: customer?.name || '',
      customer_email: customer?.email || null,
      customer_phone: customer?.phone || null,
      customer_address: customer?.address 
        ? `${customer.address}${customer.city ? `, ${customer.city}` : ''}${customer.state ? ` - ${customer.state}` : ''}`
        : null,
      customer_cnpj: customer?.cnpj || null,
      contact_person: customer?.contact_person || null,
      description: opportunity.description || null,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'rascunho',
      subtotal: 0,
      discount: 0,
      total: 0,
    };

    const quote = await quoteService.createQuote(quoteData);

    // Converter itens da oportunidade para itens do orçamento
    let subtotal = 0;
    if (opportunity.opportunity_items && opportunity.opportunity_items.length > 0) {
      for (const item of opportunity.opportunity_items) {
        const quoteItem: QuoteItemInsert = {
          quote_id: quote.id,
          product_code: item.products?.sku || '',
          description: item.description || item.products?.name || '',
          quantity: item.quantity,
          unit: item.unit || 'un',
          unit_price: item.unit_price,
          total: item.total,
        };
        await quoteService.addQuoteItem(quoteItem);
        subtotal += item.total;
      }

      // Atualizar totais do orçamento
      await quoteService.updateQuote(quote.id, {
        subtotal,
        total: subtotal,
      });
    }

    toast({
      title: "Orçamento criado",
      description: `Orçamento ${quoteNumber} criado a partir da oportunidade "${opportunity.title}"`,
    });

    return quote.id;
  } catch (error: any) {
    console.error('Erro ao converter oportunidade:', error);
    toast({
      title: "Erro",
      description: error.message || "Falha ao converter oportunidade em orçamento",
      variant: "destructive",
    });
    return null;
  }
}
