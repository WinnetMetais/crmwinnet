
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Transaction = Tables<'transactions'>;
export type TransactionInsert = TablesInsert<'transactions'>;
export type TransactionUpdate = TablesUpdate<'transactions'>;

export const transactionService = {
  // Buscar todas as transações do usuário
  async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar transações por período
  async getTransactionsByPeriod(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar transações por tipo
  async getTransactionsByType(type: 'receita' | 'despesa') {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', type)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Criar nova transação
  async createTransaction(transaction: TransactionInsert) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar transação
  async updateTransaction(id: string, updates: TransactionUpdate) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar transação
  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Buscar resumo financeiro
  async getFinancialSummary() {
    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount');
    
    if (error) throw error;
    
    const summary = data.reduce((acc, transaction) => {
      if (transaction.type === 'receita') {
        acc.totalReceitas += Number(transaction.amount);
      } else {
        acc.totalDespesas += Number(transaction.amount);
      }
      return acc;
    }, { totalReceitas: 0, totalDespesas: 0 });
    
    return {
      ...summary,
      saldo: summary.totalReceitas - summary.totalDespesas
    };
  }
};
