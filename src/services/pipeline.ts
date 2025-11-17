
// @ts-nocheck - Missing tables and columns - types will be regenerated after migration
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LeadSource {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

export interface CustomerType {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

export interface PipelineStage {
  id: string;
  name: string;
  description?: string;
  order_position: number;
  color?: string;
  active?: boolean;
}

export interface Priority {
  id: string;
  name: string;
  level: number;
  color: string;
  active?: boolean;
}

export interface QualificationStatus {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

export interface PipelineActivity {
  id: string;
  deal_id: string;
  customer_id?: string;
  activity_type: string;
  title: string;
  description?: string;
  scheduled_date?: string;
  completed_date?: string;
  status: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Deal {
  id: string;
  customer_id: string;
  title: string;
  value?: number;
  estimated_value?: number;
  actual_value?: number;
  status?: string;
  close_date?: string;
  description?: string;
  assigned_to?: string;
  pipeline_stage_id?: string;
  priority_id?: string;
  qualification_status_id?: string;
  proposal_sent_date?: string;
  proposal_value?: number;
  presentation_sent_date?: string;
  follow_up_date?: string;
  active_follow_up?: boolean;
  last_contact_date?: string;
  observations?: string;
  created_at?: string;
  updated_at?: string;
  // Relacionamentos
  customers?: any;
  pipeline_stages?: PipelineStage;
  priorities?: Priority;
  qualification_status?: QualificationStatus;
}

// Serviços para Lead Sources
export async function getLeadSources() {
  try {
    const { data, error } = await supabase
      .from('lead_sources')
      .select('*')
      .eq('active', true)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar fontes de lead",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Serviços para Customer Segments
export async function getCustomerSegments() {
  try {
    const { data, error } = await supabase
      .from('customer_segments')
      .select('*')
      .eq('active', true)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar segmentos",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Serviços para Customer Types
export async function getCustomerTypes() {
  try {
    const { data, error } = await supabase
      .from('customer_types')
      .select('*')
      .eq('active', true)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar tipos de cliente",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Serviços para Pipeline Stages
export async function getPipelineStages() {
  try {
    const { data, error } = await supabase
      .from('pipeline_stages')
      .select('*')
      .eq('active', true)
      .order('order_position');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar estágios do pipeline",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Serviços para Priorities
export async function getPriorities() {
  try {
    const { data, error } = await supabase
      .from('priorities')
      .select('*')
      .eq('active', true)
      .order('level');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar prioridades",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Serviços para Qualification Status
export async function getQualificationStatus() {
  try {
    const { data, error } = await supabase
      .from('qualification_status')
      .select('*')
      .eq('active', true)
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar status de qualificação",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Serviços para Deals com relacionamentos
export async function getDealsWithRelations() {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        customers!deals_customer_id_fkey (
          id,
          name,
          company,
          email,
          phone,
          city,
          state
        ),
        pipeline_stages!deals_pipeline_stage_id_fkey (
          id,
          name,
          color,
          order_position
        ),
        priorities!deals_priority_id_fkey (
          id,
          name,
          color,
          level
        ),
        qualification_status!deals_qualification_status_id_fkey (
          id,
          name
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

// Criar nova oportunidade/deal
export async function createDeal(dealData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert({
        ...dealData,
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

// Atualizar deal
export async function updateDeal(dealId: string, dealData: Partial<Deal>) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .update({
        ...dealData,
        updated_at: new Date().toISOString()
      })
      .eq('id', dealId)
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

// Excluir deal
export async function deleteDeal(dealId: string) {
  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId);
      
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

// Atualizar estágio do deal
export async function updateDealStage(dealId: string, stageId: string, reason?: string) {
  try {
    // Primeiro, buscar o estágio atual
    const { data: currentDeal } = await supabase
      .from('deals')
      .select('pipeline_stage_id')
      .eq('id', dealId)
      .single();

    // Atualizar o deal
    const { data, error } = await supabase
      .from('deals')
      .update({ 
        pipeline_stage_id: stageId,
        updated_at: new Date().toISOString()
      })
      .eq('id', dealId)
      .select()
      .single();
      
    if (error) throw error;

    // Registrar no histórico
    if (currentDeal?.pipeline_stage_id !== stageId) {
      await supabase
        .from('pipeline_history')
        .insert({
          deal_id: dealId,
          from_stage_id: currentDeal?.pipeline_stage_id,
          to_stage_id: stageId,
          reason: reason || 'Movido pelo usuário',
          changed_by: 'Usuário Atual'
        });
    }
    
    toast({
      title: "Negócio atualizado",
      description: "O estágio do negócio foi atualizado com sucesso.",
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

// Criar nova atividade
export async function createPipelineActivity(activity: Omit<PipelineActivity, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('pipeline_activities')
      .insert(activity)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Atividade criada",
      description: "A atividade foi criada com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao criar atividade",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Buscar atividades de um deal
export async function getDealActivities(dealId: string) {
  try {
    const { data, error } = await supabase
      .from('pipeline_activities')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar atividades",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

// Buscar clientes para seleção
export async function getCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, company, email, phone')
      .eq('status', 'active')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar clientes",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}
