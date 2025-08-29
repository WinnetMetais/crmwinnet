
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Download, Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { NewTransactionForm } from "./NewTransactionForm";
import { useTransactions, useDeleteTransaction, useFinancialSummary } from "@/hooks/useTransactions";
import { toast } from "@/hooks/use-toast";

interface CashFlowItem {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'receita' | 'despesa';
  value: number;
  status: string;
  method: string;
}

export const CashFlowManager = () => {
  const [viewPeriod, setViewPeriod] = useState('month');
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<CashFlowItem | null>(null);
  
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  // Combinar dados reais e de exemplo
  const allTransactions = useMemo(() => {
    const realTransactions = transactions.map((transaction: any) => ({
      id: transaction.id,
      date: new Date(transaction.date).toLocaleDateString('pt-BR'),
      description: transaction.title,
      category: transaction.category,
      type: transaction.type,
      value: transaction.type === 'receita' ? Number(transaction.amount) : -Number(transaction.amount),
      status: transaction.status,
      method: transaction.payment_method || 'Não informado'
    }));

    // Dados de exemplo para demonstração
    const exampleData: CashFlowItem[] = [
      {
        id: 'example-1',
        date: '02/jan',
        description: 'Anuidade',
        category: 'Despesa Fixa',
        type: 'despesa',
        value: -22.00,
        status: 'Pago',
        method: 'Débito Automático'
      },
      {
        id: 'example-2',
        date: '05/mai',
        description: 'Venda - Melhor Envio',
        category: 'Receita',
        type: 'receita',
        value: 30.83,
        status: 'Recebido',
        method: 'PIX'
      }
    ];

    return [...realTransactions, ...exampleData];
  }, [transactions]);

  // Calcular totais
  const totals = useMemo(() => {
    const entradas = allTransactions
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + Math.abs(t.value), 0);
    
    const saidas = allTransactions
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + Math.abs(t.value), 0);

    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
      acumulado: entradas - saidas + 25000 // Saldo anterior simulado
    };
  }, [allTransactions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recebido':
      case 'Pago':
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado':
      case 'vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'receita'
      ? 'text-green-600 font-semibold' 
      : 'text-red-600 font-semibold';
  };

  const handleEdit = (transaction: CashFlowItem | any) => {
    setEditingTransaction(transaction);
    setShowNewTransactionForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction.mutateAsync(id);
        toast({
          title: "Sucesso",
          description: "Transação excluída com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir transação",
          variant: "destructive",
        });
      }
    }
  };

  const closeForm = () => {
    setShowNewTransactionForm(false);
    setEditingTransaction(null);
  };

  if (isLoading) {
    return <div>Carregando transações...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controles e Filtros */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Controle de Fluxo de Caixa</CardTitle>
            <div className="flex space-x-3">
              <Select defaultValue="month" onValueChange={setViewPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={() => setShowNewTransactionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <div className="text-lg font-bold text-green-600">
                R$ {totals.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Total Entradas</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-red-50">
              <div className="text-lg font-bold text-red-600">
                R$ {totals.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Total Saídas</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <div className={`text-lg font-bold ${totals.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {totals.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Saldo Líquido</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-purple-50">
              <div className="text-lg font-bold text-purple-600">
                R$ {totals.acumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Saldo Acumulado</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Dados combinados (reais + exemplo) */}
              {allTransactions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.date}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <span className={getTypeColor(item.type)}>
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getTypeColor(item.type)}>
                      R$ {Math.abs(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.method}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                        disabled={item.id.startsWith('example-')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Nova Transação */}
      {showNewTransactionForm && (
        <NewTransactionForm 
          onClose={closeForm}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  );
};
