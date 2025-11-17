
import { supabase } from '@/integrations/supabase/client';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions: string[];
}

export interface DataValidationLog {
  id: string;
  module_name: string;
  table_name: string;
  record_id: string;
  validation_type: string;
  validation_status: 'passed' | 'failed' | 'warning';
  errors: any[];
  suggestions: any[];
  validated_by: string;
  validated_at: string;
  created_at: string;
}

export const dataValidationService = {
  // Validar dados de cliente
  async validateCustomer(customerId: string): Promise<ValidationResult> {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error || !customer) {
      return {
        isValid: false,
        score: 0,
        errors: [{ field: 'customer', message: 'Cliente não encontrado', severity: 'error' }],
        warnings: [],
        suggestions: []
      };
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Validações obrigatórias
    if (!customer.name || customer.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Nome é obrigatório e deve ter pelo menos 2 caracteres', severity: 'error' });
    } else {
      score += 20;
    }

    // Email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (customer.email && !emailRegex.test(customer.email)) {
      errors.push({ field: 'email', message: 'Email inválido', severity: 'error' });
    } else if (customer.email && emailRegex.test(customer.email)) {
      score += 15;
    } else {
      suggestions.push('Adicionar email válido para melhorar comunicação');
    }

    // Telefone
    if (customer.phone && customer.phone.length >= 10) {
      score += 10;
    } else {
      suggestions.push('Adicionar telefone para contato direto');
    }

    // Endereço completo
    if (customer.address && customer.city && customer.state) {
      score += 15;
    } else {
      suggestions.push('Completar endereço para melhor atendimento');
    }

    // Empresa/CNPJ
    if (customer.company || customer.cnpj) {
      score += 10;
    }

    // Status
    if (customer.status && customer.status !== '') {
      score += 5;
    }

    // Lead source
    if (customer.lead_source && customer.lead_source !== '') {
      score += 5;
    }

    // Segmento
    if (customer.segment_id) {
      score += 5;
    }

    // Última interação
    if (customer.last_contact_date) {
      const lastContact = new Date(customer.last_contact_date);
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      if (lastContact > ninetyDaysAgo) {
        score += 10;
      } else {
        warnings.push({ field: 'last_contact_date', message: 'Último contato há mais de 90 dias', severity: 'warning' });
        suggestions.push('Agendar follow-up com o cliente');
      }
    } else {
      suggestions.push('Registrar primeira interação com o cliente');
    }

    // Notas
    if (customer.notes && customer.notes.length > 10) {
      score += 5;
    } else {
      suggestions.push('Adicionar observações sobre o cliente');
    }

    // Dados de teste
    const testKeywords = ['teste', 'test', 'exemplo', 'demo'];
    if (testKeywords.some(keyword => 
      customer.name?.toLowerCase().includes(keyword) ||
      customer.email?.toLowerCase().includes(keyword)
    )) {
      warnings.push({ field: 'general', message: 'Possível dado de teste detectado', severity: 'warning' });
    }

    const finalScore = Math.min(score, 100);
    const isValid = errors.length === 0 && finalScore >= 60;

    return {
      isValid,
      score: finalScore,
      errors,
      warnings,
      suggestions
    };
  },

  // Validar transação
  async validateTransaction(transactionId: string): Promise<ValidationResult> {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error || !transaction) {
      return {
        isValid: false,
        score: 0,
        errors: [{ field: 'transaction', message: 'Transação não encontrada', severity: 'error' }],
        warnings: [],
        suggestions: []
      };
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Valor
    if (!transaction.amount || transaction.amount <= 0) {
      errors.push({ field: 'amount', message: 'Valor deve ser maior que zero', severity: 'error' });
    } else {
      score += 25;
      if (transaction.amount > 500000) {
        warnings.push({ field: 'amount', message: 'Valor muito alto (>R$ 500.000)', severity: 'warning' });
      }
    }

    // Data
    if (!transaction.date) {
      errors.push({ field: 'date', message: 'Data é obrigatória', severity: 'error' });
    } else {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      if (isNaN(transactionDate.getTime())) {
        errors.push({ field: 'date', message: 'Data inválida', severity: 'error' });
      } else {
        score += 20;
        if (transactionDate > now) {
          warnings.push({ field: 'date', message: 'Data futura detectada', severity: 'warning' });
        }
      }
    }

    // Título/Descrição
    if (!transaction.title || transaction.title.trim().length < 3) {
      errors.push({ field: 'title', message: 'Descrição deve ter pelo menos 3 caracteres', severity: 'error' });
    } else {
      score += 20;
    }

    // Categoria
    if (!transaction.category || transaction.category.trim() === '') {
      errors.push({ field: 'category', message: 'Categoria é obrigatória', severity: 'error' });
    } else {
      score += 15;
    }

    // Tipo
    if (!['receita', 'despesa'].includes(transaction.type)) {
      errors.push({ field: 'type', message: 'Tipo deve ser receita ou despesa', severity: 'error' });
    } else {
      score += 10;
    }

    // Método de pagamento
    if (transaction.payment_method && transaction.payment_method !== '') {
      score += 5;
    } else {
      suggestions.push('Adicionar método de pagamento');
    }

    // Cliente
    if (transaction.client_name && transaction.client_name !== '') {
      score += 5;
    } else {
      suggestions.push('Associar transação a um cliente');
    }

    const finalScore = Math.min(score, 100);
    const isValid = errors.length === 0;

    return {
      isValid,
      score: finalScore,
      errors,
      warnings,
      suggestions
    };
  },

  // Validar deal
  async validateDeal(dealId: string): Promise<ValidationResult> {
    const { data: deal, error } = await supabase
      .from('deals')
      .select('*, customers(name)')
      .eq('id', dealId)
      .single();

    if (error || !deal) {
      return {
        isValid: false,
        score: 0,
        errors: [{ field: 'deal', message: 'Deal não encontrado', severity: 'error' }],
        warnings: [],
        suggestions: []
      };
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Título
    if (!deal.title || deal.title.trim().length < 3) {
      errors.push({ field: 'title', message: 'Título deve ter pelo menos 3 caracteres', severity: 'error' });
    } else {
      score += 20;
    }

    // Cliente associado
    if (!deal.customer_id) {
      errors.push({ field: 'customer_id', message: 'Deal deve estar associado a um cliente', severity: 'error' });
    } else {
      score += 25;
    }

    // Valor
    if (deal.value && deal.value > 0) {
      score += 20;
    } else {
      suggestions.push('Adicionar valor estimado do deal');
    }

    // Status
    if (deal.status && deal.status !== '') {
      score += 10;
    } else {
      suggestions.push('Definir status do deal');
    }

    // Data de fechamento
    if (deal.closed_at) {
      const closeDate = new Date(deal.closed_at);
      const now = new Date();
      
      if (closeDate < now && deal.status !== 'fechado') {
        warnings.push({ field: 'closed_at', message: 'Data de fechamento passou e deal não foi fechado', severity: 'warning' });
      }
      score += 10;
    } else {
      suggestions.push('Definir data esperada de fechamento');
    }

    // Responsável
    if (deal.assigned_to && deal.assigned_to !== '') {
      score += 10;
    } else {
      suggestions.push('Atribuir responsável pelo deal');
    }

    // Descrição
    if (deal.description && deal.description.length > 10) {
      score += 5;
    } else {
      suggestions.push('Adicionar descrição detalhada do deal');
    }

    const finalScore = Math.min(score, 100);
    const isValid = errors.length === 0;

    return {
      isValid,
      score: finalScore,
      errors,
      warnings,
      suggestions
    };
  },

  // Registrar log de validação
  async logValidation(logData: {
    module_name: string;
    table_name: string;
    record_id: string;
    validation_type: string;
    validation_status: 'passed' | 'failed' | 'warning';
    errors: any[];
    suggestions: any[];
    validated_by?: string;
  }) {
    const { error } = await supabase
      .from('data_validation_logs')
      .insert({
        ...logData,
        validated_by: logData.validated_by || 'system'
      });

    if (error) {
      console.error('Erro ao registrar log de validação:', error);
    }
  },

  // Buscar logs de validação
  async getValidationLogs(filters?: {
    module_name?: string;
    table_name?: string;
    validation_status?: string;
    limit?: number;
  }): Promise<DataValidationLog[]> {
    let query = supabase
      .from('data_validation_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.module_name) {
      query = query.eq('module_name', filters.module_name);
    }
    if (filters?.table_name) {
      query = query.eq('table_name', filters.table_name);
    }
    if (filters?.validation_status) {
      query = query.eq('validation_status', filters.validation_status);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar logs de validação:', error);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      validation_status: item.validation_status as 'passed' | 'failed' | 'warning',
      errors: Array.isArray(item.errors) ? item.errors : [],
      suggestions: Array.isArray(item.suggestions) ? item.suggestions : []
    }));
  },

  // Atualizar score de qualidade
  async updateDataQualityScore(tableName: 'customers' | 'deals' | 'opportunities' | 'transactions', recordId: string, score: number, errors: any[] = []) {
    const { error } = await supabase
      .from(tableName)
      .update({
        data_quality_score: score,
        last_validated_at: new Date().toISOString(),
        validation_errors: errors
      })
      .eq('id', recordId);

    if (error) {
      console.error('Erro ao atualizar score de qualidade:', error);
    }
  }
};
