
import { supabase } from "@/integrations/supabase/client";
import { QualityMetrics } from "@/types/crm";

export class QualityMetricsService {
  static async getQualityMetrics(): Promise<{ [module: string]: QualityMetrics }> {
    try {
      const metrics: { [module: string]: QualityMetrics } = {};

      // Métricas para clientes
      const customersResult = await supabase
        .from('customers')
        .select('data_quality_score');

      if (customersResult.data) {
        const scores = customersResult.data.map(c => Number(c.data_quality_score) || 0);
        const totalRecords = scores.length;
        const validRecords = scores.filter(s => s >= 70).length;
        const invalidRecords = totalRecords - validRecords;
        const averageScore = totalRecords > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalRecords) : 0;
        const completenessPercentage = totalRecords > 0 ? Math.round((validRecords / totalRecords) * 100) : 0;

        metrics.customers = {
          totalRecords,
          validRecords,
          invalidRecords,
          averageScore,
          completenessPercentage
        };
      }

      // Métricas para deals
      const dealsResult = await supabase
        .from('deals')
        .select('data_quality_score');

      if (dealsResult.data) {
        const scores = dealsResult.data.map(d => Number(d.data_quality_score) || 0);
        const totalRecords = scores.length;
        const validRecords = scores.filter(s => s >= 70).length;
        const invalidRecords = totalRecords - validRecords;
        const averageScore = totalRecords > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalRecords) : 0;
        const completenessPercentage = totalRecords > 0 ? Math.round((validRecords / totalRecords) * 100) : 0;

        metrics.deals = {
          totalRecords,
          validRecords,
          invalidRecords,
          averageScore,
          completenessPercentage
        };
      }

      // Métricas para oportunidades
      const opportunitiesResult = await supabase
        .from('opportunities')
        .select('data_quality_score');

      if (opportunitiesResult.data) {
        const scores = opportunitiesResult.data.map(o => Number(o.data_quality_score) || 0);
        const totalRecords = scores.length;
        const validRecords = scores.filter(s => s >= 70).length;
        const invalidRecords = totalRecords - validRecords;
        const averageScore = totalRecords > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalRecords) : 0;
        const completenessPercentage = totalRecords > 0 ? Math.round((validRecords / totalRecords) * 100) : 0;

        metrics.opportunities = {
          totalRecords,
          validRecords,
          invalidRecords,
          averageScore,
          completenessPercentage
        };
      }

      return metrics;
    } catch (error) {
      console.error('Erro ao obter métricas de qualidade:', error);
      return {};
    }
  }
}
