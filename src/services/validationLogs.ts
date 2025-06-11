
import { supabase } from "@/integrations/supabase/client";
import { DataValidationLog } from "@/types/crm";

export class ValidationLogsService {
  static async getRecentValidationLogs(limit = 20): Promise<DataValidationLog[]> {
    try {
      const { data, error } = await supabase
        .from('data_validation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar logs:', error);
        return [];
      }

      if (!data) return [];

      return data.map((log: any) => ({
        id: log.id || '',
        module_name: log.module_name || '',
        table_name: log.table_name || '',
        record_id: log.record_id || '',
        validation_type: log.validation_type || '',
        validation_status: log.validation_status || 'unknown',
        errors: Array.isArray(log.errors) ? log.errors : [],
        suggestions: Array.isArray(log.suggestions) ? log.suggestions : [],
        validated_by: log.validated_by || '',
        validated_at: log.validated_at || log.created_at || new Date().toISOString(),
        created_at: log.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erro ao buscar logs de validação:', error);
      return [];
    }
  }
}
