
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
  Search
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
      case "alta": return "bg-red-100 text-red-800";
      case "média": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida": return "bg-green-100 text-green-800";
      case "em-progresso": return "bg-blue-100 text-blue-800";
      case "pendente": return "bg-gray-100 text-gray-800";
      case "atrasada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingTasks = tasks.filter(t => t.status === "pendente").length;
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "concluida").length;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <NotificationBanner />
            
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Tarefas & Notificações</h1>
                <p className="text-muted-foreground">Gerencie suas tarefas e acompanhe notificações do sistema</p>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tarefas Pendentes</p>
                      <p className="text-3xl font-bold">{pendingTasks}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tarefas Atrasadas</p>
                      <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Notificações</p>
                      <p className="text-3xl font-bold">{unreadNotifications}</p>
                    </div>
                    <Bell className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                      <p className="text-3xl font-bold">78%</p>
                    </div>
                    <CheckSquare className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="tasks" className="space-y-6">
              <TabsList>
                <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="create">Criar Nova</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Lista de Tarefas</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filtrar
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Tarefa
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {task.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <User className="mr-1 h-3 w-3" />
                                {task.assignedTo}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                              {task.customer && (
                                <div>Cliente: {task.customer}</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Editar
                            </Button>
                            <Button size="sm">
                              Concluir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Central de Notificações</h3>
                  <Button onClick={handleMarkAllAsRead} variant="outline">
                    Marcar Todas como Lidas
                  </Button>
                </div>

                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Nenhuma notificação no momento</p>
                      </CardContent>
                    </Card>
                  ) : (
                    notifications.map((notification) => (
                      <Card key={notification.id} className={!notification.read ? "border-blue-200 bg-blue-50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.created_at).toLocaleString()}
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
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título da Tarefa</Label>
                        <Input id="title" placeholder="Digite o título..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Responsável</Label>
                        <Input id="assignee" placeholder="Nome do responsável..." />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea id="description" placeholder="Descreva a tarefa..." />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Prioridade</Label>
                        <Input id="priority" placeholder="Alta, Média, Baixa" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Data de Vencimento</Label>
                        <Input id="dueDate" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer">Cliente (opcional)</Label>
                        <Input id="customer" placeholder="Nome do cliente..." />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleCreateNotification("Nova Tarefa", "Tarefa criada com sucesso", "success")}
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Notificações por Email</div>
                          <div className="text-sm text-muted-foreground">Receber alertas por email</div>
                        </div>
                        <Button variant="outline" size="sm">Ativo</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Lembretes de Tarefas</div>
                          <div className="text-sm text-muted-foreground">Notificações 1 dia antes do vencimento</div>
                        </div>
                        <Button variant="outline" size="sm">Ativo</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
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
