
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { KanbanSquare, Plus, Edit, Trash2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  column: string;
}

const initialColumns = [
  { id: 'todo', title: 'A Fazer', color: 'border-slate-200' },
  { id: 'inprogress', title: 'Em Progresso', color: 'border-amber-300' },
  { id: 'review', title: 'Em Revisão', color: 'border-blue-400' },
  { id: 'done', title: 'Concluído', color: 'border-green-500' },
];

const initialTasks: Task[] = [
  { id: '1', title: 'Contato inicial com Ferragens São Paulo', description: 'Fazer contato por telefone para agendar apresentação', priority: 'high', assignedTo: 'Carlos Silva', column: 'todo' },
  { id: '2', title: 'Preparar proposta para Metalúrgica Nacional', description: 'Revisar valores e condições de entrega', priority: 'high', assignedTo: 'Ana Oliveira', column: 'todo' },
  { id: '3', title: 'Reunião com Construtora ABC', description: 'Apresentar catálogo de produtos', priority: 'medium', assignedTo: 'Carlos Silva', column: 'inprogress' },
  { id: '4', title: 'Orçamento para Indústria MetalMax', description: 'Preparar orçamento para pedido especial', priority: 'medium', assignedTo: 'Ana Oliveira', column: 'inprogress' },
  { id: '5', title: 'Follow-up com Ferragem Central', description: 'Verificar feedback após envio da proposta', priority: 'low', assignedTo: 'Carlos Silva', column: 'review' },
  { id: '6', title: 'Fechar contrato com Metalúrgica DF', description: 'Finalizar termos e assinar contrato', priority: 'high', assignedTo: 'Ana Oliveira', column: 'done' },
];

export const SalesKanban = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [columns, setColumns] = useState(initialColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState<Partial<Task>>({ priority: 'medium', column: 'todo' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredTasks = searchTerm
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tasks;

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, column: columnId } : task
    ));
  };

  const handleAddOrUpdateTask = () => {
    if (isEditMode && newTask.id) {
      setTasks(tasks.map(task => 
        task.id === newTask.id ? { ...task, ...newTask as Task } : task
      ));
    } else {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title || '',
        description: newTask.description || '',
        priority: newTask.priority as 'low' | 'medium' | 'high',
        assignedTo: newTask.assignedTo || '',
        column: newTask.column || 'todo',
      };
      setTasks([...tasks, task]);
    }

    setNewTask({ priority: 'medium', column: 'todo' });
    setIsDialogOpen(false);
    setIsEditMode(false);
  };

  const handleEditTask = (task: Task) => {
    setNewTask({ ...task });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-400';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KanbanSquare className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Kanban de Vendas</h2>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Buscar tarefas..." 
            className="w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setNewTask({ priority: 'medium', column: 'todo' });
                setIsEditMode(false);
              }}>
                <Plus className="mr-1 h-4 w-4" /> Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input 
                    id="title" 
                    value={newTask.title || ''} 
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    value={newTask.description || ''} 
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(val) => setNewTask({ ...newTask, priority: val as 'low' | 'medium' | 'high' })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="column">Status</Label>
                    <Select 
                      value={newTask.column} 
                      onValueChange={(val) => setNewTask({ ...newTask, column: val })}
                    >
                      <SelectTrigger id="column">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map(column => (
                          <SelectItem key={column.id} value={column.id}>{column.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Responsável</Label>
                  <Input 
                    id="assignedTo" 
                    value={newTask.assignedTo || ''} 
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddOrUpdateTask}>{isEditMode ? 'Atualizar' : 'Adicionar'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(column => (
          <div 
            key={column.id} 
            className={`border rounded-lg ${column.color} border-t-4`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="p-3 border-b bg-muted/10 flex justify-between items-center">
              <h3 className="font-medium">{column.title}</h3>
              <Badge variant="outline">
                {filteredTasks.filter(task => task.column === column.id).length}
              </Badge>
            </div>
            <div className="p-3 space-y-3 min-h-[400px]">
              {filteredTasks
                .filter(task => task.column === column.id)
                .map(task => (
                  <Card 
                    key={task.id}
                    className="shadow-sm"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className={`${getPriorityColor(task.priority)} h-2 w-2 mt-1.5 rounded-full`} />
                        <h4 className="font-medium flex-1 ml-2">{task.title}</h4>
                        <div className="flex space-x-1 ml-2">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleEditTask(task)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      {task.assignedTo && (
                        <Badge variant="outline" className="mt-2">
                          {task.assignedTo}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
