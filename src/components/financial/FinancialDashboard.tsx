
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface FinancialDashboardProps {
  data: {
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
    transacoes: number;
  };
}

export const FinancialDashboard = ({ data }: FinancialDashboardProps) => {
  // Se não há dados reais, mostrar resumo vazio mas funcional
  const hasRealData = data.totalReceitas > 0 || data.totalDespesas > 0;

  // Dados do fluxo de caixa mensal - usar dados reais quando disponíveis
  const monthlyData = hasRealData ? [
    { month: 'Este Mês', receita: data.totalReceitas, despesa: data.totalDespesas, saldo: data.saldo }
  ] : [
    { month: 'Nenhum dado', receita: 0, despesa: 0, saldo: 0 }
  ];

  // Dados por canal de vendas - usar dados reais ou placeholder
  const channelData = hasRealData ? [
    { name: 'Sistema', value: data.totalReceitas, color: '#22c55e' }
  ] : [
    { name: 'Nenhum dado', value: 0, color: '#94a3b8' }
  ];

  // Dados de despesas por categoria - usar dados reais ou placeholder
  const expenseCategories = hasRealData ? [
    { category: 'Total Despesas', value: data.totalDespesas, percentage: 100 }
  ] : [
    { category: 'Nenhum dado', value: 0, percentage: 0 }
  ];

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
