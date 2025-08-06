
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle, CheckCircle, Search, Filter, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TransactionValidation {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  channel: string;
  type: 'receita' | 'despesa';
  status: string;
  client_name?: string;
  isValid: boolean;
  validationIssues: string[];
}

export const DataValidationTool = () => {
  const [transactions, setTransactions] = useState<TransactionValidation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'valid' | 'invalid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const validatedTransactions = data?.map(transaction => {
        const validation = validateTransaction(transaction);
        return {
          id: transaction.id,
          title: transaction.title,
          amount: Number(transaction.amount),
          date: transaction.date,
          category: transaction.category,
          channel: transaction.channel || 'não informado',
          type: transaction.type as 'receita' | 'despesa',
          status: transaction.status,
          client_name: transaction.client_name,
          isValid: validation.isValid,
          validationIssues: validation.issues
        };
      }) || [];

      setTransactions(validatedTransactions);
      console.log(`Carregadas ${validatedTransactions.length} transações para validação`);
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

  const validateTransaction = (transaction: any) => {
    const issues: string[] = [];
    let isValid = true;

    // Validar valor
    if (!transaction.amount || transaction.amount <= 0) {
      issues.push('Valor inválido ou zero');
      isValid = false;
    }

    // Validar data
    if (!transaction.date) {
      issues.push('Data não informada');
      isValid = false;
    } else {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      if (isNaN(transactionDate.getTime())) {
        issues.push('Data inválida');
        isValid = false;
      } else if (transactionDate > now) {
        issues.push('Data futura');
        isValid = false;
      }

      // Validar dados muito antigos (mais de 3 anos)
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(now.getFullYear() - 3);
      if (transactionDate < threeYearsAgo) {
        issues.push('Transação muito antiga (>3 anos)');
      }
    }

    // Validar valores suspeitos
    if (transaction.amount > 500000) {
      issues.push('Valor muito alto (>R$ 500.000)');
    }

    // Validar descrição
    if (!transaction.title || transaction.title.trim().length < 3) {
      issues.push('Descrição muito curta');
      isValid = false;
    }

    // Validar categoria
    if (!transaction.category || transaction.category.trim() === '') {
      issues.push('Categoria não informada');
      isValid = false;
    }

    // Validar transações de teste
    const testKeywords = ['teste', 'test', 'exemplo', 'example', 'demo'];
    if (testKeywords.some(keyword => 
      transaction.title?.toLowerCase().includes(keyword) ||
      transaction.category?.toLowerCase().includes(keyword)
    )) {
      issues.push('Possível dado de teste');
      isValid = false;
    }

    // Validar tipo de transação
    if (!transaction.type || !['receita', 'despesa'].includes(transaction.type)) {
      issues.push('Tipo de transação inválido');
      isValid = false;
    }

    return { isValid, issues };
  };

  const toggleSelection = (transactionId: string) => {
    const newSelection = new Set(selectedForDeletion);
    if (newSelection.has(transactionId)) {
      newSelection.delete(transactionId);
    } else {
      newSelection.add(transactionId);
    }
    setSelectedForDeletion(newSelection);
  };

  const selectAllInvalid = () => {
    const invalidIds = transactions
      .filter(t => !t.isValid)
      .map(t => t.id);
    setSelectedForDeletion(new Set(invalidIds));
    toast({
      title: "Seleção atualizada",
      description: `${invalidIds.length} transações inválidas selecionadas`,
    });
  };

  const clearSelection = () => {
    setSelectedForDeletion(new Set());
    toast({
      title: "Seleção limpa",
      description: "Todas as seleções foram removidas",
    });
  };

  const deleteSelectedTransactions = async () => {
    if (selectedForDeletion.size === 0) {
      toast({
        title: "Aviso",
        description: "Nenhuma transação selecionada para exclusão",
      });
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir ${selectedForDeletion.size} transação(ões)? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', Array.from(selectedForDeletion));

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedForDeletion.size} transação(ões) excluída(s) com sucesso`,
      });

      setSelectedForDeletion(new Set());
      await loadTransactions();
    } catch (error) {
      console.error('Erro ao excluir transações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir as transações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filterType === 'all' || 
      (filterType === 'valid' && transaction.isValid) ||
      (filterType === 'invalid' && !transaction.isValid);
    
    const matchesSearch = searchTerm === '' ||
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.client_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: transactions.length,
    valid: transactions.filter(t => t.isValid).length,
    invalid: transactions.filter(t => !t.isValid).length,
    selected: selectedForDeletion.size
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Validação e Limpeza de Dados Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta ferramenta permite validar e eliminar dados incorretos ou de teste do sistema financeiro.
              Revise cuidadosamente antes de excluir dados.
            </AlertDescription>
          </Alert>

          {/* Estatísticas */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
              <div className="text-sm text-muted-foreground">Válidas</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.invalid}</div>
              <div className="text-sm text-muted-foreground">Inválidas</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.selected}</div>
              <div className="text-sm text-muted-foreground">Selecionadas</div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as 'all' | 'valid' | 'invalid')
                }
                className="border rounded px-3 py-2"
              >
                <option value="all">Todas</option>
                <option value="valid">Válidas</option>
                <option value="invalid">Inválidas</option>
              </select>
            </div>

            <Button
              onClick={loadTransactions}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>

            <Button
              onClick={selectAllInvalid}
              variant="outline"
              size="sm"
            >
              Selecionar Inválidas
            </Button>

            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
              disabled={selectedForDeletion.size === 0}
            >
              Limpar Seleção
            </Button>

            <Button
              onClick={deleteSelectedTransactions}
              variant="destructive"
              size="sm"
              disabled={selectedForDeletion.size === 0 || loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Selecionadas ({selectedForDeletion.size})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações para Validação ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando transações...</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`p-4 border rounded-lg ${
                    !transaction.isValid ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedForDeletion.has(transaction.id)}
                        onCheckedChange={() => toggleSelection(transaction.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{transaction.title}</span>
                          {transaction.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            <strong>Valor:</strong> R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} |
                            <strong> Data:</strong> {new Date(transaction.date).toLocaleDateString('pt-BR')} |
                            <strong> Tipo:</strong> {transaction.type}
                          </div>
                          <div>
                            <strong>Categoria:</strong> {transaction.category} |
                            <strong> Canal:</strong> {transaction.channel}
                            {transaction.client_name && (
                              <span> | <strong>Cliente:</strong> {transaction.client_name}</span>
                            )}
                          </div>
                        </div>
                        {transaction.validationIssues.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {transaction.validationIssues.map((issue, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma transação encontrada com os filtros aplicados
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
