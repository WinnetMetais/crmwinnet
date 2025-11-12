
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AnalyticsReport {
  id: string;
  report_name: string;
  report_type: string;
  data: any;
  period_start?: string;
  period_end?: string;
  generated_by?: string;
  generated_at: string;
}

export async function getAnalyticsReports(reportType?: string) {
  try {
    // @ts-ignore
    let query = supabase
      .from('analytics_reports')
      .select('*')
      .order('generated_at', { ascending: false });

    if (reportType) {
      // @ts-ignore
      query = query.eq('report_type', reportType);
    }

    const { data, error } = await query;
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar relatórios",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function createAnalyticsReport(reportData: Omit<AnalyticsReport, 'id' | 'generated_at'>) {
  try {
    // @ts-ignore
    const { data, error } = await supabase
      .from('analytics_reports')
      .insert({
        ...reportData,
        generated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Relatório gerado",
      description: "O relatório foi gerado com sucesso.",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao gerar relatório",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

// Função para gerar relatório de vendas
export async function generateSalesReport(periodStart: string, periodEnd: string) {
  try {
    // Buscar dados de oportunidades no período
    const { data: opportunities, error: opError } = await supabase
      .from('opportunities')
      .select(`
        *,
        customers(name, company),
        opportunity_items(*)
      `)
      .gte('created_at', periodStart)
      .lte('created_at', periodEnd);

    if (opError) throw opError;

    // Buscar dados de deals no período
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select(`
        *,
        customers(name, company)
      `)
      .gte('created_at', periodStart)
      .lte('created_at', periodEnd);

    if (dealsError) throw dealsError;

    // Processar dados para o relatório
    const reportData = {
      period: { start: periodStart, end: periodEnd },
      opportunities: {
        total: opportunities?.length || 0,
        value: opportunities?.reduce((sum, op) => sum + (op.value || 0), 0) || 0,
        by_stage: {},
        by_assigned: {}
      },
      deals: {
        total: deals?.length || 0,
        // @ts-ignore
        value: deals?.reduce((sum, deal) => sum + (deal.estimated_value || deal.value || 0), 0) || 0
      }
    };

    return createAnalyticsReport({
      report_name: `Relatório de Vendas - ${new Date(periodStart).toLocaleDateString()} a ${new Date(periodEnd).toLocaleDateString()}`,
      report_type: 'sales',
      data: reportData,
      period_start: periodStart,
      period_end: periodEnd,
      generated_by: 'Sistema'
    });
  } catch (error: any) {
    toast({
      title: "Erro ao gerar relatório de vendas",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}
