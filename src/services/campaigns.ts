
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  status?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  target_audience?: string;
  description?: string;
  results?: any;
  created_at?: string;
  updated_at?: string;
}

export async function getCampaigns() {
  try {
    // @ts-ignore
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar campanhas",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function getCampaignById(id: string) {
  try {
    // @ts-ignore
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao buscar campanha",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function createCampaign(campaign: Omit<Campaign, 'id'>) {
  try {
    // @ts-ignore
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Campanha criada",
      description: "A campanha foi criada com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao criar campanha",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function updateCampaign(id: string, campaign: Partial<Campaign>) {
  try {
    // @ts-ignore
    const { data, error } = await supabase
      .from('campaigns')
      .update(campaign)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Campanha atualizada",
      description: "A campanha foi atualizada com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar campanha",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteCampaign(id: string) {
  try {
    // @ts-ignore
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Campanha removida",
      description: "A campanha foi removida com sucesso.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Erro ao remover campanha",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}
