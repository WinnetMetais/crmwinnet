import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Deal = Tables<'deals'>;
export type DealInsert = TablesInsert<'deals'>;
export type DealUpdate = TablesUpdate<'deals'>;

export interface DealWithCustomer extends Deal {
  customers?: {
    name: string;
    company?: string;
    email?: string;
  };
}

export const dealService = {
  // Buscar todos os deals com informações do cliente
  async getDeals() {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          customers (
            name,
            company,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar deals:', error);
      throw error;
    }
  },

  // Buscar deal por ID com informações do cliente
  async getDealById(id: string) {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          customers (
            name,
            company,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar deal:', error);
      throw error;
    }
  },

  // Criar novo deal
  async createDeal(deal: Omit<Deal, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('deals')
        .insert(deal)
        .select(`
          *,
          customers (
            name,
            company,
            email
          )
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar deal:', error);
      throw error;
    }
  },

  // Atualizar deal
  async updateDeal(id: string, deal: Partial<Deal>) {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update(deal)
        .eq('id', id)
        .select(`
          *,
          customers (
            name,
            company,
            email
          )
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar deal:', error);
      throw error;
    }
  },

  // Deletar deal
  async deleteDeal(id: string) {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar deal:', error);
      throw error;
    }
  }
};