import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Download, TrendingUp, TrendingDown, Target, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";

// Sample data - in a real app, this would come from an API
const campaignData = [
  { name: 'Jan', interna: 4000, agencia4k: 2400, conversoes: 240 },
  { name: 'Feb', interna: 3000, agencia4k: 1398, conversoes: 210 },
  { name: 'Mar', interna: 2000, agencia4k: 9800, conversoes: 290 },
  { name: 'Apr', interna: 2780, agencia4k: 3908, conversoes: 200 },
  { name: 'May', interna: 1890, agencia4k: 4800, conversoes: 218 },
  { name: 'Jun', interna: 2390, agencia4k: 3800, conversoes: 250 },
  { name: 'Jul', interna: 3490, agencia4k: 4300, conversoes: 210 },
];

const funnelData = [
  { name: 'Awareness', value: 4000, color: '#8884d8' },
  { name: 'Consideração', value: 3000, color: '#83a6ed' },
  { name: 'Conversão', value: 2000, color: '#8dd1e1' },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const kpiData = [
  { metric: 'ROI', valor: '245%', status: 'aumento', comparacao: '+15%' },
  { metric: 'CPA', valor: 'R$ 48,50', status: 'reducao', comparacao: '-8%' },
  { metric: 'Taxa de Conversão', valor: '3.2%', status: 'aumento', comparacao: '+0.5%' },
  { metric: 'Valor Médio', valor: 'R$ 320,00', status: 'aumento', comparacao: '+12%' },
];

const campanhasRecentes = [
  { nome: 'Promoção Verão', plataforma: 'Google Ads', impressoes: '45.3K', cliques: '5.2K', ctr: '11.5%', conversoes: '320' },
  { nome: 'Remarketing Clientes', plataforma: 'Facebook', impressoes: '30.1K', cliques: '4.8K', ctr: '15.9%', conversoes: '180' },
  { nome: 'Campanha Produtos Novos', plataforma: 'Instagram', impressoes: '28.7K', cliques: '3.1K', ctr: '10.8%', conversoes: '145' },
  { nome: 'LinkedIn B2B', plataforma: 'LinkedIn', impressoes: '12.5K', cliques: '980', ctr: '7.8%', conversoes: '35' },
];

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Dashboard de Marketing - Winnet Metais</h1>
              </div>
              <div className="flex space-x-4 items-center">
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="12m">Último ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
            
            {/* Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiData.map((kpi, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardDescription>{kpi.metric}</CardDescription>
                    <CardTitle className="text-2xl flex items-center">
                      {kpi.valor}
                      {kpi.status === 'aumento' ? (
                        <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={kpi.status === 'aumento' ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                      {kpi.comparacao} em relação ao período anterior
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Fontes de Tráfego */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Campanhas (Cliques)</CardTitle>
                  <CardDescription>Comparativo entre campanhas internas e agência 4K</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={campaignData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="interna" name="Campanhas Internas" fill="#8884d8" />
                        <Bar dataKey="agencia4k" name="Agência 4K" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Análise de Funil */}
              <Card>
                <CardHeader>
                  <CardTitle>Funil de Vendas</CardTitle>
                  <CardDescription>Distribuição por etapas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={funnelData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Desempenho das Campanhas */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Desempenho das Campanhas Recentes</CardTitle>
                    <CardDescription>Impressões, cliques, CTR e conversões</CardDescription>
                  </div>
                  <Select defaultValue="todas">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Todas as plataformas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as plataformas</SelectItem>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campanha</TableHead>
                      <TableHead>Plataforma</TableHead>
                      <TableHead>Impressões</TableHead>
                      <TableHead>Cliques</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>Conversões</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campanhasRecentes.map((campanha, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{campanha.nome}</TableCell>
                        <TableCell>{campanha.plataforma}</TableCell>
                        <TableCell>{campanha.impressoes}</TableCell>
                        <TableCell>{campanha.cliques}</TableCell>
                        <TableCell>{campanha.ctr}</TableCell>
                        <TableCell>{campanha.conversoes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Segmentação de Público */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Segmentação de Público</CardTitle>
                <CardDescription>Análise por comportamento, localização e dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="comportamento">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="comportamento">Comportamento</TabsTrigger>
                    <TabsTrigger value="localizacao">Localização</TabsTrigger>
                    <TabsTrigger value="dispositivo">Dispositivo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="comportamento">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          {name: 'Novos', valor: 65},
                          {name: 'Recorrentes', valor: 35},
                          {name: 'Alta Engaj.', valor: 28},
                          {name: 'Baixo Engaj.', valor: 72}
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="valor" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="localizacao">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {name: 'São Paulo', value: 45},
                              {name: 'Rio de Janeiro', value: 20},
                              {name: 'Minas Gerais', value: 15},
                              {name: 'Outros', value: 20}
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, value}) => `${name}: ${value}%`}
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dispositivo">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {name: 'Mobile', value: 65},
                              {name: 'Desktop', value: 30},
                              {name: 'Tablet', value: 5}
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, value}) => `${name}: ${value}%`}
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Planejamento de Conteúdo */}
            <Card>
              <CardHeader>
                <CardTitle>Planejamento de Conteúdo</CardTitle>
                <CardDescription>Postagens da agência 4K</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Conecte a API de Marketing para visualizar o planejamento de conteúdo</p>
                  <Button className="mt-4" asChild>
                    <a href="/config">Configurar Integrações</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
