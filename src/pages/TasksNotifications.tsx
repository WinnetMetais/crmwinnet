
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckSquare, 
  Clock, 
  Bell, 
  Plus, 
  Calendar,
  User,
  AlertTriangle,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle
} from "lucide-react";
import { NotificationBanner, useNotifications, useModuleNotifications } from "@/components/notifications";

const TasksNotifications = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { createTaskNotification } = useModuleNotifications();
  
  const [tasks] = useState([
    {
      id: 1,
      title: "Enviar proposta para Cliente ABC",
      description: "Finalizar e enviar proposta de lixeiras industriais",
      assignedTo: "Carlos Silva",
      priority: "alta",
      status: "pendente",
      dueDate: "2024-01-15",
      customer: "Cliente ABC Ltda",
      type: "follow-up"
    },
    {
      id: 2,
      title: "Follow-up orçamento L4090",
      description: "Cliente não respondeu há 3 dias - fazer contato",
      assignedTo: "Ana Oliveira",
      priority: "média",
      status: "em-progresso",
      dueDate: "2024-01-14",
      customer: "Metalúrgica XYZ",
      type: "follow-up"
    },
    {
      id: 3,
      title: "Atualizar estoque lixeiras pequenas",
      description: "Verificar e atualizar quantidades em estoque",
      assignedTo: "João Santos",
      priority: "baixa",
      status: "concluida",
      dueDate: "2024-01-13",
      customer: "",
      type: "operacional"
    },
    {
      id: 4,
      title: "Reunião de alinhamento com equipe",
      description: "Revisar metas do mês e estratégias",
      assignedTo: "Maria Costa",
      priority: "alta",
      status: "pendente",
      dueDate: "2024-01-16",
      customer: "",
      type: "interna"
    }
  ]);

  const handleCreateNotification = (title: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    createTaskNotification('', message, type);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "média": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "baixa": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "em-progresso": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pendente": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "atrasada": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluida": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "em-progresso": return <Clock className="h-4 w-4 text-blue-600" />;
      case "pendente": return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingTasks = tasks.filter(t => t.status === "pendente").length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "concluida").length;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto py-6 px-4 space-y-6">
            <NotificationBanner />
            
            {/* Header melhorado */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Tarefas & Notificações</h1>
                  <p className="text-muted-foreground">Gerencie suas tarefas e acompanhe notificações do sistema</p>
                </div>
              </div>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova Tarefa
              </Button>
            </div>

            {/* Métricas melhoradas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tarefas Pendentes</p>
                      <p className="text-3xl font-bold">{pendingTasks}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tarefas Atrasadas</p>
                      <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Notificações</p>
                      <p className="text-3xl font-bold">{unreadNotifications}</p>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                      <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                      <p className="text-3xl font-bold">78%</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                      <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="tasks" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="create">Criar Nova</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-6">
                {/* Filtros melhorados */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pesquisar Tarefas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Pesquisar tarefas..." className="pl-10" />
                      </div>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de tarefas melhorada */}
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Card key={task.id} className="group hover:shadow-md transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(task.status)}
                              <h4 className="font-medium text-lg">{task.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground">
                              {task.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{task.assignedTo}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                              </div>
                              {task.customer && (
                                <div className="flex items-center gap-1">
                                  <span>Cliente: {task.customer}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              Editar
                            </Button>
                            <Button size="sm">
                              Concluir
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-semibold">Central de Notificações</h3>
                  <Button onClick={handleMarkAllAsRead} variant="outline">
                    Marcar Todas como Lidas
                  </Button>
                </div>

                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
                        <p className="text-muted-foreground">Você está em dia com todas as notificações!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    notifications.map((notification) => (
                      <Card key={notification.id} className={`transition-all ${!notification.read ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(notification.timestamp || Date.now()).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {!notification.read && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Marcar como Lida
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Nova Tarefa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título da Tarefa *</Label>
                        <Input id="title" placeholder="Digite o título..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Responsável *</Label>
                        <Input id="assignee" placeholder="Nome do responsável..." />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição *</Label>
                      <Textarea id="description" placeholder="Descreva a tarefa..." />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Prioridade *</Label>
                        <Input id="priority" placeholder="Alta, Média, Baixa" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Data de Vencimento *</Label>
                        <Input id="dueDate" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer">Cliente (opcional)</Label>
                        <Input id="customer" placeholder="Nome do cliente..." />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleCreateNotification("Nova Tarefa", "Tarefa criada com sucesso", "success")}
                      className="w-full sm:w-auto"
                    >
                      Criar Tarefa
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Notificações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Notificações por Email</div>
                          <div className="text-sm text-muted-foreground">Receber alertas por email</div>
                        </div>
                        <Button variant="outline" size="sm">Ativo</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Lembretes de Tarefas</div>
                          <div className="text-sm text-muted-foreground">Notificações 1 dia antes do vencimento</div>
                        </div>
                        <Button variant="outline" size="sm">Ativo</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Notificações Push</div>
                          <div className="text-sm text-muted-foreground">Alertas no navegador</div>
                        </div>
                        <Button variant="outline" size="sm">Inativo</Button>
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

export default TasksNotifications;
