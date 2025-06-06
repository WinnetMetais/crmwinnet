
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Users, DollarSign, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface SalesDetailedDashboardProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export const SalesDetailedDashboard = ({ dateRange, onDateRangeChange }: SalesDetailedDashboardProps) => {
  const [selectedSeller, setSelectedSeller] = useState('all');

  const salesData = [
    { month: 'Jan', meta: 150000, realizado: 135000, conversao: 24, leads: 45 },
    { month: 'Fev', meta: 160000, realizado: 178000, conversao: 28, leads: 52 },
    { month: 'Mar', meta: 155000, realizado: 142000, conversao: 22, leads: 48 },
    { month: 'Abr', meta: 170000, realizado: 185000, conversao: 31, leads: 62 },
    { month: 'Mai', meta: 180000, realizado: 198000, conversao: 35, leads: 68 },
    { month: 'Jun', meta: 175000, realizado: 165000, conversao: 29, leads: 58 }
  ];

  const sellerPerformance = [
    { vendedor: 'João Silva', meta: 50000, realizado: 58000, comissao: 2900, deals: 12 },
    { vendedor: 'Maria Santos', meta: 45000, realizado: 52000, comissao: 2600, deals: 10 },
    { vendedor: 'Pedro Costa', meta: 40000, realizado: 38000, comissao: 1900, deals: 8 },
    { vendedor: 'Ana Lima', meta: 55000, realizado: 62000, comissao: 3100, deals: 14 }
  ];

  const productPerformance = [
    { produto: 'Lixeira L4090', vendas: 125000, margem: 68, volume: 35, roi: 180 },
    { produto: 'Lixeira L1618', vendas: 95000, margem: 72, volume: 180, roi: 165 },
    { produto: 'Lixeira L40120', vendas: 85000, margem: 65, volume: 24, roi: 175 },
    { produto: 'Lixeira L3020', vendas: 75000, margem: 70, volume: 45, roi: 160 }
  ];

  const totalMeta = salesData.reduce((acc, item) => acc + item.meta, 0);
  const totalRealizado = salesData.reduce((acc, item) => acc + item.realizado, 0);
  const performancePercent = ((totalRealizado / totalMeta) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Dashboard de Vendas Detalhado</h2>
        <div className="flex gap-4">
          <Select value={selectedSeller} onValueChange={setSelectedSeller}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Vendedores</SelectItem>
              <SelectItem value="joao">João Silva</SelectItem>
              <SelectItem value="maria">Maria Santos</SelectItem>
              <SelectItem value="pedro">Pedro Costa</SelectItem>
              <SelectItem value="ana">Ana Lima</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="12m">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance vs Meta</p>
                <p className="text-3xl font-bold">{performancePercent}%</p>
                <p className="text-sm text-muted-foreground">
                  R$ {totalRealizado.toLocaleString()} / R$ {totalMeta.toLocaleString()}
                </p>
              </div>
              {parseFloat(performancePercent) >= 100 ? 
                <TrendingUp className="h-8 w-8 text-green-600" /> : 
                <TrendingDown className="h-8 w-8 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-3xl font-bold">R$ 8.450</p>
                <p className="text-sm text-green-600">+12.5% vs período anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Conversão</p>
                <p className="text-3xl font-bold">28.4%</p>
                <p className="text-sm text-green-600">+3.2% vs período anterior</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ciclo de Vendas</p>
                <p className="text-3xl font-bold">14 dias</p>
                <p className="text-sm text-red-600">+2 dias vs período anterior</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Meta vs Realizado */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Mensal - Meta vs Realizado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `R$ ${Number(value).toLocaleString()}`,
                name === 'meta' ? 'Meta' : 'Realizado'
              ]} />
              <Legend />
              <Bar dataKey="meta" fill="#94a3b8" name="Meta" />
              <Bar dataKey="realizado" fill="#2563eb" name="Realizado" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance por Vendedor */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Vendedor</th>
                  <th className="text-right p-3">Meta</th>
                  <th className="text-right p-3">Realizado</th>
                  <th className="text-right p-3">Performance</th>
                  <th className="text-right p-3">Comissão</th>
                  <th className="text-right p-3">Deals</th>
                </tr>
              </thead>
              <tbody>
                {sellerPerformance.map((seller, index) => {
                  const performance = ((seller.realizado / seller.meta) * 100).toFixed(1);
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{seller.vendedor}</td>
                      <td className="p-3 text-right">R$ {seller.meta.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium">R$ {seller.realizado.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <Badge variant={parseFloat(performance) >= 100 ? "default" : "secondary"}>
                          {performance}%
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-green-600">R$ {seller.comissao.toLocaleString()}</td>
                      <td className="p-3 text-right">{seller.deals}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ROI por Produto */}
      <Card>
        <CardHeader>
          <CardTitle>ROI e Performance por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {productPerformance.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{product.produto}</h4>
                    <p className="text-sm text-muted-foreground">
                      Volume: {product.volume} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      R$ {product.vendas.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      Margem: {product.margem}% | ROI: {product.roi}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="produto" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="roi" fill="#16a34a" name="ROI %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
