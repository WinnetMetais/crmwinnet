import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Quote = Tables<'quotes'>;
export type QuoteInsert = TablesInsert<'quotes'>;
export type QuoteUpdate = TablesUpdate<'quotes'>;
export type QuoteItem = Tables<'quote_items'>;
export type QuoteItemInsert = TablesInsert<'quote_items'>;

export const quoteService = {
  // Buscar todos os orçamentos com itens
  async getQuotes() {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        quote_items (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar orçamento por ID com itens
  async getQuoteById(id: string) {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        quote_items (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Criar novo orçamento
  async createQuote(quote: QuoteInsert) {
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        ...quote,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar orçamento
  async updateQuote(id: string, updates: QuoteUpdate) {
    const { data, error } = await supabase
      .from('quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar orçamento
  async deleteQuote(id: string) {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Adicionar item ao orçamento
  async addQuoteItem(item: QuoteItemInsert) {
    const { data, error } = await supabase
      .from('quote_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar item do orçamento
  async updateQuoteItem(id: string, updates: Partial<QuoteItem>) {
    const { data, error } = await supabase
      .from('quote_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar item do orçamento
  async deleteQuoteItem(id: string) {
    const { error } = await supabase
      .from('quote_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Gerar número de orçamento sequencial
  async generateQuoteNumber() {
    const { data, error } = await supabase
      .from('quotes')
      .select('quote_number')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    const lastQuote = data?.[0];
    const lastNumber = lastQuote?.quote_number ? 
      parseInt(lastQuote.quote_number.replace(/\D/g, '')) : 0;
    
    return `WM${String(lastNumber + 1).padStart(6, '0')}`;
  }
};