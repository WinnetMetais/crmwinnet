
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useTransactions } from "@/hooks/useTransactions";

interface FinancialDashboardProps {
  data: {
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
    transacoes: number;
  };
}

export const FinancialDashboard = ({ data }: FinancialDashboardProps) => {
  const { data: transactions = [] } = useTransactions();
  
  // Processar dados reais das transações
  const processedData = useMemo(() => {
    if (transactions.length === 0) {
      return {
        monthlyData: [{ month: 'Nenhum dado', receita: 0, despesa: 0, saldo: 0 }],
        channelData: [{ name: 'Nenhum dado', value: 0, color: '#94a3b8' }],
        expenseCategories: [{ category: 'Nenhum dado', value: 0, percentage: 0 }],
        hasRealData: false
      };
    }

    // Agrupar por mês
    const monthlyGrouped = transactions.reduce((acc: any, transaction: any) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, receita: 0, despesa: 0, saldo: 0 };
      }
      
      const amount = Number(transaction.amount);
      if (transaction.type === 'receita') {
        acc[monthKey].receita += amount;
      } else {
        acc[monthKey].despesa += amount;
      }
      acc[monthKey].saldo = acc[monthKey].receita - acc[monthKey].despesa;
      
      return acc;
    }, {});

    const monthlyData = Object.values(monthlyGrouped).sort((a: any, b: any) => a.month.localeCompare(b.month));

    // Agrupar por canal
    const channelGrouped = transactions
      .filter((t: any) => t.type === 'receita')
      .reduce((acc: any, transaction: any) => {
        const channel = transaction.channel || 'Outros';
        acc[channel] = (acc[channel] || 0) + Number(transaction.amount);
        return acc;
      }, {});

    const channelData = Object.entries(channelGrouped).map(([name, value]: [string, any], index) => ({
      name,
      value,
      color: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
    }));

    // Agrupar despesas por categoria
    const expenseGrouped = transactions
      .filter((t: any) => t.type === 'despesa')
      .reduce((acc: any, transaction: any) => {
        const category = transaction.category || 'Outros';
        acc[category] = (acc[category] || 0) + Number(transaction.amount);
        return acc;
      }, {});

    const expenseValues = Object.values(expenseGrouped).map(val => Number(val));
    const totalExpenses = expenseValues.reduce((sum: number, val: number) => sum + val, 0);
    const expenseCategories = Object.entries(expenseGrouped).map(([category, value]: [string, any]) => {
      const numValue = Number(value);
      return {
        category,
        value: numValue,
        percentage: totalExpenses > 0 ? Number(((numValue / totalExpenses) * 100).toFixed(1)) : 0
      };
    });

    return {
      monthlyData,
      channelData,
      expenseCategories,
      hasRealData: true
    };
  }, [transactions]);

  const { monthlyData, channelData, expenseCategories, hasRealData } = processedData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Fluxo de Caixa */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Fluxo de Caixa Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              receita: {
                label: "Receita",
                color: "#22c55e",
              },
              despesa: {
                label: "Despesa",
                color: "#ef4444",
              },
              saldo: {
                label: "Saldo",
                color: "#3b82f6",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="receita" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Receitas por Canal */}
      <Card>
        <CardHeader>
          <CardTitle>Receitas por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Valor",
                color: "#8884d8",
              },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [
                      `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      name
                    ]}
                  />} 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Categorias de Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-medium">{category.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    R$ {category.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {category.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro Real */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                R$ {data.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Total Receitas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                R$ {data.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Total Despesas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-2xl font-bold ${data.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {data.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Saldo</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.transacoes}</div>
              <div className="text-sm text-muted-foreground">Total Transações</div>
            </div>
          </div>
          {!hasRealData && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nenhuma transação encontrada.</strong> Comece criando sua primeira receita ou despesa na aba "Nova".
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
