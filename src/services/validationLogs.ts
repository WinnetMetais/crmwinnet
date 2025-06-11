
import { supabase } from "@/integrations/supabase/client";
import { DataValidationLog } from "@/types/crm";

export class ValidationLogsService {
  // Obter logs de validação recentes
  static async getRecentValidationLogs(limit = 20): Promise<DataValidationLog[]> {
    try {
      const { data, error } = await supabase
        .from('data_validation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const logs = (data || []);
      return logs.map((log: any): DataValidationLog => ({
        id: log.id,
        module_name: log.module_name,
        table_name: log.table_name,
        record_id: log.record_id,
        validation_type: log.validation_type,
        validation_status: this.normalizeValidationStatus(log.validation_status),
        errors: this.processValidationErrors(log.errors),
        suggestions: this.processValidationErrors(log.suggestions),
        validated_by: log.validated_by,
        validated_at: log.validated_at,
        created_at: log.created_at
      }));
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      return [];
    }
  }

  private static processValidationErrors(errors: any): string[] {
    if (!errors) return [];
    if (Array.isArray(errors)) {
      return errors.map(error => String(error));
    }
    return [String(errors)];
  }

  private static normalizeValidationStatus(status: any): 'passed' | 'failed' | 'warning' {
    const validStatuses = ['passed', 'failed', 'warning'];
    if (typeof status === 'string' && validStatuses.includes(status)) {
      return status as 'passed' | 'failed' | 'warning';
    }
    return 'failed'; // valor padrão
  }
}
