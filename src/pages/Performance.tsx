
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Users, 
  DollarSign,
  Target,
  Clock,
  Zap,
  RefreshCw
} from "lucide-react";

const Performance = () => {
  const [dateRange, setDateRange] = useState('30d');

  // Dados de performance do sistema
  const systemMetrics = [
    {
      title: "Tempo de Resposta",
      value: "285ms",
      change: "-12%",
      status: "good",
      icon: Clock
    },
    {
      title: "Uptime",
      value: "99.9%",
      change: "+0.1%",
      status: "excellent",
      icon: Activity
    },
    {
      title: "Usuários Ativos",
      value: "1,245",
      change: "+18%",
      status: "good",
      icon: Users
    },
    {
      title: "Transações/min",
      value: "156",
      change: "+5%",
      status: "good",
      icon: Zap
    }
  ];

  // Dados de performance de vendas
  const salesPerformance = [
    { month: 'Jan', vendas: 285000, meta: 300000, conversao: 24 },
    { month: 'Fev', vendas: 320000, meta: 300000, conversao: 28 },
    { month: 'Mar', vendas: 298000, meta: 300000, conversao: 22 },
    { month: 'Abr', vendas: 410000, meta: 350000, conversao: 31 },
    { month: 'Mai', vendas: 458000, meta: 400000, conversao: 35 },
    { month: 'Jun', vendas: 395000, meta: 400000, conversao: 29 }
  ];

  const teamPerformance = [
    { name: 'Carlos Silva', vendas: 125000, meta: 100000, conversao: 32 },
    { name: 'Ana Oliveira', vendas: 98000, meta: 90000, conversao: 28 },
    { name: 'João Santos', vendas: 87000, meta: 85000, conversao: 25 },
    { name: 'Maria Costa', vendas: 112000, meta: 95000, conversao: 30 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "warning": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return "text-green-600";
    if (change.startsWith('-')) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Performance do Sistema</h1>
                  <p className="text-muted-foreground">Monitore a performance técnica e comercial</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
              </div>
            </div>

            <Tabs defaultValue="system" className="space-y-6">
              <TabsList>
                <TabsTrigger value="system">Sistema</TabsTrigger>
                <TabsTrigger value="sales">Vendas</TabsTrigger>
                <TabsTrigger value="team">Equipe</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="system" className="space-y-6">
                {/* Métricas do Sistema */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {systemMetrics.map((metric, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                            <p className={`text-3xl font-bold ${getStatusColor(metric.status)}`}>
                              {metric.value}
                            </p>
                            <p className={`text-xs ${getChangeColor(metric.change)}`}>
                              {metric.change} vs período anterior
                            </p>
                          </div>
                          <metric.icon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Gráfico de Performance do Sistema */}
                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Sistema - Últimos 30 dias</CardTitle>
                    <CardDescription>Monitoramento em tempo real da infraestrutura</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="conversao" stroke="#2563eb" strokeWidth={3} name="Taxa de Conversão %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Status dos Serviços */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status dos Serviços</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "API Principal", status: "operational", uptime: "99.9%" },
                        { name: "Base de Dados", status: "operational", uptime: "99.8%" },
                        { name: "Sistema de Email", status: "operational", uptime: "99.7%" },
                        { name: "CDN", status: "operational", uptime: "99.9%" },
                        { name: "Sistema de Backup", status: "operational", uptime: "100%" }
                      ].map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium">{service.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Operacional
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Uptime: {service.uptime}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sales" className="space-y-6">
                {/* Performance de Vendas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance de Vendas vs Metas</CardTitle>
                    <CardDescription>Comparativo mensal de vendas realizadas e metas estabelecidas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value, name) => [
                            `R$ ${value.toLocaleString()}`,
                            name === 'vendas' ? 'Vendas Realizadas' : 'Meta'
                          ]} />
                          <Legend />
                          <Bar dataKey="vendas" fill="#2563eb" name="Vendas Realizadas" />
                          <Bar dataKey="meta" fill="#94a3b8" name="Meta" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* KPIs de Vendas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                          <p className="text-3xl font-bold">R$ 8.450</p>
                          <p className="text-xs text-green-600">+12% vs mês anterior</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                          <p className="text-3xl font-bold">29%</p>
                          <p className="text-xs text-green-600">+3% vs mês anterior</p>
                        </div>
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Crescimento MoM</p>
                          <p className="text-3xl font-bold">+18%</p>
                          <p className="text-xs text-green-600">Acima da meta (15%)</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance da Equipe</CardTitle>
                    <CardDescription>Ranking de vendedores do mês</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamPerformance.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.conversao}% conversão
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              R$ {member.vendas.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Meta: R$ {member.meta.toLocaleString()}
                            </div>
                            <Badge variant="outline" className={
                              member.vendas >= member.meta ? 
                              "bg-green-100 text-green-800" : 
                              "bg-yellow-100 text-yellow-800"
                            }>
                              {member.vendas >= member.meta ? "Meta atingida" : "Abaixo da meta"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Relatórios Disponíveis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          "Performance Mensal Detalhada",
                          "Análise de Tendências",
                          "Comparativo Ano a Ano",
                          "Relatório de Eficiência",
                          "KPIs Consolidados"
                        ].map((report, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded">
                            <span>{report}</span>
                            <Button size="sm" variant="outline">
                              Gerar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Alertas e Notificações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <div className="font-medium text-green-800">Sistema Operacional</div>
                          <div className="text-sm text-green-600">Todos os serviços funcionando normalmente</div>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <div className="font-medium text-blue-800">Meta do Mês</div>
                          <div className="text-sm text-blue-600">85% da meta mensal atingida</div>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <div className="font-medium text-blue-800">Backup Agendado</div>
                          <div className="text-sm text-blue-600">Próximo backup em 2 horas</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Performance;
