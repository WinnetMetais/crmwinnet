import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, FileText, Plus, Target, CheckCircle, Clock, Tag, Filter, MoreHorizontal } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NewContentForm } from "@/components/content/NewContentForm";

const ContentPlan = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('monthly');
  const [showNewContentForm, setShowNewContentForm] = useState(false);

  // Dados fictícios para o plano de conteúdo
  const contentPlanItems = [
    {
      id: 1,
      title: 'Tipos de Aço Inox para Indústria',
      type: 'Blog',
      status: 'Planejado',
      deadline: '2025-05-20',
      persona: 'Engenheiro Industrial',
      keywords: ['aço inox', 'indústria', 'materiais'],
      objective: 'Conscientização',
      notes: 'Abordar os diferentes tipos de aço inox e suas aplicações específicas',
    },
    {
      id: 2,
      title: 'Vantagens do Alumínio Naval',
      type: 'Infográfico',
      status: 'Em Produção',
      deadline: '2025-05-18',
      persona: 'Construtor Naval',
      keywords: ['alumínio', 'naval', 'construção'],
      objective: 'Conversão',
      notes: 'Destacar resistência à corrosão e leveza do material',
    },
    {
      id: 3,
      title: 'Como Escolher o Metal Correto para Seu Projeto',
      type: 'E-book',
      status: 'Planejado',
      deadline: '2025-06-01',
      persona: 'Arquiteto',
      keywords: ['metais', 'escolha', 'projeto'],
      objective: 'Lead',
      notes: 'Guia passo-a-passo para seleção de materiais metálicos',
    },
    {
      id: 4,
      title: 'Sustentabilidade na Indústria Metalúrgica',
      type: 'Webinar',
      status: 'Publicado',
      deadline: '2025-05-10',
      persona: 'Gestor Ambiental',
      keywords: ['sustentabilidade', 'metalurgia', 'meio ambiente'],
      objective: 'Autoridade',
      notes: 'Apresentação de práticas sustentáveis de produção',
    },
    {
      id: 5,
      title: 'O Impacto do Latão nos Projetos Hidráulicos',
      type: 'Blog',
      status: 'Revisão',
      deadline: '2025-05-16',
      persona: 'Engenheiro Civil',
      keywords: ['latão', 'hidráulica', 'durabilidade'],
      objective: 'Educação',
      notes: 'Combinar com imagens de produtos específicos do catálogo',
    },
  ];

  // Filtro pelo status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Planejado':
        return 'bg-blue-100 text-blue-800';
      case 'Em Produção':
        return 'bg-amber-100 text-amber-800';
      case 'Revisão':
        return 'bg-purple-100 text-purple-800';
      case 'Publicado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Resumo de métricas
  const planMetrics = [
    { title: 'Conteúdos Planejados', value: '12', icon: Target },
    { title: 'Conteúdos Publicados', value: '4', icon: CheckCircle },
    { title: 'Próximos Vencimentos', value: '3', icon: Clock },
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
                <h1 className="text-3xl font-bold">Planejamento de Conteúdo</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Ver Calendário
                </Button>
                
                <Button onClick={() => setShowNewContentForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Conteúdo
                </Button>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {planMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <metric.icon className="mr-2 h-4 w-4" />
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Calendário e Plano */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendário</CardTitle>
                  <CardDescription>Visualize os prazos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md"
                    showOutsideDays={false}
                  />
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <h3 className="text-sm font-medium mb-2">Legenda</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                        <span className="text-xs">Planejado</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
                        <span className="text-xs">Em Produção</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                        <span className="text-xs">Publicado</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Plano de Conteúdo</CardTitle>
                      <CardDescription>Gerencie seu pipeline de conteúdo</CardDescription>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select defaultValue="todos">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os status</SelectItem>
                          <SelectItem value="planejado">Planejado</SelectItem>
                          <SelectItem value="producao">Em Produção</SelectItem>
                          <SelectItem value="revisao">Em Revisão</SelectItem>
                          <SelectItem value="publicado">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="relative">
                        <Input placeholder="Buscar conteúdo..." className="w-full sm:w-[200px]" />
                      </div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="monthly" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="monthly">Mensal</TabsTrigger>
                      <TabsTrigger value="quarterly">Trimestral</TabsTrigger>
                      <TabsTrigger value="annual">Anual</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {contentPlanItems.map((item) => (
                      <div key={item.id} className="bg-card border rounded-md p-4">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className={`${getStatusColor(item.status)}`}>
                                {item.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{item.type}</span>
                            </div>
                            
                            <h3 className="font-medium text-lg">{item.title}</h3>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                <span>Prazo: {new Date(item.deadline).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Target className="h-3 w-3 mr-1" />
                                <span>Objetivo: {item.objective}</span>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Tag className="h-3 w-3 mr-1" />
                                <span>Persona: {item.persona}</span>
                              </div>
                            </div>
                            
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-2 italic">
                                "{item.notes}"
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.keywords.map((keyword, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:mt-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Criar Conteúdo</DropdownMenuItem>
                                <DropdownMenuItem>Alterar Status</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {contentPlanItems.length} itens
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar Plano
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {showNewContentForm && (
        <NewContentForm onClose={() => setShowNewContentForm(false)} />
      )}
    </SidebarProvider>
  );
};

export default ContentPlan;
