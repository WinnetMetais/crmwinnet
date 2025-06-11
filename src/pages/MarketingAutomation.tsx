
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Zap, 
  Mail, 
  Users, 
  Plus, 
  Calendar,
  Play,
  Pause,
  Settings,
  BarChart3,
  Target,
  Clock,
  Send
} from "lucide-react";

const MarketingAutomation = () => {
  const [automations] = useState([
    {
      id: 1,
      name: "Boas-vindas Novos Leads",
      status: "ativa",
      triggers: "Novo cadastro",
      contacts: 245,
      openRate: "68%",
      clickRate: "12%",
      lastRun: "2024-01-15 09:30"
    },
    {
      id: 2,
      name: "Abandono de Carrinho",
      status: "ativa",
      triggers: "Carrinho abandonado",
      contacts: 89,
      openRate: "45%",
      clickRate: "8%",
      lastRun: "2024-01-15 11:15"
    },
    {
      id: 3,
      name: "Follow-up Orçamentos",
      status: "pausada",
      triggers: "Orçamento não respondido",
      contacts: 156,
      openRate: "72%",
      clickRate: "15%",
      lastRun: "2024-01-14 16:45"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa": return "bg-green-100 text-green-800";
      case "pausada": return "bg-yellow-100 text-yellow-800";
      case "rascunho": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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
                <p className="text-muted-foreground">Configure fluxos automatizados para nutrição de leads</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Automações Ativas</p>
                      <p className="text-3xl font-bold">12</p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emails Enviados</p>
                      <p className="text-3xl font-bold">2.456</p>
                    </div>
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taxa de Abertura</p>
                      <p className="text-3xl font-bold">68%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Leads Ativos</p>
                      <p className="text-3xl font-bold">490</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="automations" className="space-y-6">
              <TabsList>
                <TabsTrigger value="automations">Automações</TabsTrigger>
                <TabsTrigger value="create">Criar Nova</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="analytics">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="automations" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Automações Configuradas</h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Automação
                  </Button>
                </div>

                <div className="space-y-4">
                  {automations.map((automation) => (
                    <Card key={automation.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-5 w-5 text-blue-500" />
                              <div>
                                <h4 className="font-medium">{automation.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Gatilho: {automation.triggers}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className={getStatusColor(automation.status)}>
                              {automation.status}
                            </Badge>
                            
                            <div className="text-right text-sm">
                              <div className="font-medium">{automation.contacts} contatos</div>
                              <div className="text-muted-foreground">
                                {automation.openRate} abertura • {automation.clickRate} clique
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={automation.status === 'ativa' ? 'outline' : 'default'}
                              >
                                {automation.status === 'ativa' ? 
                                  <Pause className="h-4 w-4" /> : 
                                  <Play className="h-4 w-4" />
                                }
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Nova Automação</CardTitle>
                    <CardDescription>Configure um novo fluxo de nutrição automatizado</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome da Automação</Label>
                        <Input id="name" placeholder="Ex: Boas-vindas novos leads" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trigger">Gatilho</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o gatilho" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="signup">Novo cadastro</SelectItem>
                            <SelectItem value="quote">Solicitar orçamento</SelectItem>
                            <SelectItem value="cart">Abandono de carrinho</SelectItem>
                            <SelectItem value="download">Download de material</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Descreva o objetivo desta automação..." 
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Configurar Email</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subject">Assunto do Email</Label>
                          <Input id="subject" placeholder="Bem-vindo à Winnet Metais!" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="delay">Delay (horas)</Label>
                          <Input id="delay" type="number" placeholder="0" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="content">Conteúdo do Email</Label>
                        <Textarea 
                          id="content" 
                          placeholder="Digite o conteúdo do seu email..."
                          className="min-h-32"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button>
                        <Send className="mr-2 h-4 w-4" />
                        Criar Automação
                      </Button>
                      <Button variant="outline">
                        Salvar Rascunho
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Boas-vindas</CardTitle>
                      <CardDescription>Template para novos leads</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Emails no fluxo:</span>
                          <span>3</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Conversão média:</span>
                          <span>15%</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Abandono Carrinho</CardTitle>
                      <CardDescription>Recuperação de vendas perdidas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Emails no fluxo:</span>
                          <span>4</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Conversão média:</span>
                          <span>22%</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Nutrição Lead</CardTitle>
                      <CardDescription>Educação e engajamento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Emails no fluxo:</span>
                          <span>6</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Conversão média:</span>
                          <span>8%</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Geral</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Taxa de Entrega</span>
                          <span className="font-bold">98.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Taxa de Abertura</span>
                          <span className="font-bold">68.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Taxa de Clique</span>
                          <span className="font-bold">12.4%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Taxa de Conversão</span>
                          <span className="font-bold">15.8%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Automações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span>Boas-vindas Novos Leads</span>
                          <span className="text-green-600 font-bold">68%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span>Follow-up Orçamentos</span>
                          <span className="text-green-600 font-bold">72%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span>Abandono de Carrinho</span>
                          <span className="text-yellow-600 font-bold">45%</span>
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
