
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, DollarSign, Users, Play, Pause, Edit, Trash2 } from "lucide-react";

const Ads = () => {
  const [dateRange, setDateRange] = useState('30d');

  const adsData = [
    {
      id: 1,
      title: 'Lixeiras Industriais - Aço Inox',
      platform: 'Google Ads',
      status: 'Ativa',
      budget: 'R$ 200/dia',
      spent: 'R$ 1.245',
      impressions: '15.3K',
      clicks: '1.2K',
      ctr: '7.8%',
      conversions: 45,
      cpc: 'R$ 1,04'
    },
    {
      id: 2,
      title: 'Alumínio Naval - Construção',
      platform: 'Facebook Ads',
      status: 'Ativa',
      budget: 'R$ 150/dia',
      spent: 'R$ 980',
      impressions: '8.7K',
      clicks: '650',
      ctr: '7.5%',
      conversions: 23,
      cpc: 'R$ 1,51'
    },
    {
      id: 3,
      title: 'Cobre Elétrico - Instalações',
      platform: 'Google Ads',
      status: 'Pausada',
      budget: 'R$ 100/dia',
      spent: 'R$ 450',
      impressions: '5.2K',
      clicks: '380',
      ctr: '7.3%',
      conversions: 12,
      cpc: 'R$ 1,18'
    }
  ];

  const performanceData = [
    { day: 'Seg', impressions: 2400, clicks: 240, conversions: 12 },
    { day: 'Ter', impressions: 1398, clicks: 180, conversions: 15 },
    { day: 'Qua', impressions: 9800, clicks: 950, conversions: 28 },
    { day: 'Qui', impressions: 3908, clicks: 420, conversions: 18 },
    { day: 'Sex', impressions: 4800, clicks: 510, conversions: 22 },
    { day: 'Sab', impressions: 3800, clicks: 380, conversions: 8 },
    { day: 'Dom', impressions: 4300, clicks: 390, conversions: 10 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-green-100 text-green-800';
      case 'Pausada': return 'bg-yellow-100 text-yellow-800';
      case 'Finalizada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                  <h1 className="text-3xl font-bold">Gestão de Anúncios</h1>
                  <p className="text-muted-foreground">Monitore e otimize suas campanhas publicitárias</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 dias</SelectItem>
                    <SelectItem value="30d">30 dias</SelectItem>
                    <SelectItem value="90d">90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Criar Anúncio</Button>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Impressões Totais</p>
                      <p className="text-3xl font-bold">29.2K</p>
                      <p className="text-xs text-green-600">+12% vs período anterior</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cliques</p>
                      <p className="text-3xl font-bold">2.2K</p>
                      <p className="text-xs text-green-600">+8% vs período anterior</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversões</p>
                      <p className="text-3xl font-bold">80</p>
                      <p className="text-xs text-green-600">+15% vs período anterior</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gasto Total</p>
                      <p className="text-3xl font-bold">R$ 2.7K</p>
                      <p className="text-xs text-red-600">+5% vs período anterior</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="campaigns" className="space-y-6">
              <TabsList>
                <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="audience">Público</TabsTrigger>
                <TabsTrigger value="creative">Criativos</TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Campanhas Ativas</CardTitle>
                        <CardDescription>Gerencie suas campanhas publicitárias</CardDescription>
                      </div>
                      <Button>Nova Campanha</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {adsData.map((ad) => (
                        <div key={ad.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{ad.title}</h4>
                              <Badge variant="outline" className={getStatusColor(ad.status)}>
                                {ad.status}
                              </Badge>
                              <Badge variant="secondary">{ad.platform}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-5 gap-4 text-sm text-muted-foreground">
                              <div>
                                <div className="font-medium">{ad.impressions}</div>
                                <div>Impressões</div>
                              </div>
                              <div>
                                <div className="font-medium">{ad.clicks}</div>
                                <div>Cliques</div>
                              </div>
                              <div>
                                <div className="font-medium">{ad.ctr}</div>
                                <div>CTR</div>
                              </div>
                              <div>
                                <div className="font-medium">{ad.conversions}</div>
                                <div>Conversões</div>
                              </div>
                              <div>
                                <div className="font-medium">{ad.spent}</div>
                                <div>Gasto</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              {ad.status === 'Ativa' ? 
                                <Pause className="h-4 w-4" /> : 
                                <Play className="h-4 w-4" />
                              }
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Semanal</CardTitle>
                    <CardDescription>Análise detalhada da performance dos anúncios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="impressions" fill="#8884d8" name="Impressões" />
                          <Bar dataKey="clicks" fill="#82ca9d" name="Cliques" />
                          <Bar dataKey="conversions" fill="#ffc658" name="Conversões" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Palavras-chave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { keyword: 'lixeira inox', impressions: '8.5K', cpc: 'R$ 1,20' },
                          { keyword: 'alumínio naval', impressions: '6.2K', cpc: 'R$ 1,45' },
                          { keyword: 'cobre elétrico', impressions: '4.8K', cpc: 'R$ 1,10' },
                          { keyword: 'metal industrial', impressions: '3.9K', cpc: 'R$ 0,95' }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <div className="font-medium">{item.keyword}</div>
                              <div className="text-sm text-muted-foreground">{item.impressions} impressões</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{item.cpc}</div>
                              <div className="text-xs text-muted-foreground">CPC</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dispositivos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Desktop</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                            </div>
                            <span className="text-sm">65%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Mobile</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '28%'}}></div>
                            </div>
                            <span className="text-sm">28%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Tablet</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '7%'}}></div>
                            </div>
                            <span className="text-sm">7%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="audience" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Demografia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Faixa Etária</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>25-34 anos</span>
                              <span className="font-bold">38%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>35-44 anos</span>
                              <span className="font-bold">32%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>45-54 anos</span>
                              <span className="font-bold">22%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>55+ anos</span>
                              <span className="font-bold">8%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Localização</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { city: 'São Paulo', percentage: 45 },
                          { city: 'Rio de Janeiro', percentage: 28 },
                          { city: 'Belo Horizonte', percentage: 15 },
                          { city: 'Porto Alegre', percentage: 12 }
                        ].map((location, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{location.city}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{width: `${location.percentage}%`}}
                                ></div>
                              </div>
                              <span className="text-sm">{location.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="creative" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Biblioteca de Criativos</CardTitle>
                    <CardDescription>Gerencie imagens, vídeos e textos dos seus anúncios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="border rounded-lg p-4">
                          <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                            <span className="text-gray-500">Imagem {item}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium">Criativo {item}</div>
                            <div className="text-sm text-muted-foreground">
                              Usado em 2 campanhas
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">Editar</Button>
                              <Button size="sm" variant="outline">Usar</Button>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default Ads;
