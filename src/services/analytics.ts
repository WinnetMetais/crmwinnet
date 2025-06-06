
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type AnalyticsData = Tables<'analytics_data'>;
export type AnalyticsDataInsert = TablesInsert<'analytics_data'>;

export const analyticsService = {
  // Buscar dados de análise por categoria
  async getAnalyticsByCategory(category: string) {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('category', category)
      .order('metric_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar dados de análise por período
  async getAnalyticsByPeriod(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .gte('metric_date', startDate)
      .lte('metric_date', endDate)
      .order('metric_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Registrar métrica
  async recordMetric(metric: AnalyticsDataInsert) {
    const { data, error } = await supabase
      .from('analytics_data')
      .insert(metric)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Buscar métricas de vendas
  async getSalesMetrics() {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('category', 'sales')
      .order('metric_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar métricas financeiras
  async getFinancialMetrics() {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('category', 'financial')
      .order('metric_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
