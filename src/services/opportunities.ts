
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Opportunity {
  id: string;
  customer_id: string;
  title: string;
  description?: string;
  value?: number;
  stage: string;
  probability: number;
  expected_close_date?: string;
  actual_close_date?: string;
  lead_source?: string;
  assigned_to?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  // Relacionamentos
  customers?: any;
  opportunity_items?: OpportunityItem[];
}

export interface OpportunityItem {
  id: string;
  opportunity_id: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  created_at?: string;
  // Relacionamentos
  products?: any;
}

export interface CustomerInteraction {
  id: string;
  customer_id: string;
  interaction_type: string;
  subject: string;
  description?: string;
  date: string;
  duration_minutes?: number;
  outcome?: string;
  next_action?: string;
  next_action_date?: string;
  created_by?: string;
  created_at?: string;
  // Relacionamentos
  customers?: any;
}

// Serviços para Opportunities
export async function getOpportunities() {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select(`
        *,
        customers (
          id,
          name,
          company,
          email,
          phone,
          city,
          state
        ),
        opportunity_items (
          *,
          products (
            id,
            name,
            unit
          )
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar oportunidades",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function createOpportunity(opportunityData: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .insert({
        ...opportunityData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Oportunidade criada",
      description: "A oportunidade foi criada com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao criar oportunidade",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function updateOpportunity(opportunityId: string, opportunityData: Partial<Opportunity>) {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .update({
        ...opportunityData,
        updated_at: new Date().toISOString()
      })
      .eq('id', opportunityId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Oportunidade atualizada",
      description: "A oportunidade foi atualizada com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar oportunidade",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteOpportunity(opportunityId: string) {
  try {
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', opportunityId);
      
    if (error) throw error;
    
    toast({
      title: "Oportunidade excluída",
      description: "A oportunidade foi excluída com sucesso.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Erro ao excluir oportunidade",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}

// Serviços para Opportunity Items
export async function createOpportunityItem(itemData: Omit<OpportunityItem, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('opportunity_items')
      .insert(itemData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao adicionar item",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function updateOpportunityItem(itemId: string, itemData: Partial<OpportunityItem>) {
  try {
    const { data, error } = await supabase
      .from('opportunity_items')
      .update(itemData)
      .eq('id', itemId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar item",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteOpportunityItem(itemId: string) {
  try {
    const { error } = await supabase
      .from('opportunity_items')
      .delete()
      .eq('id', itemId);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    toast({
      title: "Erro ao excluir item",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}

// Serviços para Customer Interactions
export async function getCustomerInteractions(customerId?: string) {
  try {
    let query = supabase
      .from('customer_interactions')
      .select(`
        *,
        customers (
          id,
          name,
          company
        )
      `)
      .order('date', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar interações",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function createCustomerInteraction(interactionData: Omit<CustomerInteraction, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('customer_interactions')
      .insert(interactionData)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Interação registrada",
      description: "A interação foi registrada com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao registrar interação",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Serviços para System Settings
export async function getSystemSettings() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar configurações",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function updateSystemSetting(settingKey: string, settingValue: any) {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        setting_key: settingKey,
        setting_value: settingValue,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'setting_key'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Configuração atualizada",
      description: "A configuração foi salva com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao salvar configuração",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}
