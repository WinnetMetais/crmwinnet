
import { supabase } from "@/integrations/supabase/client";
import { transactionService } from "./transactions";
import { logIntegrationAction } from "./integrationLogs";

export interface SpreadsheetMapping {
  dateColumn: string;
  descriptionColumn: string;
  categoryColumn: string;
  typeColumn: string;
  amountColumn: string;
  statusColumn: string;
  methodColumn: string;
}

export class SpreadsheetSyncService {
  /**
   * Configuração padrão de mapeamento de colunas
   */
  private defaultMapping: SpreadsheetMapping = {
    dateColumn: 'data',
    descriptionColumn: 'descricao',
    categoryColumn: 'categoria',
    typeColumn: 'tipo',
    amountColumn: 'valor',
    statusColumn: 'status',
    methodColumn: 'metodo'
  };

  /**
   * Processa e importa dados de uma planilha CSV
   */
  async importCSV(csvContent: string, mapping?: Partial<SpreadsheetMapping>) {
    try {
      await logIntegrationAction('spreadsheet', 'import_start', 'pending');
      
      const finalMapping = { ...this.defaultMapping, ...mapping };
      const rows = this.parseCSV(csvContent, finalMapping);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const results = await this.syncTransactions(rows, user.id);
      
      await logIntegrationAction('spreadsheet', 'import_complete', 'success', {
        imported: results.success,
        errors: results.errors,
        total: results.total
      });

      return results;
    } catch (error) {
      await logIntegrationAction('spreadsheet', 'import_error', 'error', null, String(error));
      throw error;
    }
  }

  /**
   * Parse do conteúdo CSV com mapeamento personalizado
   */
  private parseCSV(csv: string, mapping: SpreadsheetMapping) {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        
        // Mapear colunas usando configuração
        if (header.includes(mapping.dateColumn.toLowerCase())) {
          row.date = this.parseDate(value);
        } else if (header.includes(mapping.descriptionColumn.toLowerCase())) {
          row.description = value;
        } else if (header.includes(mapping.categoryColumn.toLowerCase())) {
          row.category = value;
        } else if (header.includes(mapping.typeColumn.toLowerCase())) {
          row.type = this.parseType(value);
        } else if (header.includes(mapping.amountColumn.toLowerCase())) {
          row.amount = this.parseAmount(value);
        } else if (header.includes(mapping.statusColumn.toLowerCase())) {
          row.status = this.parseStatus(value);
        } else if (header.includes(mapping.methodColumn.toLowerCase())) {
          row.method = value;
        }
      });
      
      return row;
    }).filter(row => row.description && row.amount && row.amount !== 0);
  }

  /**
   * Converte string de data para formato ISO
   */
  private parseDate(dateStr: string): string {
    // Formatos aceitos: dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        return dateStr; // Já está em formato ISO
      } else {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return new Date().toISOString().split('T')[0]; // Fallback para hoje
  }

  /**
   * Identifica o tipo de transação
   */
  private parseType(typeStr: string): 'receita' | 'despesa' {
    const type = typeStr.toLowerCase();
    if (type.includes('entrada') || type.includes('receita') || type.includes('credit')) {
      return 'receita';
    }
    return 'despesa';
  }

  /**
   * Converte string de valor para número
   */
  private parseAmount(amountStr: string): number {
    // Remove todos os caracteres não numéricos exceto . e -
    const cleaned = amountStr.replace(/[^\d.,-]/g, '');
    // Substitui vírgula por ponto para decimais
    const normalized = cleaned.replace(',', '.');
    return Math.abs(parseFloat(normalized)) || 0;
  }

  /**
   * Normaliza status da transação
   */
  private parseStatus(statusStr: string): 'pendente' | 'pago' | 'vencido' {
    const status = statusStr.toLowerCase();
    if (status.includes('pago') || status.includes('recebido') || status.includes('paid')) {
      return 'pago';
    } else if (status.includes('vencido') || status.includes('atrasado') || status.includes('overdue')) {
      return 'vencido';
    }
    return 'pendente';
  }

  /**
   * Sincroniza transações com o banco de dados
   */
  private async syncTransactions(rows: any[], userId: string) {
    let successCount = 0;
    let errorCount = 0;
    const total = rows.length;

    for (const row of rows) {
      try {
        const transactionData = {
          type: row.type,
          title: row.description,
          amount: row.amount,
          category: row.category || 'Importado',
          date: row.date,
          status: row.status,
          payment_method: row.method || '',
          description: `Importado da planilha: ${row.description}`,
          user_id: userId
        };

        // Verificar se já existe uma transação similar para evitar duplicatas
        const existingTransaction = await this.checkDuplicate(transactionData);
        
        if (!existingTransaction) {
          await transactionService.createTransaction(transactionData);
          successCount++;
        } else {
          console.log('Transação duplicada ignorada:', row.description);
        }
      } catch (error) {
        console.error('Erro ao sincronizar transação:', error);
        errorCount++;
      }
    }

    return { success: successCount, errors: errorCount, total };
  }

  /**
   * Verifica se já existe uma transação similar
   */
  private async checkDuplicate(transactionData: any): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('id')
        .eq('title', transactionData.title)
        .eq('amount', transactionData.amount)
        .eq('date', transactionData.date)
        .limit(1);

      return data && data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar duplicata:', error);
      return false;
    }
  }

  /**
   * Gera modelo CSV para download
   */
  generateTemplate(): string {
    return [
      "data,descricao,categoria,tipo,valor,status,metodo",
      "02/01/2024,Venda de Produtos,Receita,ENTRADA,1500.00,Recebido,PIX",
      "05/01/2024,Fornecedor ABC,Despesa Operacional,SAIDA,800.00,Pago,Boleto",
      "10/01/2024,Comissão de Vendas,Receita,ENTRADA,300.00,Pendente,Transferência",
      "15/01/2024,Energia Elétrica,Despesa Fixa,SAIDA,450.00,Pago,Débito Automático",
      "20/01/2024,Venda Mercado Livre,Receita,ENTRADA,2200.00,Recebido,Cartão"
    ].join('\n');
  }

  /**
   * Configura sincronização automática (futuro)
   */
  async setupAutoSync(frequency: 'daily' | 'weekly' | 'monthly') {
    // Esta funcionalidade pode ser implementada futuramente
    // usando Supabase Edge Functions com cron jobs
    console.log(`Configurando sincronização automática: ${frequency}`);
    
    return {
      enabled: true,
      frequency,
      nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    };
  }
}

export const spreadsheetSyncService = new SpreadsheetSyncService();
