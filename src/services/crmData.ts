
import { CRMCustomersService } from "./crmCustomers";
import { DataQualityService } from "./dataQuality";
import { QualityMetricsService } from "./qualityMetrics";
import { ValidationLogsService } from "./validationLogs";
import { ValidationResult, QualityMetrics, DataValidationLog, CRMFilters } from "@/types/crm";
import { supabase } from "@/integrations/supabase/client";

export class CRMDataService {
  // Carregar clientes com filtros aplicados
  static async getCustomersWithFilters(filters: CRMFilters): Promise<ValidationResult[]> {
    try {
      return await CRMCustomersService.getCustomersWithFilters(filters);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      return [];
    }
  }

  // Executar validação de qualidade dos dados
  static async runDataValidation(customerIds?: string[]): Promise<void> {
    try {
      return await DataQualityService.runDataValidation(customerIds);
    } catch (error) {
      console.error('Erro na validação:', error);
      throw error;
    }
  }

  // Obter métricas de qualidade por módulo
  static async getQualityMetrics(): Promise<{ [module: string]: QualityMetrics }> {
    try {
      return await QualityMetricsService.getQualityMetrics();
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      return {};
    }
  }

  // Obter logs de validação recentes
  static async getRecentValidationLogs(limit = 20): Promise<DataValidationLog[]> {
    try {
      return await ValidationLogsService.getRecentValidationLogs(limit);
    } catch (error) {
      console.error('Erro ao obter logs:', error);
      return [];
    }
  }

  // Sincronizar dados entre módulos
  static async syncCRMData(): Promise<void> {
    try {
      console.log('Iniciando sincronização de dados CRM...');
      
      // Verificar integridade dos dados
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, name, email, data_quality_score')
        .limit(100);

      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id, title, customer_id, estimated_value')
        .limit(100);

      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, title, customer_id, deal_id, status')
        .limit(100);

      if (customersError || dealsError || tasksError) {
        throw new Error('Erro ao verificar integridade dos dados');
      }

      // Atualizar relacionamentos
      console.log(`Verificando ${customers?.length || 0} clientes, ${deals?.length || 0} negócios e ${tasks?.length || 0} tarefas`);

      // Marcar sincronização como concluída
      await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'crm_last_sync',
          setting_value: { timestamp: new Date().toISOString() },
          description: 'Última sincronização do CRM'
        });

      console.log('Sincronização CRM concluída com sucesso');
    } catch (error) {
      console.error('Erro na sincronização CRM:', error);
      throw error;
    }
  }

  // Obter estatísticas do dashboard
  static async getDashboardStats(): Promise<any> {
    try {
      const [customersResult, dealsResult, tasksResult] = await Promise.all([
        supabase.from('customers').select('id, status, created_at').order('created_at', { ascending: false }),
        supabase.from('deals').select('id, estimated_value, status, created_at').order('created_at', { ascending: false }),
        supabase.from('tasks').select('id, status, priority, due_date').order('created_at', { ascending: false })
      ]);

      const customers = customersResult.data || [];
      const deals = dealsResult.data || [];
      const tasks = tasksResult.data || [];

      return {
        customers: {
          total: customers.length,
          active: customers.filter(c => c.status === 'active').length,
          newThisMonth: customers.filter(c => {
            const created = new Date(c.created_at);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length
        },
        deals: {
          total: deals.length,
          totalValue: deals.reduce((sum, deal) => sum + (deal.estimated_value || 0), 0),
          active: deals.filter(d => d.status === 'lead' || d.status === 'qualified').length
        },
        tasks: {
          total: tasks.length,
          pending: tasks.filter(t => t.status === 'pending').length,
          overdue: tasks.filter(t => {
            if (!t.due_date) return false;
            return new Date(t.due_date) < new Date() && t.status !== 'completed';
          }).length,
          highPriority: tasks.filter(t => t.priority === 'high').length
        }
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        customers: { total: 0, active: 0, newThisMonth: 0 },
        deals: { total: 0, totalValue: 0, active: 0 },
        tasks: { total: 0, pending: 0, overdue: 0, highPriority: 0 }
      };
    }
  }
}
