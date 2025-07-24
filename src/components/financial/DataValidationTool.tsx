
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
    const invalidIds = transactions.filter(t => !t.isValid).map(t => t.id);
    setSelectedForDeletion(new Set(invalidIds));
  };

  const clearSelection = () => {
    setSelectedForDeletion(new Set());
  };

  const deleteSelectedTransactions = async () => {
    if (selectedForDeletion.size === 0) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedForDeletion.size} transações?`)) {
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
        description: `${selectedForDeletion.size} transações excluídas`,
      });

      setSelectedForDeletion(new Set());
      await loadTransactions();
    } catch (error) {
      console.error('Erro ao excluir transações:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir transações",
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
      (transaction.client_name && transaction.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
            <CheckCircle className="h-5 w-5" />
            Ferramenta de Validação de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta ferramenta identifica e permite limpar dados inconsistentes, duplicados ou de teste.
              Use com cuidado - transações excluídas não podem ser recuperadas.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{stats.valid}</div>
              <div className="text-sm text-muted-foreground">Válidas</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{stats.invalid}</div>
              <div className="text-sm text-muted-foreground">Inválidas</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{stats.selected}</div>
              <div className="text-sm text-muted-foreground">Selecionadas</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por título, categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>Filtro</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  Todas
                </Button>
                <Button
                  variant={filterType === 'valid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('valid')}
                >
                  Válidas
                </Button>
                <Button
                  variant={filterType === 'invalid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('invalid')}
                >
                  Inválidas
                </Button>
              </div>
            </div>

            <div>
              <Label>Ações</Label>
              <div className="flex gap-2 mt-1">
                <Button variant="outline" size="sm" onClick={loadTransactions} disabled={loading}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={selectAllInvalid}>
                  Selecionar Inválidas
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Limpar Seleção
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={deleteSelectedTransactions}
                  disabled={selectedForDeletion.size === 0 || loading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir ({selectedForDeletion.size})
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`p-4 border rounded-lg ${
                    !transaction.isValid ? 'border-red-200 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedForDeletion.has(transaction.id)}
                      onCheckedChange={() => toggleSelection(transaction.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{transaction.title}</span>
                        <Badge variant={transaction.isValid ? "default" : "destructive"}>
                          {transaction.isValid ? "Válida" : "Inválida"}
                        </Badge>
                        <Badge variant="outline">{transaction.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-2">
                        <div>Valor: R$ {transaction.amount.toLocaleString('pt-BR')}</div>
                        <div>Data: {new Date(transaction.date).toLocaleDateString('pt-BR')}</div>
                        <div>Categoria: {transaction.category}</div>
                        <div>Canal: {transaction.channel}</div>
                      </div>

                      {transaction.validationIssues.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-red-600">Problemas identificados:</span>
                          <ul className="text-sm text-red-600 ml-4">
                            {transaction.validationIssues.map((issue, index) => (
                              <li key={index}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
