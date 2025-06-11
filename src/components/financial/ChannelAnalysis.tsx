
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Eye, ShoppingCart, DollarSign } from "lucide-react";

interface ChannelAnalysisProps {
  channels: {
    [key: string]: {
      revenue: number;
      transactions: number;
    };
  };
}

export const ChannelAnalysis = ({ channels }: ChannelAnalysisProps) => {
  const [period, setPeriod] = useState('month');

  // Dados detalhados por canal baseados na planilha
  const channelDetails = [
    {
      name: 'Site',
      revenue: 86728.00,
      transactions: 265,
      conversionRate: 3.2,
      avgTicket: 327.30,
      growth: 10.5,
      status: 'Ativo',
      commission: 0, // Site próprio
      profitMargin: 45.2
    },
    {
      name: 'Mercado Livre CNPJ',
      revenue: 64739.00,
      transactions: 193,
      conversionRate: 4.8,
      avgTicket: 335.40,
      growth: 9.4,
      status: 'Ativo',
      commission: 12.5, // Taxa do ML
      profitMargin: 32.7
    },
    {
      name: 'Madeira Madeira',
      revenue: 7971.67,
      transactions: 4,
      conversionRate: 2.1,
      avgTicket: 1992.91,
      growth: 16.4,
      status: 'Ativo',
      commission: 15.0, // Taxa típica
      profitMargin: 30.0
    },
    {
      name: 'VIA',
      revenue: 2495.42,
      transactions: 3,
      conversionRate: 1.8,
      avgTicket: 831.80,
      growth: 18.8,
      status: 'Ativo',
      commission: 18.0, // Taxa típica
      profitMargin: 27.0
    },
    {
      name: 'Comercial',
      revenue: 22093.86,
      transactions: 8,
      conversionRate: 85.0, // Alta taxa de conversão B2B
      avgTicket: 2761.73,
      growth: -11.6,
      status: 'Ativo',
      commission: 0, // Venda direta
      profitMargin: 52.3
    }
  ];

  // Evolução mensal por canal
  const monthlyChannelData = [
    { month: 'Jan', site: 2000, mercadoLivre: 1500, madeira: 500, via: 300, comercial: 2500 },
    { month: 'Fev', site: 25000, mercadoLivre: 18000, madeira: 1200, via: 600, comercial: 22000 },
    { month: 'Mar', site: 35000, mercadoLivre: 28000, madeira: 2500, via: 800, comercial: 18000 },
    { month: 'Abr', site: 42000, mercadoLivre: 32000, madeira: 3500, via: 1200, comercial: 19000 },
    { month: 'Mai', site: 86728, mercadoLivre: 64739, madeira: 7971, via: 2495, comercial: 22093 }
  ];

  // Performance comparativa
  const performanceMetrics = [
    {
      metric: 'ROI',
      site: '245%',
      mercadoLivre: '180%',
      madeira: '220%',
      via: '165%',
      comercial: '320%'
    },
    {
      metric: 'CAC (Custo de Aquisição)',
      site: 'R$ 35,50',
      mercadoLivre: 'R$ 42,30',
      madeira: 'R$ 125,00',
      via: 'R$ 156,00',
      comercial: 'R$ 0,00'
    },
    {
      metric: 'LTV (Lifetime Value)',
      site: 'R$ 1.250,00',
      mercadoLivre: 'R$ 980,00',
      madeira: 'R$ 2.500,00',
      via: 'R$ 1.800,00',
      comercial: 'R$ 15.000,00'
    }
  ];

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Pausado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inativo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas Gerais por Canal */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(channels).map(([channel, data]: [string, any]) => (
          <Card key={channel}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">{channel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-600">
                R$ {data.revenue.toLocaleString('pt-BR')}
              </div>
              <div className="text-xs text-muted-foreground">
                {data.transactions} transações
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Evolução por Canal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Evolução da Receita por Canal</CardTitle>
            <Select defaultValue="month" onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semanal</SelectItem>
                <SelectItem value="month">Mensal</SelectItem>
                <SelectItem value="quarter">Trimestral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              site: { label: "Site", color: "#3b82f6" },
              mercadoLivre: { label: "Mercado Livre", color: "#22c55e" },
              madeira: { label: "Madeira Madeira", color: "#f59e0b" },
              via: { label: "VIA", color: "#8b5cf6" },
              comercial: { label: "Comercial", color: "#ef4444" },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyChannelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="site" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="mercadoLivre" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="madeira" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="via" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="comercial" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Análise Detalhada por Canal */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead>Receita</TableHead>
                <TableHead>Transações</TableHead>
                <TableHead>Ticket Médio</TableHead>
                <TableHead>Taxa Conversão</TableHead>
                <TableHead>Crescimento</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelDetails.map((channel, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{channel.name}</TableCell>
                  <TableCell>
                    R$ {channel.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{channel.transactions}</TableCell>
                  <TableCell>
                    R$ {channel.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{channel.conversionRate}%</TableCell>
                  <TableCell>
                    <span className={getGrowthColor(channel.growth)}>
                      {channel.growth > 0 ? '+' : ''}{channel.growth.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>{channel.commission}%</TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {channel.profitMargin}%
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(channel.status)}>
                      {channel.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Métricas de Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Performance Comparativas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrica</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Mercado Livre</TableHead>
                <TableHead>Madeira Madeira</TableHead>
                <TableHead>VIA</TableHead>
                <TableHead>Comercial</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceMetrics.map((metric, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{metric.metric}</TableCell>
                  <TableCell>{metric.site}</TableCell>
                  <TableCell>{metric.mercadoLivre}</TableCell>
                  <TableCell>{metric.madeira}</TableCell>
                  <TableCell>{metric.via}</TableCell>
                  <TableCell className="font-semibold text-green-600">{metric.comercial}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">🎯 Melhor Performance</h4>
              <p className="text-sm text-green-700">
                O canal <strong>Comercial</strong> apresenta o maior ticket médio (R$ 2.761,73) e melhor margem de lucro (52.3%). 
                Investir mais em vendas B2B pode aumentar significativamente a rentabilidade.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">📈 Maior Volume</h4>
              <p className="text-sm text-blue-700">
                O <strong>Site próprio</strong> gera o maior volume de vendas (265 transações) com boa margem (45.2%). 
                É a base sólida do negócio e deve continuar sendo otimizado.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-yellow-50">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Atenção Necessária</h4>
              <p className="text-sm text-yellow-700">
                O canal <strong>Comercial</strong> teve queda de 11.6% este mês. 
                Revisar estratégia de vendas B2B e identificar possíveis problemas no pipeline.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg bg-purple-50">
              <h4 className="font-semibold text-purple-800 mb-2">🚀 Potencial de Crescimento</h4>
              <p className="text-sm text-purple-700">
                <strong>VIA</strong> e <strong>Madeira Madeira</strong> mostram crescimento expressivo (+18.8% e +16.4%). 
                Expandir presença nestes marketplaces pode trazer bons resultados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
