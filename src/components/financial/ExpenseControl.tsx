import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Plus, Filter, AlertTriangle, TrendingDown, Edit, Trash2 } from "lucide-react";
import { NewTransactionForm } from "./NewTransactionForm";
import { useTransactionsByType, useDeleteTransaction } from "@/hooks/useTransactions";
import { toast } from "@/hooks/use-toast";

export const ExpenseControl = () => {
  const [period, setPeriod] = useState('month');
  const [showNewExpenseForm, setShowNewExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Record<string, any> | null>(null);

  const { data: expenses = [], isLoading } = useTransactionsByType('despesa');
  const deleteTransaction = useDeleteTransaction();

  // Processar dados reais das despesas
  const processedData = useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalExpenses: 0,
        expensesByCategory: [],
        monthlyExpenses: [],
        pendingExpenses: 0,
        pendingCount: 0
      };
    }

    // Agrupar por categoria
    const categoryGroups = expenses.reduce((acc: Record<string, number>, expense: any) => {
      const category = expense.category || 'Outras';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Number(expense.amount);
      return acc;
    }, {});

    const totalExpenses = Object.values(categoryGroups).reduce((sum: number, val: number) => sum + val, 0);
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
    
    const expensesByCategory = Object.entries(categoryGroups).map(([category, value], index) => ({
      category,
      value: Number(value),
      color: colors[index % colors.length],
      percentage: totalExpenses > 0 ? Number(((Number(value) / totalExpenses) * 100).toFixed(1)) : 0
    }));

    // Agrupar por mês
    const monthlyGroups = expenses.reduce((acc: Record<string, any>, expense: any) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthName, total: 0 };
      }
      acc[monthKey].total += Number(expense.amount);
      return acc;
    }, {});

    const monthlyExpenses = Object.values(monthlyGroups).sort((a: any, b: any) => a.month.localeCompare(b.month));

    // Calcular pendências
    const pendingExpenses = expenses
      .filter((expense: any) => expense.status === 'pendente')
      .reduce((sum: number, expense: any) => sum + Number(expense.amount), 0);
    
    const pendingCount = expenses.filter((expense: any) => expense.status === 'pendente').length;

    return {
      totalExpenses,
      expensesByCategory,
      monthlyExpenses,
      pendingExpenses,
      pendingCount
    };
  }, [expenses]);

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Fixa': 'bg-blue-100 text-blue-800',
      'Variável': 'bg-orange-100 text-orange-800',
      'Operacional': 'bg-purple-100 text-purple-800',
      'Marketing': 'bg-green-100 text-green-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setShowNewExpenseForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await deleteTransaction.mutateAsync(id);
        toast({
          title: "Sucesso",
          description: "Despesa excluída com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir despesa",
          variant: "destructive",
        });
      }
    }
  };

  const closeForm = () => {
    setShowNewExpenseForm(false);
    setEditingExpense(null);
  };

  const handleNewExpense = () => {
    setEditingExpense({ type: 'despesa' }); // Pre-definir como despesa
    setShowNewExpenseForm(true);
  };

  if (isLoading) {
    return <div>Carregando despesas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Despesas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {processedData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">
              {expenses.length} despesas cadastradas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas Fixas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {(processedData.expensesByCategory.find(cat => cat.category.includes('Fixa'))?.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">
              Despesas fixas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas Variáveis</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {(processedData.expensesByCategory.find(cat => cat.category.includes('Variável'))?.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">
              Despesas variáveis
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              R$ {processedData.pendingExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">
              {processedData.pendingCount} despesas pendentes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Despesas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {processedData.expensesByCategory.length > 0 ? (
              <ChartContainer
                config={{
                  value: {
                    label: "Valor",
                    color: "#ef4444",
                  },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedData.expensesByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#ef4444"
                      dataKey="value"
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                    >
                      {processedData.expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => [
                          `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                          'Valor'
                        ]}
                      />} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Nenhuma despesa por categoria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal das Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            {processedData.monthlyExpenses.length > 0 ? (
              <ChartContainer
                config={{
                  total: { label: "Total", color: "#ef4444" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData.monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Nenhuma despesa mensal
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Despesas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Controle de Despesas</CardTitle>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button onClick={handleNewExpense}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recorrente</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length > 0 ? expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {new Date(expense.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-red-600 font-semibold">
                    R$ {Number(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    {expense.due_date ? new Date(expense.due_date).toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expense.recurring ? (
                      <Badge className="bg-purple-100 text-purple-800">Sim</Badge>
                    ) : (
                      <Badge variant="outline">Não</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(expense)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Nenhuma despesa cadastrada. Clique em "Nova Despesa" para começar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Nova Despesa */}
      {showNewExpenseForm && (
        <NewTransactionForm 
          onClose={closeForm}
          editingTransaction={editingExpense}
        />
      )}
    </div>
  );
};