
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Snowflake, Sun, Leaf, CloudRain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

export const SeasonalityAnalysis = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMetric, setSelectedMetric] = useState('vendas');

  const monthlyData = [
    { mes: 'Jan', vendas: 285000, leads: 95, conversao: 24, sazonalidade: 85, estacao: 'Verão' },
    { mes: 'Fev', vendas: 320000, leads: 112, conversao: 28, sazonalidade: 95, estacao: 'Verão' },
    { mes: 'Mar', vendas: 380000, leads: 135, conversao: 32, sazonalidade: 115, estacao: 'Outono' },
    { mes: 'Abr', vendas: 410000, leads: 142, conversao: 35, sazonalidade: 125, estacao: 'Outono' },
    { mes: 'Mai', vendas: 458000, leads: 158, conversao: 38, sazonalidade: 140, estacao: 'Outono' },
    { mes: 'Jun', vendas: 395000, leads: 128, conversao: 29, sazonalidade: 118, estacao: 'Inverno' },
    { mes: 'Jul', vendas: 325000, leads: 98, conversao: 25, sazonalidade: 96, estacao: 'Inverno' },
    { mes: 'Ago', vendas: 298000, leads: 89, conversao: 22, sazonalidade: 88, estacao: 'Inverno' },
    { mes: 'Set', vendas: 342000, leads: 115, conversao: 28, sazonalidade: 102, estacao: 'Primavera' },
    { mes: 'Out', vendas: 425000, leads: 148, conversao: 34, sazonalidade: 128, estacao: 'Primavera' },
    { mes: 'Nov', vendas: 480000, leads: 165, conversao: 36, sazonalidade: 145, estacao: 'Primavera' },
    { mes: 'Dez', vendas: 365000, leads: 125, conversao: 30, sazonalidade: 110, estacao: 'Verão' }
  ];

  const seasonalAnalysis = [
    { estacao: 'Primavera', icone: Leaf, vendas: 1247000, leads: 428, crescimento: 28.5, melhorMes: 'Novembro' },
    { estacao: 'Verão', icone: Sun, vendas: 970000, leads: 332, crescimento: 8.2, melhorMes: 'Fevereiro' },
    { estacao: 'Outono', icone: CloudRain, vendas: 1248000, leads: 435, crescimento: 22.4, melhorMes: 'Maio' },
    { estacao: 'Inverno', icone: Snowflake, vendas: 1018000, leads: 315, crescimento: -12.8, melhorMes: 'Junho' }
  ];

  const productSeasonality = [
    { produto: 'Lixeira L4090', q1: 125000, q2: 158000, q3: 142000, q4: 135000, pico: 'Q2', variacao: 26.4 },
    { produto: 'Lixeira L1618', q1: 95000, q2: 115000, q3: 108000, q4: 98000, pico: 'Q2', variacao: 21.1 },
    { produto: 'Lixeira L40120', q1: 85000, q2: 98000, q3: 92000, q4: 88000, pico: 'Q2', variacao: 15.3 },
    { produto: 'Lixeira L3020', q1: 75000, q2: 85000, q3: 82000, q4: 78000, pico: 'Q2', variacao: 13.3 }
  ];

  const yearOverYearComparison = [
    { mes: 'Jan', '2023': 245000, '2024': 285000, variacao: 16.3 },
    { mes: 'Fev', '2023': 285000, '2024': 320000, variacao: 12.3 },
    { mes: 'Mar', '2023': 325000, '2024': 380000, variacao: 16.9 },
    { mes: 'Abr', '2023': 355000, '2024': 410000, variacao: 15.5 },
    { mes: 'Mai', '2023': 398000, '2024': 458000, variacao: 15.1 },
    { mes: 'Jun', '2023': 342000, '2024': 395000, variacao: 15.5 },
    { mes: 'Jul', '2023': 298000, '2024': 325000, variacao: 9.1 },
    { mes: 'Ago', '2023': 275000, '2024': 298000, variacao: 8.4 },
    { mes: 'Set', '2023': 315000, '2024': 342000, variacao: 8.6 },
    { mes: 'Out', '2023': 375000, '2024': 425000, variacao: 13.3 },
    { mes: 'Nov', '2023': 420000, '2024': 480000, variacao: 14.3 },
    { mes: 'Dez', '2023': 335000, '2024': 365000, variacao: 9.0 }
  ];

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'Primavera': return <Leaf className="h-5 w-5 text-green-600" />;
      case 'Verão': return <Sun className="h-5 w-5 text-yellow-600" />;
      case 'Outono': return <CloudRain className="h-5 w-5 text-orange-600" />;
      case 'Inverno': return <Snowflake className="h-5 w-5 text-blue-600" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const totalVendas = monthlyData.reduce((acc, item) => acc + item.vendas, 0);
  const avgMonthly = totalVendas / 12;
  const maxMonth = monthlyData.reduce((prev, current) => (prev.vendas > current.vendas) ? prev : current);
  const minMonth = monthlyData.reduce((prev, current) => (prev.vendas < current.vendas) ? prev : current);
  const sazonalityIndex = ((maxMonth.vendas - minMonth.vendas) / avgMonthly * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Análise de Sazonalidade</h2>
        <div className="flex gap-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="conversao">Conversão</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs de Sazonalidade */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Índice de Sazonalidade</p>
                <p className="text-3xl font-bold">{sazonalityIndex}%</p>
                <p className="text-sm text-muted-foreground">Variação anual</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Melhor Mês</p>
                <p className="text-3xl font-bold">{maxMonth.mes}</p>
                <p className="text-sm text-green-600">R$ {maxMonth.vendas.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pior Mês</p>
                <p className="text-3xl font-bold">{minMonth.mes}</p>
                <p className="text-sm text-red-600">R$ {minMonth.vendas.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média Mensal</p>
                <p className="text-3xl font-bold">R$ {Math.round(avgMonthly / 1000)}K</p>
                <p className="text-sm text-muted-foreground">R$ {avgMonthly.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Sazonalidade */}
      <Card>
        <CardHeader>
          <CardTitle>Padrão Sazonal de {selectedMetric === 'vendas' ? 'Vendas' : selectedMetric === 'leads' ? 'Leads' : 'Conversão'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                selectedMetric === 'vendas' ? `R$ ${Number(value).toLocaleString()}` : 
                selectedMetric === 'conversao' ? `${value}%` : value,
                selectedMetric === 'vendas' ? 'Vendas' : selectedMetric === 'leads' ? 'Leads' : 'Taxa de Conversão'
              ]} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#2563eb" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                name={selectedMetric === 'vendas' ? 'Vendas' : selectedMetric === 'leads' ? 'Leads' : 'Conversão'}
              />
              <Line 
                type="monotone" 
                dataKey="sazonalidade" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={false}
                name="Índice Sazonal"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análise por Estação */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Estação do Ano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasonalAnalysis.map((season, index) => {
              const IconComponent = season.icone;
              return (
                <div key={index} className="p-4 border rounded-lg text-center">
                  <div className="flex justify-center mb-3">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h4 className="font-medium mb-2">{season.estacao}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {(season.vendas / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-muted-foreground">Vendas Totais</p>
                    </div>
                    <div>
                      <Badge variant={season.crescimento > 0 ? "default" : "destructive"}>
                        {season.crescimento > 0 ? '+' : ''}{season.crescimento}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">vs média anual</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{season.leads} leads</p>
                      <p className="text-xs text-muted-foreground">Melhor: {season.melhorMes}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparação Ano a Ano */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação Ano a Ano (2023 vs 2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearOverYearComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString()}`,
                name
              ]} />
              <Legend />
              <Bar dataKey="2023" fill="#94a3b8" name="2023" />
              <Bar dataKey="2024" fill="#2563eb" name="2024" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">+13.2%</p>
                <p className="text-sm text-muted-foreground">Crescimento Médio</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">+R$ 485K</p>
                <p className="text-sm text-muted-foreground">Incremento Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">Q2</p>
                <p className="text-sm text-muted-foreground">Melhor Trimestre</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sazonalidade por Produto */}
      <Card>
        <CardHeader>
          <CardTitle>Sazonalidade por Produto (Análise Trimestral)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Produto</th>
                  <th className="text-right p-3">Q1</th>
                  <th className="text-right p-3">Q2</th>
                  <th className="text-right p-3">Q3</th>
                  <th className="text-right p-3">Q4</th>
                  <th className="text-center p-3">Pico</th>
                  <th className="text-right p-3">Variação</th>
                </tr>
              </thead>
              <tbody>
                {productSeasonality.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{product.produto}</td>
                    <td className="p-3 text-right">R$ {product.q1.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium text-green-600">R$ {product.q2.toLocaleString()}</td>
                    <td className="p-3 text-right">R$ {product.q3.toLocaleString()}</td>
                    <td className="p-3 text-right">R$ {product.q4.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <Badge variant="default">{product.pico}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Badge variant={product.variacao > 20 ? "default" : "secondary"}>
                        {product.variacao}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Insights de Sazonalidade:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Pico de vendas concentrado no Q2 (Outono) para todos os produtos</li>
              <li>• Lixeira L4090 apresenta maior variação sazonal (26.4%)</li>
              <li>• Período de menor demanda: Q3 (Inverno) - ideal para manutenção e estoque</li>
              <li>• Recomendação: aumentar estoque em março para atender demanda do Q2</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
