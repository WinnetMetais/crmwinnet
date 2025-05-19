
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Deal {
  id: string;
  customer_id: string;
  title: string;
  value?: number;
  status?: string;
  close_date?: string;
  description?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getDeals() {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        customers (
          id,
          name,
          company
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar negócios",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function getDealById(id: string) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        customers (
          id,
          name,
          company
        )
      `)
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao buscar negócio",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function createDeal(deal: Omit<Deal, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert(deal)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Negócio criado",
      description: "O negócio foi criado com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao criar negócio",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function updateDeal(id: string, deal: Partial<Deal>) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .update(deal)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Negócio atualizado",
      description: "O negócio foi atualizado com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar negócio",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteDeal(id: string) {
  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Negócio removido",
      description: "O negócio foi removido com sucesso.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Erro ao remover negócio",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}
