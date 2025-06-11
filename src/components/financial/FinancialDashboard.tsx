
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
  // Dados do fluxo de caixa mensal baseados na planilha
  const monthlyData = [
    { month: 'Jan', receita: 2239.54, despesa: 18599.54, saldo: -16360 },
    { month: 'Fev', receita: 417.55, despesa: 4961.33, saldo: -4543.78 },
    { month: 'Mar', receita: 17204.96, despesa: 4961.33, saldo: 12243.63 },
    { month: 'Abr', receita: 4676.21, despesa: 2590.94, saldo: 2085.27 },
    { month: 'Mai', receita: 11411.22, despesa: 0, saldo: 11411.22 }
  ];

  // Dados por canal de vendas
  const channelData = [
    { name: 'Site', value: 86728, color: '#8884d8' },
    { name: 'Mercado Livre CNPJ', value: 64739, color: '#83a6ed' },
    { name: 'Madeira Madeira', value: 7971.67, color: '#8dd1e1' },
    { name: 'VIA', value: 2495.42, color: '#82ca9d' },
    { name: 'Comercial', value: 22093.86, color: '#ffc658' }
  ];

  // Dados de despesas por categoria
  const expenseCategories = [
    { category: 'Fixas', value: 185000, percentage: 36.5 },
    { category: 'Variáveis', value: 156000, percentage: 30.8 },
    { category: 'Operacionais', value: 98320, percentage: 19.4 },
    { category: 'Marketing', value: 68000, percentage: 13.3 }
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

      {/* Métricas Avançadas */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Métricas Avançadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">21.8%</div>
              <div className="text-sm text-muted-foreground">Margem de Lucro</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">R$ 15.950</div>
              <div className="text-sm text-muted-foreground">Ticket Médio</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">45 dias</div>
              <div className="text-sm text-muted-foreground">Prazo Médio Recebimento</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2.3x</div>
              <div className="text-sm text-muted-foreground">Giro do Estoque</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
