import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Plus, Filter, Eye, Edit, Trash2, ArrowUpDown, Activity, Zap, Target } from "lucide-react";

const GoogleCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  // Sample campaign data
  const campaigns = [
    {
      id: 1,
      name: 'Aço Inox 304 - Search',
      budget: 'R$ 300,00/dia',
      status: 'Ativa',
      impressions: '45.3K',
      clicks: '5.2K',
      ctr: '11.5%',
      costPerClick: 'R$ 2,80',
      conversions: '320',
      costPerConversion: 'R$ 45,50',
      roi: '415%'
    },
    {
      id: 2,
      name: 'Alumínio 6061 - Search',
      budget: 'R$ 250,00/dia',
      status: 'Ativa',
      impressions: '38.7K',
      clicks: '4.1K',
      ctr: '10.6%',
      costPerClick: 'R$ 3,10',
      conversions: '280',
      costPerConversion: 'R$ 48,20',
      roi: '385%'
    },
    {
      id: 3,
      name: 'Remarketing Geral',
      budget: 'R$ 200,00/dia',
      status: 'Ativa',
      impressions: '122K',
      clicks: '3.8K',
      ctr: '3.1%',
      costPerClick: 'R$ 1,50',
      conversions: '210',
      costPerConversion: 'R$ 27,14',
      roi: '620%'
    },
    {
      id: 4,
      name: 'Display - Fornecedores',
      budget: 'R$ 180,00/dia',
      status: 'Pausada',
      impressions: '87K',
      clicks: '1.2K',
      ctr: '1.3%',
      costPerClick: 'R$ 1,85',
      conversions: '45',
      costPerConversion: 'R$ 49,33',
      roi: '280%'
    },
    {
      id: 5,
      name: 'Cobre - Performance',
      budget: 'R$ 320,00/dia',
      status: 'Pausada',
      impressions: '34.2K',
      clicks: '3.7K',
      ctr: '10.8%',
      costPerClick: 'R$ 2,90',
      conversions: '190',
      costPerConversion: 'R$ 56,52',
      roi: '310%'
    },
    {
      id: 6,
      name: 'Brand Protection',
      budget: 'R$ 150,00/dia',
      status: 'Ativa',
      impressions: '18.5K',
      clicks: '4.2K',
      ctr: '22.7%',
      costPerClick: 'R$ 0,95',
      conversions: '320',
      costPerConversion: 'R$ 12,42',
      roi: '980%'
    },
  ];

  // Filter campaigns based on search term and active tab
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && campaign.status === 'Ativa';
    if (activeTab === 'paused') return matchesSearch && campaign.status === 'Pausada';
    
    return matchesSearch;
  });

  // Chart data
  const performanceData = [
    { day: '01/05', clicks: 380, impressions: 3800, conversions: 28 },
    { day: '02/05', clicks: 420, impressions: 4100, conversions: 32 },
    { day: '03/05', clicks: 390, impressions: 3900, conversions: 30 },
    { day: '04/05', clicks: 450, impressions: 4400, conversions: 35 },
    { day: '05/05', clicks: 480, impressions: 4700, conversions: 38 },
    { day: '06/05', clicks: 460, impressions: 4500, conversions: 36 },
    { day: '07/05', clicks: 510, impressions: 5000, conversions: 40 },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Google Ads</h1>
                  <p className="text-muted-foreground">Gerencie suas campanhas no Google</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Campanha
                </Button>
              </div>
            </div>

            {/* Campaign Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Activity className="mr-2 h-4 w-4 text-blue-500" />
                    Impressões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">346K</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +12.5% vs período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Zap className="mr-2 h-4 w-4 text-warning" />
                    Cliques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22.2K</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +8.3% vs período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <Target className="mr-2 h-4 w-4 text-green-500" />
                    Conversões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,365</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    +15.2% vs período anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CTR Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6.41%</div>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    -1.3% vs período anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Performance da Campanha</CardTitle>
                <CardDescription>Análise diária de cliques, impressões e conversões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="clicks" name="Cliques" fill="#8884d8" />
                      <Bar yAxisId="left" dataKey="impressions" name="Impressões" fill="#82ca9d" />
                      <Bar yAxisId="right" dataKey="conversions" name="Conversões" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Campanhas Google Ads</CardTitle>
                    <CardDescription>
                      Gerencie e otimize suas campanhas de anúncios
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar campanhas..."
                        className="pl-8 w-full md:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Tabs 
                      defaultValue="all" 
                      className="w-full md:w-auto" 
                      onValueChange={setActiveTab}
                      value={activeTab}
                    >
                      <TabsList className="grid grid-cols-3 w-full md:w-auto">
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="active">Ativas</TabsTrigger>
                        <TabsTrigger value="paused">Pausadas</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campanha</TableHead>
                        <TableHead>Orçamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Impressões
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Cliques
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>CPC</TableHead>
                        <TableHead>Conversões</TableHead>
                        <TableHead>Custo/Conv</TableHead>
                        <TableHead>ROI</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{campaign.budget}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                campaign.status === 'Ativa'
                                  ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                                  : "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100"
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.impressions}</TableCell>
                          <TableCell>{campaign.clicks}</TableCell>
                          <TableCell>{campaign.ctr}</TableCell>
                          <TableCell>{campaign.costPerClick}</TableCell>
                          <TableCell>{campaign.conversions}</TableCell>
                          <TableCell>{campaign.costPerConversion}</TableCell>
                          <TableCell className="text-green-600 font-medium">{campaign.roi}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default GoogleCampaigns;
