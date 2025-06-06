
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Clock, Users, Calendar, Plus, Bell, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'baixa' | 'média' | 'alta' | 'urgente';
  status: 'pendente' | 'em-progresso' | 'concluida' | 'cancelada';
  dueDate: string;
  createdDate: string;
  completedDate?: string;
  tags: string[];
  category: string;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  attachments: string[];
}

export const AdvancedTaskSystem = () => {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Enviar proposta para Cliente ABC',
      description: 'Finalizar e enviar proposta de lixeiras industriais com desconto especial',
      assignedTo: 'João Silva',
      priority: 'alta',
      status: 'em-progresso',
      dueDate: '2024-01-18',
      createdDate: '2024-01-15',
      tags: ['vendas', 'proposta', 'urgente'],
      category: 'Comercial',
      estimatedHours: 4,
      actualHours: 2.5,
      dependencies: [],
      attachments: ['especificacoes.pdf']
    },
    {
      id: '2',
      title: 'Atualizar estoque de lixeiras pequenas',
      description: 'Verificar e atualizar quantidades no sistema',
      assignedTo: 'Maria Santos',
      priority: 'média',
      status: 'pendente',
      dueDate: '2024-01-20',
      createdDate: '2024-01-16',
      tags: ['estoque', 'sistema'],
      category: 'Operacional',
      estimatedHours: 2,
      dependencies: [],
      attachments: []
    },
    {
      id: '3',
      title: 'Preparar relatório mensal de vendas',
      description: 'Compilar dados de vendas e gerar relatório para diretoria',
      assignedTo: 'Pedro Costa',
      priority: 'alta',
      status: 'concluida',
      dueDate: '2024-01-17',
      createdDate: '2024-01-10',
      completedDate: '2024-01-16',
      tags: ['relatório', 'vendas', 'diretoria'],
      category: 'Análise',
      estimatedHours: 6,
      actualHours: 5.5,
      dependencies: ['task_4'],
      attachments: ['relatorio-vendas.xlsx']
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'média',
    dueDate: '',
    category: '',
    estimatedHours: 0,
    tags: ''
  });

  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    category: 'all'
  });

  const filteredTasks = tasks.filter(task => {
    return (filters.status === 'all' || task.status === filters.status) &&
           (filters.priority === 'all' || task.priority === filters.priority) &&
           (filters.assignedTo === 'all' || task.assignedTo === filters.assignedTo) &&
           (filters.category === 'all' || task.category === filters.category);
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pendente').length,
    inProgress: tasks.filter(t => t.status === 'em-progresso').length,
    completed: tasks.filter(t => t.status === 'concluida').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'concluida').length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'em-progresso': return 'bg-blue-100 text-blue-800';
      case 'pendente': return 'bg-gray-100 text-gray-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, responsável e data de vencimento.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Tarefa criada",
      description: "Nova tarefa foi criada com sucesso!",
    });

    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'média',
      dueDate: '',
      category: '',
      estimatedHours: 0,
      tags: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{taskStats.total}</p>
              </div>
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{taskStats.pending}</p>
              </div>
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Progresso</p>
                <p className="text-2xl font-bold">{taskStats.inProgress}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
              </div>
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atrasadas</p>
                <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
              </div>
              <Bell className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Lista de Tarefas</TabsTrigger>
          <TabsTrigger value="create">Criar Tarefa</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filtros</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="statusFilter">Status</Label>
                  <select 
                    id="statusFilter"
                    className="w-full border rounded-md px-3 py-2"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="all">Todos</option>
                    <option value="pendente">Pendente</option>
                    <option value="em-progresso">Em Progresso</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priorityFilter">Prioridade</Label>
                  <select 
                    id="priorityFilter"
                    className="w-full border rounded-md px-3 py-2"
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  >
                    <option value="all">Todas</option>
                    <option value="urgente">Urgente</option>
                    <option value="alta">Alta</option>
                    <option value="média">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="assignedFilter">Responsável</Label>
                  <select 
                    id="assignedFilter"
                    className="w-full border rounded-md px-3 py-2"
                    value={filters.assignedTo}
                    onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
                  >
                    <option value="all">Todos</option>
                    <option value="João Silva">João Silva</option>
                    <option value="Maria Santos">Maria Santos</option>
                    <option value="Pedro Costa">Pedro Costa</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="categoryFilter">Categoria</Label>
                  <select 
                    id="categoryFilter"
                    className="w-full border rounded-md px-3 py-2"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="all">Todas</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Operacional">Operacional</option>
                    <option value="Análise">Análise</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <p className="text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Responsável</p>
                      <p className="font-medium">{task.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vencimento</p>
                      <p className="font-medium">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Categoria</p>
                      <p className="font-medium">{task.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Estimativa</p>
                      <p className="font-medium">{task.estimatedHours}h</p>
                    </div>
                  </div>

                  {task.tags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    {task.status !== 'concluida' && (
                      <Button size="sm">
                        Marcar como Concluída
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Tarefa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taskTitle">Título da Tarefa</Label>
                  <Input
                    id="taskTitle"
                    placeholder="Ex: Enviar proposta para cliente..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="taskAssigned">Responsável</Label>
                  <select 
                    id="taskAssigned"
                    className="w-full border rounded-md px-3 py-2"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    <option value="João Silva">João Silva</option>
                    <option value="Maria Santos">Maria Santos</option>
                    <option value="Pedro Costa">Pedro Costa</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="taskDescription">Descrição</Label>
                <Textarea
                  id="taskDescription"
                  placeholder="Descreva os detalhes da tarefa..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="taskPriority">Prioridade</Label>
                  <select 
                    id="taskPriority"
                    className="w-full border rounded-md px-3 py-2"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="taskDueDate">Data de Vencimento</Label>
                  <Input
                    id="taskDueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="taskCategory">Categoria</Label>
                  <Input
                    id="taskCategory"
                    placeholder="Ex: Comercial"
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="taskHours">Horas Estimadas</Label>
                  <Input
                    id="taskHours"
                    type="number"
                    placeholder="Ex: 4"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({...newTask, estimatedHours: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="taskTags">Tags (separadas por vírgula)</Label>
                <Input
                  id="taskTags"
                  placeholder="Ex: vendas, proposta, urgente"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                />
              </div>

              <Button onClick={handleCreateTask} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Tarefa
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtividade por Pessoa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['João Silva', 'Maria Santos', 'Pedro Costa'].map((person) => {
                    const personTasks = tasks.filter(t => t.assignedTo === person);
                    const completed = personTasks.filter(t => t.status === 'concluida').length;
                    const total = personTasks.length;
                    const percentage = total > 0 ? (completed / total) * 100 : 0;

                    return (
                      <div key={person} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{person}</span>
                          <span>{completed}/{total} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Comercial', 'Operacional', 'Análise'].map((category) => {
                    const categoryTasks = tasks.filter(t => t.category === category);
                    const count = categoryTasks.length;
                    const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;

                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center gap-2">
                          <span>{count} tarefas</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
