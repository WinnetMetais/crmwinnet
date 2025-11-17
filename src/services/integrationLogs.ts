// @ts-nocheck - integration_logs table exists but types not yet regenerated
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface IntegrationLog {
  id: string;
  integration_type: string;
  action: string;
  status: string;
  data?: any;
  error_message?: string;
  created_at: string;
}

export async function getIntegrationLogs(integrationType?: string) {
  try {
    // @ts-ignore - integration_logs table exists but types not yet regenerated
    let query = supabase
      .from('integration_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (integrationType) {
      query = query.eq('integration_type', integrationType);
    }

    const { data, error } = await query;
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar logs",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function createIntegrationLog(logData: Omit<IntegrationLog, 'id' | 'created_at'>) {
  try {
    // @ts-ignore - integration_logs table exists but types not yet regenerated
    const { data, error } = await supabase
      .from('integration_logs')
      .insert(logData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Erro ao criar log:", error);
    return null;
  }
}

export async function logIntegrationAction(
  integrationType: string, 
  action: string, 
  status: 'success' | 'error' | 'pending',
  data?: any,
  errorMessage?: string
) {
  return createIntegrationLog({
    integration_type: integrationType,
    action,
    status,
    data,
    error_message: errorMessage
  });
}
