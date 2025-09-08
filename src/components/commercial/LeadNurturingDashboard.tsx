import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadNurturingService } from "@/services/leadNurturing";
import { LoadingFallback } from "@/components/layout/LoadingFallback";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Calendar,
  Zap,
  Target
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const LeadNurturingDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coldLeads, isLoading: coldLeadsLoading } = useQuery({
    queryKey: ['cold-leads'],
    queryFn: () => leadNurturingService.getColdLeads(30),
  });

  const { data: nurturingTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['nurturing-tasks'],
    queryFn: () => leadNurturingService.getNurturingTasks(),
  });

  const { data: leadMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['lead-metrics'],
    queryFn: () => leadNurturingService.getLeadMetrics(),
  });

  const generateTasksMutation = useMutation({
    mutationFn: () => leadNurturingService.generateAutomatedTasks(),
    onSuccess: (newTasks) => {
      queryClient.invalidateQueries({ queryKey: ['nurturing-tasks'] });
      toast({
        title: "Tarefas criadas",
        description: `${newTasks.length} tarefas de nutrição foram criadas automaticamente.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao gerar tarefas automáticas.",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      leadNurturingService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nurturing-tasks'] });
      toast({
        title: "Tarefa atualizada",
        description: "Status da tarefa atualizado com sucesso.",
      });
    },
  });

  if (coldLeadsLoading || tasksLoading || metricsLoading) {
    return <LoadingFallback />;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return <Phone className="h-4 w-4" />;
      case 'cold_reactivation': return <Zap className="h-4 w-4" />;
      case 'proposal_follow': return <Mail className="h-4 w-4" />;
      case 'demo_schedule': return <Calendar className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Lead Nurturing</h2>
          <p className="text-muted-foreground">
            Sistema automatizado de nutrição e reativação de leads
          </p>
        </div>
        <Button 
          onClick={() => generateTasksMutation.mutate()}
          disabled={generateTasksMutation.isPending}
        >
          <Zap className="h-4 w-4 mr-2" />
          Gerar Tarefas Automáticas
        </Button>
      </div>

      {/* Métricas de Lead Nurturing */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadMetrics?.totalLeads || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Leads no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Leads Frios</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {leadMetrics?.coldLeads || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sem contato há 30+ dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {leadMetrics?.activeTasks || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tarefas pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Oportunidade de Conversão</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {leadMetrics?.conversionOpportunity || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Leads frios com alto score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Frios */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Frios (Últimos 30 dias)</CardTitle>
          <CardDescription>
            Leads que precisam de reativação urgente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!coldLeads || coldLeads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lead frio encontrado</h3>
              <p className="text-muted-foreground">
                Excelente! Todos os leads estão sendo acompanhados adequadamente.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Último Contato</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Oportunidades</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coldLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{lead.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.last_contact_date 
                          ? formatDistanceToNow(new Date(lead.last_contact_date), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })
                          : 'Nunca contatado'
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lead.days_since_contact} dias
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLeadScoreColor(lead.lead_score)}>
                        {lead.lead_score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {lead.opportunities_count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Tarefas de Nutrição */}
      <Card>
        <CardHeader>
          <CardTitle>Tarefas de Nutrição</CardTitle>
          <CardDescription>
            Tarefas automáticas e manuais para acompanhamento de leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!nurturingTasks || nurturingTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa pendente</h3>
              <p className="text-muted-foreground mb-4">
                Gere tarefas automáticas para leads que precisam de atenção
              </p>
              <Button onClick={() => generateTasksMutation.mutate()}>
                <Zap className="h-4 w-4 mr-2" />
                Gerar Tarefas
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarefa</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nurturingTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">{task.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{task.customers?.[0]?.name || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTaskTypeIcon(task.task_type)}
                        <span className="text-sm capitalize">
                          {task.task_type.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={task.status === 'concluida' ? 'default' : 'outline'}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.status === 'pendente' && (
                        <Button
                          size="sm"
                          onClick={() => updateTaskMutation.mutate({ 
                            taskId: task.id, 
                            status: 'concluida' 
                          })}
                          disabled={updateTaskMutation.isPending}
                        >
                          Concluir
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadNurturingDashboard;