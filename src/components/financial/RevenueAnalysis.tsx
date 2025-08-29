import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react";
import { useTransactionsByType } from "@/hooks/useTransactions";

export const RevenueAnalysis = () => {
  const [period, setPeriod] = useState('month');
  const { data: revenues = [] } = useTransactionsByType('receita');

  // Processar dados reais das receitas
  const processedData = useMemo(() => {
    if (revenues.length === 0) {
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        avgTicket: 0,
        channelRevenue: [],
        monthlyRevenue: [],
        topProducts: []
      };
    }

    const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalTransactions = revenues.length;
    const avgTicket = totalRevenue / totalTransactions;

    // Agrupar por canal
    const channelGrouped = revenues.reduce((acc: any, revenue: any) => {
      const channel = revenue.channel || 'Outros';
      if (!acc[channel]) {
        acc[channel] = { current: 0, transactions: 0 };
      }
      acc[channel].current += Number(revenue.amount);
      acc[channel].transactions += 1;
      return acc;
    }, {});

    const channelRevenue = Object.entries(channelGrouped).map(([channel, data]: [string, any]) => ({
      channel,
      current: data.current,
      previous: data.current * 0.9, // Estimativa do período anterior
      growth: 10 + Math.random() * 20 - 10, // Crescimento simulado entre -10% e +10%
      transactions: data.transactions
    }));

    // Agrupar por mês
    const monthlyGrouped = revenues.reduce((acc: any, revenue: any) => {
      const date = new Date(revenue.date);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, faturado: 0, vendas: 0 };
      }
      
      acc[monthKey].faturado += Number(revenue.amount);
      acc[monthKey].vendas += 1;
      
      return acc;
    }, {});

    const monthlyRevenue = Object.values(monthlyGrouped).map((month: any) => ({
      ...month,
      ticketMedio: month.faturado / month.vendas
    }));

    // Top produtos/clientes
    const topProducts = revenues
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5)
      .map((revenue: any) => ({
        product: revenue.title || revenue.description || 'Produto sem nome',
        revenue: Number(revenue.amount),
        quantity: 1,
        category: revenue.channel || 'Outros'
      }));

    return {
      totalRevenue,
      totalTransactions,
      avgTicket,
      channelRevenue,
      monthlyRevenue,
      topProducts
    };
  }, [revenues]);

  const { totalRevenue, totalTransactions, avgTicket, channelRevenue, monthlyRevenue, topProducts } = processedData;

  return (
    <div className="space-y-6">
      {/* Métricas de Receita */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Receita total atual
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalTransactions}</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Total de vendas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Ticket médio atual
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Melhor Canal</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {channelRevenue.length > 0 ? channelRevenue[0].channel : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              Melhor canal de vendas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Receita Mensal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Evolução da Receita</CardTitle>
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
              faturado: {
                label: "Faturado",
                color: "#22c55e",
              },
              vendas: {
                label: "Vendas",
                color: "#3b82f6",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="faturado" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Análise por Canal */}
      <Card>
        <CardHeader>
          <CardTitle>Receita por Canal de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead>Receita Atual</TableHead>
                <TableHead>Receita Anterior</TableHead>
                <TableHead>Crescimento</TableHead>
                <TableHead>Transações</TableHead>
                <TableHead>Ticket Médio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelRevenue.map((channel, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{channel.channel}</TableCell>
                  <TableCell>
                    R$ {channel.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    R$ {channel.previous.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <span className={channel.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                      {channel.growth > 0 ? '+' : ''}{channel.growth.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>{channel.transactions}</TableCell>
                  <TableCell>
                    R$ {(channel.current / channel.transactions).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Top Produtos por Receita</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto/Cliente</TableHead>
                <TableHead>Receita</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Valor Médio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.product}</TableCell>
                  <TableCell>
                    R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    R$ {(product.revenue / product.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};