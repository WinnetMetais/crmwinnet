
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  GitCompare,
  Snowflake
} from "lucide-react";
import { SalesStats } from "@/components/sales/SalesStats";
import { SalesFunnelChart } from "@/components/sales/SalesFunnelChart";
import { SalesDetailedDashboard } from "@/components/analysis/SalesDetailedDashboard";
import { LeadsConversionReport } from "@/components/analysis/LeadsConversionReport";
import { SeasonalityAnalysis } from "@/components/analysis/SeasonalityAnalysis";
import { PeriodComparison } from "@/components/analysis/PeriodComparison";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Analysis = () => {
  const [dateRange, setDateRange] = useState('30d');

  // Dados mock para análises
  const salesTrendData = [
    { month: 'Jan', vendas: 285000, orcamentos: 45, conversao: 24 },
    { month: 'Fev', vendas: 320000, orcamentos: 52, conversao: 28 },
    { month: 'Mar', vendas: 298000, orcamentos: 48, conversao: 22 },
    { month: 'Abr', vendas: 410000, orcamentos: 62, conversao: 31 },
    { month: 'Mai', vendas: 458000, orcamentos: 68, conversao: 35 },
    { month: 'Jun', vendas: 395000, orcamentos: 58, conversao: 29 }
  ];

  const productPerformanceData = [
    { produto: 'Lixeira L4090', vendas: 125000, margem: 68, volume: 35 },
    { produto: 'Lixeira L1618', vendas: 95000, margem: 72, volume: 180 },
    { produto: 'Lixeira L40120', vendas: 85000, margem: 65, volume: 24 },
    { produto: 'Lixeira L3020', vendas: 75000, margem: 70, volume: 45 },
    { produto: 'Lixeira L25', vendas: 68000, margem: 74, volume: 95 }
  ];

  const customerSegmentData = [
    { segmento: 'Empresas Grandes', value: 35, color: '#0088FE' },
    { segmento: 'PMEs', value: 45, color: '#00C49F' },
    { segmento: 'Órgãos Públicos', value: 20, color: '#FFBB28' }
  ];

  const roiData = [
    { cliente: 'Metalúrgica ABC', investimento: 45000, retorno: 125000, roi: 178 },
    { cliente: 'Empresa XYZ', investimento: 32000, retorno: 89000, roi: 178 },
    { cliente: 'Indústria DEF', investimento: 28000, retorno: 72000, roi: 157 },
    { cliente: 'Corporação GHI', investimento: 55000, retorno: 138000, roi: 151 }
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-white hover:bg-white/10" />
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8" />
                  <div>
                    <h1 className="text-3xl font-bold">Análises Avançadas - Winnet Metais</h1>
                    <p className="text-blue-100">Dashboards e Relatórios Detalhados</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 items-center">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="12m">Último ano</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* KPIs Principais */}
            <SalesStats />

            <Tabs defaultValue="dashboard" className="space-y-6 mt-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="conversao">Conversão</TabsTrigger>
                <TabsTrigger value="tendencias">Tendências</TabsTrigger>
                <TabsTrigger value="sazonalidade">Sazonalidade</TabsTrigger>
                <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
                <TabsTrigger value="roi">ROI</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <SalesDetailedDashboard 
                  dateRange={dateRange} 
                  onDateRangeChange={setDateRange} 
                />
              </TabsContent>

              <TabsContent value="conversao" className="space-y-6">
                <LeadsConversionReport />
              </TabsContent>

              <TabsContent value="tendencias" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Tendência de Vendas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsLineChart data={salesTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value, name) => [
                            name === 'vendas' ? `R$ ${value.toLocaleString()}` : value,
                            name === 'vendas' ? 'Vendas' : name === 'orcamentos' ? 'Orçamentos' : 'Conversão %'
                          ]} />
                          <Legend />
                          <Line type="monotone" dataKey="vendas" stroke="#2563eb" strokeWidth={3} />
                          <Line type="monotone" dataKey="conversao" stroke="#16a34a" strokeWidth={2} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Funil de Vendas Detalhado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SalesFunnelChart detailed={true} />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Performance de Produtos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={productPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="produto" angle={-45} textAnchor="end" height={100} />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="vendas" fill="#2563eb" name="Vendas (R$)" />
                        <Bar yAxisId="right" dataKey="margem" fill="#16a34a" name="Margem %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sazonalidade" className="space-y-6">
                <SeasonalityAnalysis />
              </TabsContent>

              <TabsContent value="comparativo" className="space-y-6">
                <PeriodComparison />
              </TabsContent>

              <TabsContent value="roi" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Segmentação de Clientes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={customerSegmentData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({segmento, value}) => `${segmento}: ${value}%`}
                          >
                            {customerSegmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Clientes por Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">Metalúrgica ABC Ltda</p>
                            <p className="text-sm text-muted-foreground">125 pedidos</p>
                          </div>
                          <span className="font-bold text-green-600">R$ 385.000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">Indústria XYZ S.A.</p>
                            <p className="text-sm text-muted-foreground">89 pedidos</p>
                          </div>
                          <span className="font-bold text-green-600">R$ 298.000</span>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">Empresa DEF Ltda</p>
                            <p className="text-sm text-muted-foreground">67 pedidos</p>
                          </div>
                          <span className="font-bold text-green-600">R$ 245.000</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      ROI por Cliente - Análise de Rentabilidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Cliente</th>
                            <th className="text-right p-3">Investimento</th>
                            <th className="text-right p-3">Retorno</th>
                            <th className="text-right p-3">ROI %</th>
                            <th className="text-right p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roiData.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">{item.cliente}</td>
                              <td className="p-3 text-right">R$ {item.investimento.toLocaleString()}</td>
                              <td className="p-3 text-right font-medium text-green-600">
                                R$ {item.retorno.toLocaleString()}
                              </td>
                              <td className="p-3 text-right font-bold">{item.roi}%</td>
                              <td className="p-3 text-right">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  item.roi > 160 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.roi > 160 ? 'Excelente' : 'Bom'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analysis;
