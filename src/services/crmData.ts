
import { supabase } from "@/integrations/supabase/client";
import { Customer, ValidationResult, QualityMetrics, DataValidationLog, CRMFilters } from "@/types/crm";
import { toast } from "@/hooks/use-toast";

export class CRMDataService {
  // Carregar clientes com filtros aplicados
  static async getCustomersWithFilters(filters: CRMFilters): Promise<ValidationResult[]> {
    try {
      let query = supabase
        .from('customers')
        .select(`
          *,
          customer_segments(name)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtro de data
      if (filters.dateRange) {
        const { from, to } = filters.dateRange;
        
        // Para filtros de HOJE e 7 DIAS, considerar também last_contact_date
        if (filters.dateFilter === 'hoje' || filters.dateFilter === '7_dias') {
          query = query.or(`created_at.gte.${from.toISOString()},last_contact_date.gte.${from.toISOString()}`);
          query = query.or(`created_at.lte.${to.toISOString()},last_contact_date.lte.${to.toISOString()}`);
        } else {
          query = query
            .gte('created_at', from.toISOString())
            .lte('created_at', to.toISOString());
        }
      }

      // Aplicar filtros de status
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      // Aplicar filtro de busca
      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,company.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const customers = (data || []) as any[];
      return customers.map(customer => ({
        ...customer,
        status: this.normalizeStatus(customer.status),
        validation_errors: this.processValidationErrors(customer.validation_errors),
        severity: this.calculateSeverity(customer.data_quality_score || 0)
      }));

    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      throw error;
    }
  }

  // Executar validação de qualidade dos dados
  static async runDataValidation(customerIds?: string[]): Promise<void> {
    try {
      let customersToValidate: string[] = [];
      
      if (customerIds && customerIds.length > 0) {
        customersToValidate = customerIds;
      } else {
        // Se não fornecido, buscar todos os IDs de clientes
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id');
        
        if (customerError) throw customerError;
        customersToValidate = (customerData || []).map((customer: any) => customer.id);
      }
      
      for (const customerId of customersToValidate) {
        // Executar função de cálculo de qualidade
        const { error: scoreError } = await supabase.rpc('calculate_customer_data_quality', { 
          customer_id: customerId 
        });

        if (scoreError) {
          console.error(`Erro ao calcular score para cliente ${customerId}:`, scoreError);
          continue;
        }

        // Executar validação de transações se existirem
        const { data: transactions, error: transactionError } = await supabase
          .from('transactions')
          .select('id')
          .eq('customer_id', customerId);

        if (transactionError) {
          console.error(`Erro ao buscar transações para cliente ${customerId}:`, transactionError);
          continue;
        }

        if (transactions && transactions.length > 0) {
          for (const transaction of transactions) {
            const { error: validationError } = await supabase.rpc('validate_transaction_data', {
              transaction_id: transaction.id
            });

            if (validationError) {
              console.error(`Erro ao validar transação ${transaction.id}:`, validationError);
            }
          }
        }

        // Registrar log de validação
        await this.logValidation(customerId, 'customer', 'data_quality', 'passed');
      }

      toast({
        title: "Validação Concluída",
        description: `${customersToValidate.length} registros validados com sucesso`,
      });

    } catch (error) {
      console.error('Erro na validação de dados:', error);
      throw error;
    }
  }

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
          const records = (customersData || []).map((item: any) => ({ 
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
          const records = (dealsData || []).map((item: any) => ({ 
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
          const records = (opportunitiesData || []).map((item: any) => ({ 
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
          const records = (transactionsData || []).map((item: any) => ({ 
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

  // Obter logs de validação recentes
  static async getRecentValidationLogs(limit = 20): Promise<DataValidationLog[]> {
    try {
      const { data, error } = await supabase
        .from('data_validation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const logs = (data || []) as any[];
      return logs.map(log => ({
        ...log,
        validation_status: this.normalizeValidationStatus(log.validation_status),
        errors: this.processValidationErrors(log.errors),
        suggestions: this.processValidationErrors(log.suggestions)
      }));
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      return [];
    }
  }

  // Métodos privados auxiliares
  private static processValidationErrors(errors: any): string[] {
    if (!errors) return [];
    if (Array.isArray(errors)) {
      return errors.map(error => String(error));
    }
    return [String(errors)];
  }

  private static calculateSeverity(score: number): 'low' | 'medium' | 'high' {
    if (score >= 80) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
  }

  private static normalizeStatus(status: any): 'prospecto' | 'qualificado' | 'negociacao' | 'cliente' | 'inativo' {
    const validStatuses = ['prospecto', 'qualificado', 'negociacao', 'cliente', 'inativo'];
    if (typeof status === 'string' && validStatuses.includes(status)) {
      return status as 'prospecto' | 'qualificado' | 'negociacao' | 'cliente' | 'inativo';
    }
    return 'prospecto'; // valor padrão
  }

  private static normalizeValidationStatus(status: any): 'passed' | 'failed' | 'warning' {
    const validStatuses = ['passed', 'failed', 'warning'];
    if (typeof status === 'string' && validStatuses.includes(status)) {
      return status as 'passed' | 'failed' | 'warning';
    }
    return 'failed'; // valor padrão
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

  private static async logValidation(
    recordId: string, 
    module: string, 
    type: string, 
    status: 'passed' | 'failed' | 'warning'
  ): Promise<void> {
    try {
      await supabase
        .from('data_validation_logs')
        .insert({
          module_name: module,
          table_name: module,
          record_id: recordId,
          validation_type: type,
          validation_status: status,
          errors: [],
          suggestions: [],
          validated_by: 'Sistema Automático'
        });
    } catch (error) {
      console.error('Erro ao registrar log de validação:', error);
    }
  }
}
