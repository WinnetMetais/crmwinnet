
import { supabase } from "@/integrations/supabase/client";
import { QualityMetrics } from "@/types/crm";

export class QualityMetricsService {
  // Obter métricas de qualidade por módulo
  static async getQualityMetrics(): Promise<{ [module: string]: QualityMetrics }> {
    try {
      const metrics: { [module: string]: QualityMetrics } = {};

      // Buscar métricas para customers
      try {
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('data_quality_score');

        if (customersError) {
          console.error('Erro ao buscar métricas para customers:', customersError);
          metrics.customers = this.getEmptyMetrics();
        } else {
          const records = (customersData || []).map((item: { data_quality_score: number | null }) => ({ 
            data_quality_score: item.data_quality_score 
          }));
          metrics.customers = this.calculateModuleMetrics(records);
        }
      } catch (error) {
        console.error('Erro ao processar métricas de customers:', error);
        metrics.customers = this.getEmptyMetrics();
      }

      // Buscar métricas para deals
      try {
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('data_quality_score');

        if (dealsError) {
          console.error('Erro ao buscar métricas para deals:', dealsError);
          metrics.deals = this.getEmptyMetrics();
        } else {
          const records = (dealsData || []).map((item: { data_quality_score: number | null }) => ({ 
            data_quality_score: item.data_quality_score 
          }));
          metrics.deals = this.calculateModuleMetrics(records);
        }
      } catch (error) {
        console.error('Erro ao processar métricas de deals:', error);
        metrics.deals = this.getEmptyMetrics();
      }

      // Buscar métricas para opportunities
      try {
        const { data: opportunitiesData, error: opportunitiesError } = await supabase
          .from('opportunities')
          .select('data_quality_score');

        if (opportunitiesError) {
          console.error('Erro ao buscar métricas para opportunities:', opportunitiesError);
          metrics.opportunities = this.getEmptyMetrics();
        } else {
          const records = (opportunitiesData || []).map((item: { data_quality_score: number | null }) => ({ 
            data_quality_score: item.data_quality_score 
          }));
          metrics.opportunities = this.calculateModuleMetrics(records);
        }
      } catch (error) {
        console.error('Erro ao processar métricas de opportunities:', error);
        metrics.opportunities = this.getEmptyMetrics();
      }

      // Buscar métricas para transactions
      try {
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('data_quality_score');

        if (transactionsError) {
          console.error('Erro ao buscar métricas para transactions:', transactionsError);
          metrics.transactions = this.getEmptyMetrics();
        } else {
          const records = (transactionsData || []).map((item: { data_quality_score: number | null }) => ({ 
            data_quality_score: item.data_quality_score 
          }));
          metrics.transactions = this.calculateModuleMetrics(records);
        }
      } catch (error) {
        console.error('Erro ao processar métricas de transactions:', error);
        metrics.transactions = this.getEmptyMetrics();
      }

      return metrics;
    } catch (error) {
      console.error('Erro ao calcular métricas:', error);
      throw error;
    }
  }

  // Calcular métricas para um módulo específico
  private static calculateModuleMetrics(records: Array<{ data_quality_score: number | null }>): QualityMetrics {
    const totalRecords = records.length;
    const validRecords = records.filter(r => (r.data_quality_score || 0) >= 60).length;
    const averageScore = totalRecords > 0 
      ? Math.round(records.reduce((sum, r) => sum + (r.data_quality_score || 0), 0) / totalRecords)
      : 0;

    return {
      totalRecords,
      validRecords,
      invalidRecords: totalRecords - validRecords,
      averageScore,
      completenessPercentage: totalRecords > 0 ? Math.round((validRecords / totalRecords) * 100) : 0
    };
  }

  private static getEmptyMetrics(): QualityMetrics {
    return {
      totalRecords: 0,
      validRecords: 0,
      invalidRecords: 0,
      averageScore: 0,
      completenessPercentage: 0
    };
  }
}
