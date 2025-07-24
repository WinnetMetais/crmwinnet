
import React, { useState, useEffect } from 'react';
import { BulkOperations } from "@/components/shared/BulkOperations";
import { ValidationErrorDisplay } from "@/components/shared/ValidationErrorDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Tag, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'receita' | 'despesa';
  category: string;
  date: string;
  status: 'pendente' | 'pago' | 'vencido';
  payment_method: string;
  client_name: string;
  channel: string;
  created_at: string;
}

export const FinancialBulkOperations = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<Record<string, any>>>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Garantir que o tipo seja válido
      const validTransactions = (data || []).map(transaction => ({
        ...transaction,
        type: (transaction.type === 'receita' || transaction.type === 'despesa') 
          ? transaction.type 
          : 'receita' as const
      })) as Transaction[];
      
      setTransactions(validTransactions);
      console.log(`Carregadas ${validTransactions.length} transações para operações em massa`);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async (updates: Record<string, any>) => {
    const { id, ...updateData } = updates;
    
    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  };

  const handleBulkValidate = async () => {
    const valid: Transaction[] = [];
    const invalid: Array<Record<string, any>> = [];

    for (const transaction of transactions) {
      const errors = validateTransaction(transaction);
      
      if (errors.length === 0) {
        valid.push(transaction);
      } else {
        invalid.push({
          transaction,
          errors
        });
      }
    }

    // Preparar erros para exibição
    const formattedErrors = invalid.flatMap(item => 
      item.errors.map((error: any) => ({
        id: item.transaction.id,
        field: error.field,
        message: error.message,
        severity: error.severity as 'error' | 'warning' | 'info'
      }))
    );

    setValidationErrors(formattedErrors);
    return { valid, invalid: invalid.map(i => i.transaction) };
  };

  const validateTransaction = (transaction: Transaction) => {
    const errors = [];

    // Validar valor
    if (!transaction.amount || transaction.amount <= 0) {
      errors.push({
        field: 'valor_invalido',
        message: 'Valor inválido ou zero',
        severity: 'error'
      });
    }

    // Validar valores suspeitos
    if (transaction.amount > 500000) {
      errors.push({
        field: 'valor_muito_alto',
        message: 'Valor muito alto (>R$ 500.000)',
        severity: 'warning'
      });
    }

    // Validar data
    if (!transaction.date) {
      errors.push({
        field: 'data_invalida',
        message: 'Data não informada',
        severity: 'error'
      });
    } else {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      if (isNaN(transactionDate.getTime())) {
        errors.push({
          field: 'data_invalida',
          message: 'Data inválida',
          severity: 'error'
        });
      } else if (transactionDate > now) {
        errors.push({
          field: 'data_invalida',
          message: 'Data futura',
          severity: 'warning'
        });
      }
    }

    // Validar descrição
    if (!transaction.title || transaction.title.trim().length < 3) {
      errors.push({
        field: 'descricao_curta',
        message: 'Descrição muito curta',
        severity: 'error'
      });
    }

    // Validar categoria
    if (!transaction.category || transaction.category.trim() === '') {
      errors.push({
        field: 'categoria_vazia',
        message: 'Categoria não informada',
        severity: 'error'
      });
    }

    // Validar dados de teste
    const testKeywords = ['teste', 'test', 'exemplo', 'example', 'demo'];
    if (testKeywords.some(keyword => 
      transaction.title?.toLowerCase().includes(keyword) ||
      transaction.category?.toLowerCase().includes(keyword)
    )) {
      errors.push({
        field: 'dados_teste',
        message: 'Possível dado de teste',
        severity: 'info'
      });
    }

    // Validar tipo de transação
    if (!transaction.type || !['receita', 'despesa'].includes(transaction.type)) {
      errors.push({
        field: 'tipo_invalido',
        message: 'Tipo de transação inválido',
        severity: 'error'
      });
    }

    return errors;
  };

  const handleBulkDelete = async (ids: string[]) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .in('id', ids);

    if (error) throw error;
    
    // Recarregar dados
    await loadTransactions();
  };

  const handleFixError = async (errorId: string) => {
    // Implementar correção automática baseada no tipo de erro
    console.log('Corrigindo erro para transação:', errorId);
    toast({
      title: "Correção iniciada",
      description: "Implementando correção automática...",
    });
  };

  const updateFields = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'pendente', label: 'Pendente' },
        { value: 'pago', label: 'Pago' },
        { value: 'vencido', label: 'Vencido' }
      ]
    },
    {
      key: 'category',
      label: 'Categoria',
      type: 'text' as const
    },
    {
      key: 'payment_method',
      label: 'Método de Pagamento',
      type: 'text' as const
    },
    {
      key: 'channel',
      label: 'Canal',
      type: 'text' as const
    }
  ];

  const toggleTransactionSelection = (transactionId: string) => {
    const newSelection = new Set(selectedTransactions);
    if (newSelection.has(transactionId)) {
      newSelection.delete(transactionId);
    } else {
      newSelection.add(transactionId);
    }
    setSelectedTransactions(newSelection);
  };

  return (
    <div className="space-y-6">
      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Transações Financeiras ({transactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando transações...</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`p-4 border rounded-lg hover:bg-gray-50 ${
                    transaction.type === 'receita' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedTransactions.has(transaction.id)}
                        onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{transaction.title}</span>
                          <Badge variant={transaction.type === 'receita' ? 'default' : 'destructive'}>
                            {transaction.type}
                          </Badge>
                          <Badge variant="outline">{transaction.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {transaction.category}
                            </div>
                            {transaction.payment_method && (
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                {transaction.payment_method}
                              </div>
                            )}
                          </div>
                          {(transaction.client_name || transaction.channel) && (
                            <div className="text-xs">
                              {transaction.client_name && `Cliente: ${transaction.client_name}`}
                              {transaction.channel && ` | Canal: ${transaction.channel}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma transação encontrada
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Operações em Massa */}
      <BulkOperations
        data={transactions}
        selectedItems={selectedTransactions}
        onSelectionChange={setSelectedTransactions}
        onBulkUpdate={handleBulkUpdate}
        onBulkValidate={handleBulkValidate}
        onBulkDelete={handleBulkDelete}
        updateFields={updateFields}
        moduleType="financial"
      />

      {/* Exibição de Erros de Validação */}
      {validationErrors.length > 0 && (
        <ValidationErrorDisplay
          errors={validationErrors}
          onFixError={handleFixError}
          moduleType="financial"
        />
      )}
    </div>
  );
};
