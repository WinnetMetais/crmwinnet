
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Users, 
  TrendingUp,
  Play,
  Pause,
  Settings,
  BarChart3,
  Target,
  Clock
} from "lucide-react";

const MarketingAutomation = () => {
  const [activeAutomations, setActiveAutomations] = useState(3);
  
  const automationFlows = [
    {
      id: 1,
      name: "Boas-vindas Novos Clientes",
      type: "email",
      status: "ativo",
      trigger: "Novo cadastro",
      contacts: 147,
      conversion: "23%",
      lastRun: "2 horas atrás"
    },
    {
      id: 2,
      name: "Follow-up Orçamentos",
      type: "whatsapp",
      status: "ativo",
      trigger: "Orçamento sem resposta (3 dias)",
      contacts: 89,
      conversion: "18%",
      lastRun: "1 hora atrás"
    },
    {
      id: 3,
      name: "Reativação Clientes Inativos",
      type: "email",
      status: "ativo",
      trigger: "Sem compra (60 dias)",
      contacts: 203,
      conversion: "12%",
      lastRun: "6 horas atrás"
    },
    {
      id: 4,
      name: "Upsell Produtos Relacionados",
      type: "email",
      status: "pausado",
      trigger: "Após compra",
      contacts: 67,
      conversion: "31%",
      lastRun: "2 dias atrás"
    }
  ];

  const emailTemplates = [
    {
      id: 1,
      name: "Boas-vindas",
      subject: "Bem-vindo à Winnet Metais!",
      opens: "78%",
      clicks: "12%",
      status: "ativo"
    },
    {
      id: 2,
      name: "Follow-up Orçamento",
      subject: "Sobre seu orçamento - Ainda tem interesse?",
      opens: "65%",
      clicks: "8%",
      status: "ativo"
    },
    {
      id: 3,
      name: "Promoção Lixeiras",
      subject: "🔥 Oferta especial: 20% OFF em lixeiras",
      opens: "83%",
      clicks: "15%",
      status: "rascunho"
    }
  ];

  const segments = [
    {
      name: "Novos Clientes",
      count: 47,
      criteria: "Cadastro < 30 dias",
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Clientes VIP",
      count: 23,
      criteria: "Compras > R$ 10.000",
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Inativos",
      count: 156,
      criteria: "Sem compra > 60 dias",
      color: "bg-red-100 text-red-800"
    },
    {
      name: "Interessados em Lixeiras",
      count: 89,
      criteria: "Orçamentos de lixeiras",
      color: "bg-blue-100 text-blue-800"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800";
      case "pausado": return "bg-yellow-100 text-yellow-800";
      case "rascunho": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "whatsapp": return <MessageSquare className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Automação de Marketing</h1>
                <p className="text-muted-foreground">Gerencie campanhas automatizadas e segmentação de clientes</p>
              </div>
            </div>

            {/* Métricas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fluxos Ativos</p>
                      <p className="text-3xl font-bold">{activeAutomations}</p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contatos Ativos</p>
                      <p className="text-3xl font-bold">506</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taxa Conversão Média</p>
                      <p className="text-3xl font-bold">21%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ROI Mensal</p>
                      <p className="text-3xl font-bold">340%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="fluxos" className="space-y-6">
              <TabsList>
                <TabsTrigger value="fluxos">Fluxos de Automação</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="segmentos">Segmentos</TabsTrigger>
                <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="fluxos" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Fluxos de Automação</h2>
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    Novo Fluxo
                  </Button>
                </div>

                <div className="grid gap-4">
                  {automationFlows.map((flow) => (
                    <Card key={flow.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getTypeIcon(flow.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{flow.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Trigger: {flow.trigger}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm font-medium">{flow.contacts}</p>
                              <p className="text-xs text-muted-foreground">Contatos</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">{flow.conversion}</p>
                              <p className="text-xs text-muted-foreground">Conversão</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Última execução</p>
                              <p className="text-sm">{flow.lastRun}</p>
                            </div>
                            <Badge className={getStatusColor(flow.status)}>
                              {flow.status}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                {flow.status === "ativo" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Templates de Email</h2>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </div>

                <div className="grid gap-4">
                  {emailTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.subject}</p>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm font-medium">{template.opens}</p>
                              <p className="text-xs text-muted-foreground">Taxa Abertura</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">{template.clicks}</p>
                              <p className="text-xs text-muted-foreground">Taxa Clique</p>
                            </div>
                            <Badge className={getStatusColor(template.status)}>
                              {template.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="segmentos" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Segmentos de Clientes</h2>
                  <Button>
                    <Target className="h-4 w-4 mr-2" />
                    Novo Segmento
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {segments.map((segment, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{segment.name}</h3>
                          <Badge className={segment.color}>
                            {segment.count} contatos
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Critério: {segment.criteria}
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Ver Contatos
                          </Button>
                          <Button variant="outline" size="sm">
                            Criar Campanha
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="relatorios" className="space-y-6">
                <h2 className="text-xl font-semibold">Relatórios de Performance</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance por Canal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">18.5% conversão</p>
                            <p className="text-xs text-muted-foreground">321 enviados</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>WhatsApp</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">24.2% conversão</p>
                            <p className="text-xs text-muted-foreground">89 enviados</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tendência de Conversões</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Esta semana</span>
                          <span className="font-medium text-green-600">+12%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Este mês</span>
                          <span className="font-medium text-green-600">+28%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Último trimestre</span>
                          <span className="font-medium text-green-600">+45%</span>
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

export default MarketingAutomation;
