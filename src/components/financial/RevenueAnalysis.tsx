
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react";

export const RevenueAnalysis = () => {
  const [period, setPeriod] = useState('month');

  // Dados de receita por canal baseados na planilha
  const channelRevenue = [
    { channel: 'Site', current: 86728.00, previous: 78450.00, growth: 10.5, transactions: 265 },
    { channel: 'Mercado Livre CNPJ', current: 64739.00, previous: 59200.00, growth: 9.4, transactions: 193 },
    { channel: 'Madeira Madeira', current: 7971.67, previous: 6850.00, growth: 16.4, transactions: 4 },
    { channel: 'VIA', current: 2495.42, previous: 2100.00, growth: 18.8, transactions: 3 },
    { channel: 'Comercial', current: 22093.86, previous: 25000.00, growth: -11.6, transactions: 8 }
  ];

  // Dados mensais de receita
  const monthlyRevenue = [
    { month: 'Jan', faturado: 2239.73, vendas: 265, ticketMedio: 327.30 },
    { month: 'Fev', faturado: 119818.19, vendas: 193, ticketMedio: 620.56 },
    { month: 'Mar', faturado: 90605.95, vendas: 230, ticketMedio: 394.00 },
    { month: 'Abr', faturado: 3390.54, vendas: 4, ticketMedio: 847.63 },
    { month: 'Mai', faturado: 72505.00, vendas: 3, ticketMedio: 24168.33 }
  ];

  // Top produtos baseados nos dados da planilha
  const topProducts = [
    { product: 'Pato Branco Shopping Empreendimentos', revenue: 5694.44, quantity: 3, category: 'Site' },
    { product: 'Condomínio Edifício Ester Luiz', revenue: 280.47, quantity: 1, category: 'Site' },
    { product: 'Bruno Moro', revenue: 1987.92, quantity: 4, category: 'Via' },
    { product: 'Condomínio Alpha Vita', revenue: 1586.22, quantity: 4, category: 'Site' },
    { product: 'Caroline Corsea', revenue: 271.25, quantity: 1, category: 'Site' }
  ];

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
            <div className="text-2xl font-bold text-green-600">R$ 183.954,73</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +8.2% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">695</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12.5% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">R$ 264,66</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +5.8% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Melhor Canal</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Site</div>
            <div className="text-xs text-muted-foreground">
              47.1% da receita total
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
