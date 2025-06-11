
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Interface simples para transações
interface SimpleTransaction {
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
        // Se não fornecido, buscar todos os IDs de clientes
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id');
        
        if (customerError) throw customerError;
        targetCustomers = (customerData || []).map((item: any) => item.id);
      }
      
      for (const customerId of targetCustomers) {
        // Executar função de cálculo de qualidade
        const qualityResult = await supabase.rpc('calculate_customer_data_quality', { 
          customer_id: customerId 
        });

        if (qualityResult.error) {
          console.error(`Erro ao calcular score para cliente ${customerId}:`, qualityResult.error);
          continue;
        }

        // Buscar transações usando uma query simplificada
        const transactions = await this.getCustomerTransactions(customerId);
        
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
        await this.logValidation(customerId, 'customer', 'data_quality', 'passed');
      }

      toast({
        title: "Validação Concluída",
        description: `${targetCustomers.length} registros validados com sucesso`,
      });

    } catch (error) {
      console.error('Erro na validação de dados:', error);
      throw error;
    }
  }

  // Método auxiliar para buscar transações com tipos explícitos
  private static async getCustomerTransactions(customerId: string): Promise<SimpleTransaction[]> {
    try {
      // Usar uma query direta sem inferência complexa
      const { data, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('customer_id', customerId);

      if (error) {
        console.error(`Erro ao buscar transações para cliente ${customerId}:`, error);
        return [];
      }

      // Mapear explicitamente para nossa interface simples
      return (data || []).map((item: any): SimpleTransaction => ({
        id: item.id
      }));
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  }

  // Registrar log de validação
  private static async logValidation(
    recordId: string, 
    module: string, 
    type: string, 
    status: 'passed' | 'failed' | 'warning'
  ): Promise<void> {
    try {
      const logData = {
        module_name: module,
        table_name: module,
        record_id: recordId,
        validation_type: type,
        validation_status: status,
        errors: [],
        suggestions: [],
        validated_by: 'Sistema Automático'
      };

      const result = await supabase
        .from('data_validation_logs')
        .insert(logData);

      if (result.error) {
        console.error('Erro ao registrar log de validação:', result.error);
      }
    } catch (error) {
      console.error('Erro ao registrar log de validação:', error);
    }
  }
}
