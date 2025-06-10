import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
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
                      <p className="text-sm font-medium text-muted-foreground">Taxa Conclusão</p>
                      <p className="text-3xl font-bold">78%</p>
                    </div>
                    <CheckSquare className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="tarefas" className="space-y-6">
              <TabsList>
                <TabsTrigger value="tarefas">Minhas Tarefas</TabsTrigger>
                <TabsTrigger value="notificacoes">Central de Notificações</TabsTrigger>
                <TabsTrigger value="criar">Criar Tarefa</TabsTrigger>
              </TabsList>

              <TabsContent value="tarefas" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Lista de Tarefas</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">{task.title}</h3>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {task.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{task.assignedTo}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                              </div>
                              {task.customer && (
                                <div className="flex items-center space-x-1">
                                  <span>Cliente: {task.customer}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            {task.status !== "concluida" && (
                              <Button size="sm">
                                Concluir
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notificacoes" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Central de Notificações do Sistema</h2>
                  <Button variant="outline" size="sm" onClick={() => markAllAsRead()}>
                    Marcar todas como lidas
                  </Button>
                </div>

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{notification.title}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(notification.created_at).toLocaleString('pt-BR')}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">{notification.type}</Badge>
                              {notification.metadata?.module && (
                                <Badge variant="outline">
                                  {notification.metadata.module}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Marcar como lida
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="criar" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Nova Tarefa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="taskTitle">Título da Tarefa</Label>
                        <Input id="taskTitle" placeholder="Ex: Enviar proposta para cliente..." />
                      </div>
                      <div>
                        <Label htmlFor="assignedTo">Responsável</Label>
                        <Input id="assignedTo" placeholder="Nome do responsável" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Descreva os detalhes da tarefa..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="priority">Prioridade</Label>
                        <select id="priority" className="w-full p-2 border rounded-md">
                          <option value="baixa">Baixa</option>
                          <option value="média">Média</option>
                          <option value="alta">Alta</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Data de Vencimento</Label>
                        <Input id="dueDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="customer">Cliente (opcional)</Label>
                        <Input id="customer" placeholder="Nome do cliente" />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">Cancelar</Button>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Tarefa
                      </Button>
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
