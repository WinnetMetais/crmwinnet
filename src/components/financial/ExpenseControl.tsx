
import React, { useState } from 'react';
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
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const { data: expenses = [], isLoading } = useTransactionsByType('despesa');
  const deleteTransaction = useDeleteTransaction();

  // Dados de despesas categorizadas
  const expensesByCategory = [
    { category: 'Despesas Fixas', value: 185000, color: '#ef4444', percentage: 36.5 },
    { category: 'Despesas Variáveis', value: 156000, color: '#f97316', percentage: 30.8 },
    { category: 'Despesas Operacionais', value: 98320, color: '#eab308', percentage: 19.4 },
    { category: 'Marketing/Publicidade', value: 68000, color: '#22c55e', percentage: 13.3 }
  ];

  // Despesas mensais baseadas na planilha
  const monthlyExpenses = [
    { month: 'Jan', fixas: 18599.54, variaveis: 2000, operacionais: 1500, marketing: 800 },
    { month: 'Fev', fixas: 4961.33, variaveis: 1800, operacionais: 1200, marketing: 600 },
    { month: 'Mar', fixas: 4961.33, variaveis: 2200, operacionais: 1400, marketing: 900 },
    { month: 'Abr', fixas: 2590.94, variaveis: 1900, operacionais: 1100, marketing: 700 },
    { month: 'Mai', fixas: 0, variaveis: 1600, operacionais: 1000, marketing: 500 }
  ];

  // Despesas detalhadas (simuladas com base nos padrões da planilha)
  const detailedExpenses = [
    {
      id: 1,
      date: '02/jan',
      description: 'Anuidade Sistema',
      category: 'Fixa',
      value: 22.00,
      status: 'Pago',
      dueDate: '02/jan',
      recurring: true
    },
    {
      id: 2,
      description: 'Imposto de Renda',
      category: 'Fixa',
      value: 184.00,
      status: 'Pendente',
      dueDate: '15/mai',
      recurring: false
    },
    {
      id: 3,
      description: 'Frete/Transporte',
      category: 'Variável',
      value: 145.00,
      status: 'Pago',
      dueDate: '20/mai',
      recurring: false
    },
    {
      id: 4,
      description: 'Taxa Bancária',
      category: 'Operacional',
      value: 85.50,
      status: 'Pago',
      dueDate: '01/mai',
      recurring: true
    },
    {
      id: 5,
      description: 'Publicidade Online',
      category: 'Marketing',
      value: 450.00,
      status: 'Pendente',
      dueDate: '25/mai',
      recurring: true
    }
  ];

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
            <div className="text-2xl font-bold text-red-600">R$ 507.320,00</div>
            <div className="text-xs text-muted-foreground">
              +8.3% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas Fixas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ 185.000,00</div>
            <div className="text-xs text-muted-foreground">
              36.5% do total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas Variáveis</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ 156.000,00</div>
            <div className="text-xs text-muted-foreground">
              30.8% do total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">R$ 634,00</div>
            <div className="text-xs text-muted-foreground">
              2 despesas pendentes
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
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#ef4444"
                    dataKey="value"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                  >
                    {expensesByCategory.map((entry, index) => (
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
          </CardContent>
        </Card>

        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal das Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                fixas: { label: "Fixas", color: "#3b82f6" },
                variaveis: { label: "Variáveis", color: "#f97316" },
                operacionais: { label: "Operacionais", color: "#8b5cf6" },
                marketing: { label: "Marketing", color: "#22c55e" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="fixas" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="variaveis" stackId="a" fill="#f97316" />
                  <Bar dataKey="operacionais" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="marketing" stackId="a" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
              {/* Dados simulados */}
              {detailedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.date || '-'}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-red-600 font-semibold">
                    R$ {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{expense.dueDate}</TableCell>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id.toString())}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Dados do Supabase */}
              {expenses.map((expense) => (
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
              ))}
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
