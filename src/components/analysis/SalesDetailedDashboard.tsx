
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Users, DollarSign, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { salesService } from '@/services/sales';
import { toast } from '@/hooks/use-toast';

interface SalesDetailedDashboardProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export const SalesDetailedDashboard = ({ dateRange, onDateRangeChange }: SalesDetailedDashboardProps) => {
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [salesData, setSalesData] = useState<Array<Record<string, any>>>([]);
  const [sellerPerformance, setSellerPerformance] = useState<Array<Record<string, any>>>([]);
  const [productPerformance, setProductPerformance] = useState<Array<Record<string, any>>>([]);
  const [kpis, setKpis] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesData();
  }, [dateRange, selectedSeller]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const data = await salesService.getSalesData(dateRange, selectedSeller);
      setSalesData(data.salesData);
      setSellerPerformance(data.sellerPerformance);
      setProductPerformance(data.productPerformance);
      setKpis(data.kpis);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de vendas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Dashboard de Vendas Detalhado</h2>
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
                <p className="text-3xl font-bold">{kpis.performancePercent || '0'}%</p>
                <p className="text-sm text-muted-foreground">
                  R$ {(kpis.totalRealizado || 0).toLocaleString()} / R$ {(kpis.totalMeta || 0).toLocaleString()}
                </p>
              </div>
              {parseFloat(kpis.performancePercent || '0') >= 100 ? 
                <TrendingUp className="h-8 w-8 text-success" /> : 
                <TrendingDown className="h-8 w-8 text-destructive" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-3xl font-bold">R$ {(kpis.ticketMedio || 0).toLocaleString()}</p>
                <p className="text-sm text-success">+12.5% vs período anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Conversão</p>
                <p className="text-3xl font-bold">{(kpis.taxaConversao || 0).toFixed(1)}%</p>
                <p className="text-sm text-success">+3.2% vs período anterior</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ciclo de Vendas</p>
                <p className="text-3xl font-bold">{kpis.cicloVendas || 14} dias</p>
                <p className="text-sm text-destructive">+2 dias vs período anterior</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
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
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData} aria-label="Gráfico de Performance Mensal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `R$ ${Number(value).toLocaleString()}`,
                  name === 'meta' ? 'Meta' : 'Realizado'
                ]} />
                <Legend />
                <Bar dataKey="meta" fill="hsl(var(--muted))" name="Meta" />
                <Bar dataKey="realizado" fill="hsl(var(--primary))" name="Realizado" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Performance por Vendedor */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" role="grid" aria-label="Performance por Vendedor">
              <thead>
                <tr role="row" className="border-b">
                  <th role="columnheader" className="text-left p-3">Vendedor</th>
                  <th role="columnheader" className="text-right p-3">Meta</th>
                  <th role="columnheader" className="text-right p-3">Realizado</th>
                  <th role="columnheader" className="text-right p-3">Performance</th>
                  <th role="columnheader" className="text-right p-3">Comissão</th>
                  <th role="columnheader" className="text-right p-3">Deals</th>
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
                      <td className="p-3 text-right text-success">R$ {seller.comissao.toLocaleString()}</td>
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
                    <div className="font-bold text-success">
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
                <BarChart data={productPerformance} aria-label="ROI por Produto">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="produto" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="roi" fill="hsl(var(--success))" name="ROI %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
