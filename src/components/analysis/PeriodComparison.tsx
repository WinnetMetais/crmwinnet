
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export const PeriodComparison = () => {
  const [comparisonType, setComparisonType] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const monthlyComparison = [
    { periodo: 'Jan 2024', atual: 285000, anterior: 245000, variacao: 16.3, leads: 95, conversion: 24.2 },
    { periodo: 'Fev 2024', atual: 320000, anterior: 285000, variacao: 12.3, leads: 112, conversion: 28.1 },
    { periodo: 'Mar 2024', atual: 380000, anterior: 325000, variacao: 16.9, leads: 135, conversion: 31.8 },
    { periodo: 'Abr 2024', atual: 410000, anterior: 355000, variacao: 15.5, leads: 142, conversion: 34.5 },
    { periodo: 'Mai 2024', atual: 458000, anterior: 398000, variacao: 15.1, leads: 158, conversion: 37.2 },
    { periodo: 'Jun 2024', atual: 395000, anterior: 342000, variacao: 15.5, leads: 128, conversion: 29.1 }
  ];

  const quarterlyComparison = [
    { periodo: 'Q1 2024', atual: 985000, anterior: 855000, variacao: 15.2, leads: 342, conversion: 28.0 },
    { periodo: 'Q2 2024', atual: 1263000, anterior: 1095000, variacao: 15.3, leads: 428, conversion: 33.6 },
    { periodo: 'Q3 2024', atual: 965000, anterior: 888000, variacao: 8.7, leads: 302, conversion: 25.4 },
    { periodo: 'Q4 2024', atual: 1270000, anterior: 1130000, variacao: 12.4, leads: 438, conversion: 32.1 }
  ];

  const yearlyComparison = [
    { periodo: '2024', atual: 4483000, anterior: 3968000, variacao: 13.0, leads: 1510, conversion: 29.8 },
    { periodo: '2023', atual: 3968000, anterior: 3520000, variacao: 12.7, leads: 1342, conversion: 26.4 },
    { periodo: '2022', atual: 3520000, anterior: 3125000, variacao: 12.6, leads: 1189, conversion: 23.8 }
  ];

  const detailedMetrics = [
    { 
      metrica: 'Vendas Totais',
      atual: 'R$ 4.48M',
      anterior: 'R$ 3.97M',
      variacao: 13.0,
      status: 'up'
    },
    { 
      metrica: 'Ticket Médio',
      atual: 'R$ 8.450',
      anterior: 'R$ 7.680',
      variacao: 10.0,
      status: 'up'
    },
    { 
      metrica: 'Taxa de Conversão',
      atual: '29.8%',
      anterior: '26.4%',
      variacao: 12.9,
      status: 'up'
    },
    { 
      metrica: 'Leads Gerados',
      atual: '1.510',
      anterior: '1.342',
      variacao: 12.5,
      status: 'up'
    },
    { 
      metrica: 'Tempo Médio Fechamento',
      atual: '14 dias',
      anterior: '16 dias',
      variacao: -12.5,
      status: 'up'
    },
    { 
      metrica: 'CAC (Custo Aquisição)',
      atual: 'R$ 185',
      anterior: 'R$ 210',
      variacao: -11.9,
      status: 'up'
    },
    { 
      metrica: 'LTV (Lifetime Value)',
      atual: 'R$ 24.500',
      anterior: 'R$ 22.100',
      variacao: 10.9,
      status: 'up'
    },
    { 
      metrica: 'Margem Média',
      atual: '68.5%',
      anterior: '65.2%',
      variacao: 5.1,
      status: 'up'
    }
  ];

  const performanceBySegment = [
    { 
      segmento: 'Empresas Grandes',
      atual: 1564000,
      anterior: 1342000,
      variacao: 16.5,
      participacao: 34.9
    },
    { 
      segmento: 'PMEs',
      atual: 2017000,
      anterior: 1785000,
      variacao: 13.0,
      participacao: 45.0
    },
    { 
      segmento: 'Órgãos Públicos',
      atual: 902000,
      anterior: 841000,
      variacao: 7.3,
      participacao: 20.1
    }
  ];

  const getCurrentData = () => {
    switch (comparisonType) {
      case 'month': return monthlyComparison;
      case 'quarter': return quarterlyComparison;
      case 'year': return yearlyComparison;
      default: return monthlyComparison;
    }
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (variation < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getVariationColor = (variation: number) => {
    if (variation > 10) return 'text-green-600';
    if (variation > 0) return 'text-green-500';
    if (variation > -5) return 'text-warning';
    return 'text-red-600';
  };

  const currentData = getCurrentData();
  const totalAtual = currentData.reduce((acc, item) => acc + item.atual, 0);
  const totalAnterior = currentData.reduce((acc, item) => acc + item.anterior, 0);
  const variacaoTotal = ((totalAtual - totalAnterior) / totalAnterior * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Comparativo de Períodos</h2>
        <div className="flex gap-4">
          <Select value={comparisonType} onValueChange={setComparisonType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="quarter">Trimestral</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Métricas</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="conversao">Conversão</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resumo Comparativo - {comparisonType === 'month' ? 'Mensal' : comparisonType === 'quarter' ? 'Trimestral' : 'Anual'}</span>
            <Badge variant={parseFloat(variacaoTotal) > 0 ? "default" : "destructive"} className="flex items-center gap-1">
              {getVariationIcon(parseFloat(variacaoTotal))}
              {variacaoTotal}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Período Atual</p>
              <p className="text-3xl font-bold text-blue-600">
                R$ {(totalAtual / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Período Anterior</p>
              <p className="text-3xl font-bold text-gray-600">
                R$ {(totalAnterior / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Crescimento</p>
              <p className={`text-3xl font-bold ${getVariationColor(parseFloat(variacaoTotal))}`}>
                {parseFloat(variacaoTotal) > 0 ? '+' : ''}{variacaoTotal}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Comparativa</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString()}`,
                name === 'atual' ? 'Período Atual' : 'Período Anterior'
              ]} />
              <Legend />
              <Bar dataKey="anterior" fill="#94a3b8" name="Período Anterior" />
              <Bar dataKey="atual" fill="#2563eb" name="Período Atual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Métricas Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo Detalhado de Métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {detailedMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{metric.metrica}</h4>
                  {metric.status === 'up' ? 
                    <TrendingUp className="h-4 w-4 text-green-600" /> : 
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold">{metric.atual}</p>
                  <p className="text-sm text-muted-foreground">vs {metric.anterior}</p>
                  <div className="flex items-center gap-1">
                    {getVariationIcon(metric.variacao)}
                    <span className={`text-sm font-medium ${getVariationColor(metric.variacao)}`}>
                      {metric.variacao > 0 ? '+' : ''}{metric.variacao}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance por Segmento */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo por Segmento de Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Segmento</th>
                  <th className="text-right p-3">Período Atual</th>
                  <th className="text-right p-3">Período Anterior</th>
                  <th className="text-right p-3">Variação</th>
                  <th className="text-right p-3">Participação</th>
                </tr>
              </thead>
              <tbody>
                {performanceBySegment.map((segment, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{segment.segmento}</td>
                    <td className="p-3 text-right font-medium">
                      R$ {(segment.atual / 1000).toFixed(0)}K
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      R$ {(segment.anterior / 1000).toFixed(0)}K
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {getVariationIcon(segment.variacao)}
                        <span className={`font-medium ${getVariationColor(segment.variacao)}`}>
                          {segment.variacao > 0 ? '+' : ''}{segment.variacao}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Badge variant="outline">{segment.participacao}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tendência de Crescimento */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Crescimento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="variacao" 
                stroke="#2563eb" 
                strokeWidth={3}
                name="Taxa de Crescimento %"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Insights do Período:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Crescimento consistente acima de 10% na maioria dos períodos</li>
              <li>• Melhor performance no Q2 com crescimento de 15.3%</li>
              <li>• Taxa de conversão melhorou 12.9% comparado ao período anterior</li>
              <li>• Redução no CAC de 11.9% indica maior eficiência em marketing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
