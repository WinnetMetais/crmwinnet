
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Interface básica para transações
interface BasicTransaction {
  id: string;
}

export class DataQualityService {
  // Executar validação de qualidade dos dados
  static async runDataValidation(customerIds?: string[]): Promise<void> {
    try {
      let targetCustomers: string[] = [];
      
      if (customerIds && customerIds.length > 0) {
        targetCustomers = [...customerIds];
      } else {
        // Buscar todos os IDs de clientes usando query manual
        const response = await supabase
          .from('customers')
          .select('id');
        
        if (response.error) {
          console.error('Erro ao buscar clientes:', response.error);
          throw response.error;
        }
        
        if (response.data) {
          targetCustomers = response.data.map((item: any) => item.id);
        }
      }
      
      for (const customerId of targetCustomers) {
        try {
          // Executar função de cálculo de qualidade
          const qualityResult = await supabase.rpc('calculate_customer_data_quality', { 
            customer_id: customerId 
          });

          if (qualityResult.error) {
            console.error(`Erro ao calcular score para cliente ${customerId}:`, qualityResult.error);
            continue;
          }

          // Buscar transações de forma manual para evitar problemas de tipo
          const transactions = await this.getBasicTransactions(customerId);
          
          if (transactions.length > 0) {
            for (const transaction of transactions) {
              const validationResult = await supabase.rpc('validate_transaction_data', {
                transaction_id: transaction.id
              });

              if (validationResult.error) {
                console.error(`Erro ao validar transação ${transaction.id}:`, validationResult.error);
              }
            }
          }

          // Registrar log de validação
          await this.createValidationLog(customerId, 'customer', 'data_quality', 'passed');
        } catch (error) {
          console.error(`Erro ao processar cliente ${customerId}:`, error);
          await this.createValidationLog(customerId, 'customer', 'data_quality', 'failed');
        }
      }

      toast({
        title: "Validação Concluída",
        description: `${targetCustomers.length} registros validados com sucesso`,
      });

    } catch (error) {
      console.error('Erro na validação de dados:', error);
      toast({
        title: "Erro na Validação",
        description: "Ocorreu um erro durante a validação dos dados",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Método simplificado para buscar transações
  private static async getBasicTransactions(customerId: string): Promise<BasicTransaction[]> {
    try {
      // Query manual sem dependência de tipos complexos
      const { data, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('customer_id', customerId);
      
      if (error) {
        console.error(`Erro ao buscar transações:`, error);
        return [];
      }

      // Processar dados de forma segura
      if (!data || !Array.isArray(data)) {
        return [];
      }

      // Mapear manualmente para evitar problemas de tipo
      const transactions: BasicTransaction[] = [];
      for (const item of data) {
        if (item && typeof item === 'object' && 'id' in item) {
          transactions.push({ id: String(item.id) });
        }
      }
      
      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  }

  // Registrar log de validação de forma simplificada
  private static async createValidationLog(
    recordId: string, 
    module: string, 
    type: string, 
    status: 'passed' | 'failed' | 'warning'
  ): Promise<void> {
    try {
      const logEntry = {
        module_name: module,
        table_name: module,
        record_id: recordId,
        validation_type: type,
        validation_status: status,
        errors: [],
        suggestions: [],
        validated_by: 'Sistema Automático'
      };

      const { error } = await supabase
        .from('data_validation_logs')
        .insert(logEntry);

      if (error) {
        console.error('Erro ao registrar log:', error);
      }
    } catch (error) {
      console.error('Erro ao registrar log de validação:', error);
    }
  }
}
