import React, { useState, useMemo } from 'react';
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

  // Processar dados dos canais para análise
  const channelAnalysis = useMemo(() => {
    if (!channels || Object.keys(channels).length === 0) {
      return {
        channelDetails: [],
        totalRevenue: 0,
        totalTransactions: 0
      };
    }

    const channelDetails = Object.entries(channels).map(([name, data]) => ({
      name,
      revenue: data.revenue,
      transactions: data.transactions,
      avgTicket: data.transactions > 0 ? data.revenue / data.transactions : 0,
      conversionRate: Math.random() * 5 + 1, // Simulado - pode ser integrado com dados reais
      status: 'Ativo',
      profitMargin: Math.random() * 20 + 30 // Simulado
    }));

    const totalRevenue = Object.values(channels).reduce((sum, channel) => sum + channel.revenue, 0);
    const totalTransactions = Object.values(channels).reduce((sum, channel) => sum + channel.transactions, 0);

    return {
      channelDetails,
      totalRevenue,
      totalTransactions
    };
  }, [channels]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-success/15 text-success';
      case 'Pausado':
        return 'bg-warning/15 text-warning';
      case 'Inativo':
        return 'bg-destructive/15 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'];

  if (Object.keys(channels).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Canais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma receita por canal encontrada. Cadastre transações com canais especificados para ver a análise.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Gerais por Canal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.entries(channels).map(([channel, data], index) => (
          <Card key={channel}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">{channel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-600">
                R$ {data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground">
                {data.transactions} transações
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {channelAnalysis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">
              Todos os canais
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {channelAnalysis.totalTransactions}
            </div>
            <div className="text-xs text-muted-foreground">
              Vendas realizadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {channelAnalysis.totalTransactions > 0 
                ? (channelAnalysis.totalRevenue / channelAnalysis.totalTransactions).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                : '0,00'
              }
            </div>
            <div className="text-xs text-muted-foreground">
              Valor médio por venda
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Comparação de Canais */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: "Receita", color: "#3b82f6" },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelAnalysis.channelDetails}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [
                      `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      name
                    ]}
                  />} 
                />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelAnalysis.channelDetails.map((channel, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{channel.name}</TableCell>
                  <TableCell>
                    R$ {channel.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{channel.transactions}</TableCell>
                  <TableCell>
                    R$ {channel.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights dos Canais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channelAnalysis.channelDetails.length > 0 && (
              <>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Melhor Canal</h4>
                  <p className="text-sm text-green-700">
                    O canal <strong>{channelAnalysis.channelDetails[0]?.name}</strong> está gerando 
                    R$ {channelAnalysis.channelDetails[0]?.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                    em receitas com {channelAnalysis.channelDetails[0]?.transactions} transações.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 Distribuição</h4>
                  <p className="text-sm text-blue-700">
                    {channelAnalysis.channelDetails.length} canais ativos geraram um total de 
                    R$ {channelAnalysis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                    em {channelAnalysis.totalTransactions} transações.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};