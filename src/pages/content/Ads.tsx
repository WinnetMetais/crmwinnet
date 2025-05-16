
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  Plus, 
  Search, 
  DollarSign, 
  Users,
  MousePointerClick,
  BarChart2,
  MoreHorizontal,
  Facebook,
  Instagram,
  Linkedin,
  Globe,
  Target,
  Clock,
  Calendar as CalendarIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Componente para cartão de métrica
const MetricCard = ({ title, value, change, icon: Icon, percentage = false }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center">
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {percentage ? `${value}%` : value}
      </div>
      {change && (
        <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mt-1`}>
          {change} vs. período anterior
        </p>
      )}
    </CardContent>
  </Card>
);

const Ads = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Dados fictícios para campanhas
  const adCampaigns = [
    {
      id: 1,
      title: "Aço Inoxidável Premium",
      platform: "Facebook",
      status: "Ativo",
      budget: 1200,
      spent: 580,
      duration: "2025-05-01 - 2025-05-30",
      metrics: {
        impressions: 28450,
        clicks: 942,
        ctr: 3.31,
        conversions: 18,
        cpa: 32.22
      }
    },
    {
      id: 2,
      title: "Ligas de Alumínio para Construção",
      platform: "LinkedIn",
      status: "Ativo",
      budget: 2000,
      spent: 750,
      duration: "2025-05-10 - 2025-06-10",
      metrics: {
        impressions: 12780,
        clicks: 510,
        ctr: 3.99,
        conversions: 15,
        cpa: 50.00
      }
    },
    {
      id: 3,
      title: "Cobre para Instalações Elétricas",
      platform: "Instagram",
      status: "Pausado",
      budget: 800,
      spent: 240,
      duration: "2025-04-15 - 2025-05-15",
      metrics: {
        impressions: 8560,
        clicks: 320,
        ctr: 3.74,
        conversions: 6,
        cpa: 40.00
      }
    },
    {
      id: 4,
      title: "Tubos de Latão - Linha 2025",
      platform: "Google",
      status: "Agendado",
      budget: 1500,
      spent: 0,
      duration: "2025-06-01 - 2025-06-30",
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        cpa: 0
      }
    },
    {
      id: 5,
      title: "E-book: Guia de Materiais Metálicos",
      platform: "Facebook",
      status: "Encerrado",
      budget: 600,
      spent: 600,
      duration: "2025-03-01 - 2025-04-01",
      metrics: {
        impressions: 15240,
        clicks: 628,
        ctr: 4.12,
        conversions: 42,
        cpa: 14.29
      }
    }
  ];

  // Métricas gerais
  const adMetrics = [
    {
      title: "Investimento Total",
      value: "R$ 4.100",
      change: "+12%",
      icon: DollarSign
    },
    {
      title: "CTR Médio",
      value: "3.8",
      change: "+0.5%",
      icon: MousePointerClick,
      percentage: true
    },
    {
      title: "CPA Médio",
      value: "R$ 28.42",
      change: "-8%",
      icon: DollarSign
    },
    {
      title: "Alcance Total",
      value: "65.030",
      change: "+18%",
      icon: Users
    }
  ];

  // Função para obter o ícone da plataforma
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'Facebook':
        return <Facebook className="h-4 w-4" />;
      case 'Instagram':
        return <Instagram className="h-4 w-4" />;
      case 'LinkedIn':
        return <Linkedin className="h-4 w-4" />;
      case 'Google':
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Função para obter a cor do badge de status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Pausado':
        return 'bg-amber-100 text-amber-800';
      case 'Agendado':
        return 'bg-blue-100 text-blue-800';
      case 'Encerrado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar campanhas pelo tab ativo
  const filteredCampaigns = adCampaigns.filter(campaign => {
    if (activeTab === 'active') return campaign.status === 'Ativo';
    if (activeTab === 'scheduled') return campaign.status === 'Agendado';
    if (activeTab === 'paused') return campaign.status === 'Pausado';
    if (activeTab === 'ended') return campaign.status === 'Encerrado';
    return true; // all
  });

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4 items-center">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold">Anúncios</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Relatórios
                </Button>
                
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Campanha
                </Button>
              </div>
            </div>

            {/* Métricas de Desempenho */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {adMetrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  icon={metric.icon}
                  percentage={metric.percentage}
                />
              ))}
            </div>

            {/* Gerenciador de Campanhas */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center">
                      <Megaphone className="mr-2 h-5 w-5" />
                      Campanhas de Anúncios
                    </CardTitle>
                    <CardDescription>
                      Gerencie suas campanhas de anúncios digitais
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar campanhas..."
                        className="pl-8 w-full"
                      />
                    </div>
                    
                    <Select defaultValue="all-platforms">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-platforms">Todas as plataformas</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="active">Ativas</TabsTrigger>
                    <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
                    <TabsTrigger value="paused">Pausadas</TabsTrigger>
                    <TabsTrigger value="ended">Encerradas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {filteredCampaigns.length === 0 ? (
                    <div className="text-center py-8">
                      <Megaphone className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Nenhuma campanha encontrada nesta categoria</p>
                    </div>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <Card key={campaign.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getStatusColor(campaign.status)}>
                                  {campaign.status}
                                </Badge>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  {getPlatformIcon(campaign.platform)}
                                  <span className="ml-1">{campaign.platform}</span>
                                </div>
                              </div>
                              
                              <h3 className="text-lg font-medium">{campaign.title}</h3>
                              
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>Orçamento: R$ {campaign.budget.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{campaign.duration}</span>
                                </div>
                              </div>
                              
                              {/* Barra de progresso do orçamento */}
                              {campaign.status !== 'Agendado' && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Orçamento utilizado</span>
                                    <span>R$ {campaign.spent} / R$ {campaign.budget}</span>
                                  </div>
                                  <Progress value={(campaign.spent / campaign.budget) * 100} />
                                </div>
                              )}
                            </div>
                            
                            {campaign.status !== 'Agendado' && (
                              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 w-full md:w-auto">
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Impressões</p>
                                  <p className="font-medium">{campaign.metrics.impressions.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Cliques</p>
                                  <p className="font-medium">{campaign.metrics.clicks.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">CTR</p>
                                  <p className="font-medium">{campaign.metrics.ctr}%</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Conversões</p>
                                  <p className="font-medium">{campaign.metrics.conversions}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">CPA</p>
                                  <p className="font-medium">R$ {campaign.metrics.cpa.toFixed(2)}</p>
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                                  <DropdownMenuItem>Editar campanha</DropdownMenuItem>
                                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                  {campaign.status === 'Ativo' && (
                                    <DropdownMenuItem>Pausar</DropdownMenuItem>
                                  )}
                                  {campaign.status === 'Pausado' && (
                                    <DropdownMenuItem>Ativar</DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem className="text-red-600">Encerrar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t p-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredCampaigns.length} de {adCampaigns.length} campanhas
                </p>
                <Button variant="outline" size="sm">
                  Ver todas as campanhas
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Ads;
