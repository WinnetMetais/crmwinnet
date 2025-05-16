
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, Award, Target, Activity, Calendar } from "lucide-react";

const Performance = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts
  const salesPerformanceData = [
    { month: 'Jan', meta: 100, real: 120 },
    { month: 'Feb', meta: 110, real: 115 },
    { month: 'Mar', meta: 120, real: 130 },
    { month: 'Apr', meta: 120, real: 100 },
    { month: 'May', meta: 130, real: 145 },
    { month: 'Jun', meta: 140, real: 160 },
  ];

  const sellerData = [
    { nome: 'Carlos Silva', vendas: 840000, meta: 800000, taxa: 105, status: 'acima' },
    { nome: 'Marina Souza', vendas: 720000, meta: 800000, taxa: 90, status: 'abaixo' },
    { nome: 'Paulo Mendes', vendas: 950000, meta: 800000, taxa: 119, status: 'acima' },
    { nome: 'Juliana Costa', vendas: 810000, meta: 800000, taxa: 101, status: 'acima' },
  ];

  const conversionData = [
    { name: 'Prospecção', value: 400, color: '#8884d8' },
    { name: 'Contato', value: 300, color: '#82ca9d' },
    { name: 'Proposta', value: 200, color: '#ffc658' },
    { name: 'Fechado', value: 100, color: '#ff8042' }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Performance de Vendas</h1>
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
                
                <Button>
                  Exportar Relatório
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 3.542.800,00</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" /> +12.5% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Atingimento da Meta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '98.5%' }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 15.850,00</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" /> +5.2% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22.8%</div>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <ArrowDown className="h-3 w-3 mr-1" /> -1.3% em relação ao período anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="sales" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Vendas
                </TabsTrigger>
                <TabsTrigger value="sellers" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Vendedores
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Metas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Performance de Vendas vs Meta</CardTitle>
                      <CardDescription>Comparativo entre meta e realizado nos últimos meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={salesPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="meta" name="Meta" fill="#8884d8" />
                            <Bar dataKey="real" name="Realizado" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Funil de Conversão</CardTitle>
                      <CardDescription>Taxa de conversão por etapa do funil</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={conversionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {conversionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Próximas Metas</CardTitle>
                      <CardDescription>Metas de vendas para os próximos períodos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm font-medium">Junho 2025</span>
                          </div>
                          <span className="font-semibold">R$ 980.000,00</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm font-medium">3º Trimestre 2025</span>
                          </div>
                          <span className="font-semibold">R$ 3.200.000,00</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm font-medium">4º Trimestre 2025</span>
                          </div>
                          <span className="font-semibold">R$ 3.850.000,00</span>
                        </div>
                        
                        <div className="pt-2">
                          <Button variant="outline" className="w-full">Ver Todas as Metas</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sales" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Análise de Vendas</CardTitle>
                    <CardDescription>Detalhamento de vendas por categoria e produto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-medium mb-4">Vendas por Categoria</h3>
                        <div className="space-y-4">
                          {[
                            { name: 'Aço Carbono', value: 1250000, percent: 35 },
                            { name: 'Aço Inox', value: 980000, percent: 28 },
                            { name: 'Alumínio', value: 680000, percent: 19 },
                            { name: 'Cobre', value: 420000, percent: 12 },
                            { name: 'Outros', value: 212000, percent: 6 }
                          ].map((category, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between mb-1">
                                <span>{category.name}</span>
                                <span className="font-medium">{formatBRL(category.value)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${category.percent}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Top Produtos</h3>
                        <div className="space-y-4">
                          {[
                            { name: 'Aço Inox 304', value: 520000 },
                            { name: 'Aço Carbono ASTM A36', value: 480000 },
                            { name: 'Alumínio 6061', value: 370000 },
                            { name: 'Cobre Eletrolítico', value: 280000 },
                            { name: 'Bronze Fosforoso', value: 210000 }
                          ].map((product, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 border-b">
                              <span>{idx + 1}. {product.name}</span>
                              <span className="font-medium">{formatBRL(product.value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="font-medium mb-4">Evolução de Vendas</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { name: 'Jan', value: 280000 },
                              { name: 'Fev', value: 320000 },
                              { name: 'Mar', value: 350000 },
                              { name: 'Abr', value: 410000 },
                              { name: 'Mai', value: 480000 },
                              { name: 'Jun', value: 520000 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatBRL(value as number)} />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#8884d8" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sellers" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance da Equipe de Vendas</CardTitle>
                    <CardDescription>Análise por vendedor e região</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Ranking de Vendedores</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left pb-2">Vendedor</th>
                                <th className="text-left pb-2">Vendas</th>
                                <th className="text-left pb-2">Meta</th>
                                <th className="text-left pb-2">% Atingimento</th>
                                <th className="text-left pb-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sellerData.map((seller, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="py-3 font-medium">{seller.nome}</td>
                                  <td className="py-3">{formatBRL(seller.vendas)}</td>
                                  <td className="py-3">{formatBRL(seller.meta)}</td>
                                  <td className="py-3">{seller.taxa}%</td>
                                  <td className="py-3">
                                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                      seller.status === 'acima' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {seller.status === 'acima' ? 'Acima da meta' : 'Abaixo da meta'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-4">Vendas por Região</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Sudeste', value: 55 },
                                    { name: 'Sul', value: 20 },
                                    { name: 'Nordeste', value: 12 },
                                    { name: 'Centro-Oeste', value: 8 },
                                    { name: 'Norte', value: 5 }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({name, value}) => `${name}: ${value}%`}
                                >
                                  {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-4">Vendas por Canal</h3>
                          <div className="space-y-4">
                            {[
                              { name: 'Vendas Diretas', value: 65 },
                              { name: 'Distribuidores', value: 25 },
                              { name: 'E-commerce', value: 10 }
                            ].map((channel, idx) => (
                              <div key={idx}>
                                <div className="flex justify-between mb-1">
                                  <span>{channel.name}</span>
                                  <span className="font-medium">{channel.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{ width: `${channel.value}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestão de Metas</CardTitle>
                    <CardDescription>Configure e acompanhe as metas da equipe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Meta Atual</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">R$ 3.600.000,00</div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '98.5%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">98.5% atingido</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Meta Individual Média</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">R$ 800.000,00</div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '103.8%' }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">103.8% atingido</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Projeção Próximo Mês</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">R$ 3.850.000,00</div>
                          <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUp className="h-3 w-3 mr-1" /> +6.9% em relação ao mês atual
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-4">Metas por Vendedor</h3>
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left pb-2">Vendedor</th>
                              <th className="text-left pb-2">Meta Atual</th>
                              <th className="text-left pb-2">Meta Próximo Mês</th>
                              <th className="text-left pb-2">Variação</th>
                              <th className="text-left pb-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {sellerData.map((seller, idx) => (
                              <tr key={idx} className="border-b">
                                <td className="py-3 font-medium">{seller.nome}</td>
                                <td className="py-3">{formatBRL(seller.meta)}</td>
                                <td className="py-3">{formatBRL(seller.meta * 1.05)}</td>
                                <td className="py-3 text-green-600">+5%</td>
                                <td className="py-3">
                                  <Button variant="outline" size="sm">Ajustar</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Histórico de Metas</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { month: 'Jan', meta: 3200000, atingido: 3150000 },
                                { month: 'Fev', meta: 3300000, atingido: 3280000 },
                                { month: 'Mar', meta: 3400000, atingido: 3520000 },
                                { month: 'Abr', meta: 3500000, atingido: 3490000 },
                                { month: 'Mai', meta: 3600000, atingido: 3542000 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip formatter={(value) => formatBRL(value as number)} />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="meta" 
                                name="Meta"
                                stroke="#8884d8" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="atingido" 
                                name="Realizado"
                                stroke="#82ca9d" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
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

export default Performance;
