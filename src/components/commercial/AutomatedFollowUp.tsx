import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  Plus,
  PlayCircle,
  PauseCircle,
  Settings,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { format, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FollowUpRule {
  id: string;
  name: string;
  trigger_condition: string;
  delay_days: number;
  action_type: 'email' | 'whatsapp' | 'task' | 'call';
  template_content: string;
  active: boolean;
  priority: 'baixa' | 'media' | 'alta';
}

interface ScheduledAction {
  id: string;
  customer_id: string;
  rule_id: string;
  action_type: string;
  scheduled_date: string;
  status: 'pending' | 'executed' | 'failed' | 'skipped';
  content: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

interface AutomationStats {
  total_rules: number;
  active_rules: number;
  pending_actions: number;
  executed_today: number;
  success_rate: number;
}

export const AutomatedFollowUp = () => {
  const [rules, setRules] = useState<FollowUpRule[]>([]);
  const [scheduledActions, setScheduledActions] = useState<ScheduledAction[]>([]);
  const [stats, setStats] = useState<AutomationStats>({
    total_rules: 0,
    active_rules: 0,
    pending_actions: 0,
    executed_today: 0,
    success_rate: 0
  });
  const [loading, setLoading] = useState(false);
  const [showCreateRule, setShowCreateRule] = useState(false);

  const [newRule, setNewRule] = useState<Partial<FollowUpRule>>({
    name: '',
    trigger_condition: 'no_contact_7_days',
    delay_days: 1,
    action_type: 'email',
    template_content: '',
    priority: 'media'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadRules(),
        loadScheduledActions(),
        calculateStats()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async () => {
    // Simulate loading follow-up rules
    const mockRules: FollowUpRule[] = [
      {
        id: '1',
        name: 'Follow-up após 7 dias sem contato',
        trigger_condition: 'no_contact_7_days',
        delay_days: 1,
        action_type: 'email',
        template_content: 'Olá {nome}, há alguns dias não conversamos. Gostaria de agendar uma conversa para apresentar nossos novos produtos?',
        active: true,
        priority: 'media'
      },
      {
        id: '2',
        name: 'WhatsApp para leads frios',
        trigger_condition: 'cold_lead_30_days',
        delay_days: 0,
        action_type: 'whatsapp',
        template_content: 'Oi {nome}! Temos uma promoção especial que pode interessar sua empresa. Posso te enviar os detalhes?',
        active: true,
        priority: 'alta'
      },
      {
        id: '3',
        name: 'Ligação para oportunidades paradas',
        trigger_condition: 'opportunity_stuck_15_days',
        delay_days: 2,
        action_type: 'call',
        template_content: 'Agendar ligação para discutir proposta com {nome}',
        active: false,
        priority: 'alta'
      }
    ];
    setRules(mockRules);
  };

  const loadScheduledActions = async () => {
    // Simulate loading scheduled actions
    const mockActions: ScheduledAction[] = [
      {
        id: '1',
        customer_id: 'c1',
        rule_id: '1',
        action_type: 'email',
        scheduled_date: new Date().toISOString(),
        status: 'pending',
        content: 'Follow-up de 7 dias',
        customer_name: 'João Silva',
        customer_email: 'joao@empresa.com',
        customer_phone: '(11) 99999-9999'
      },
      {
        id: '2',
        customer_id: 'c2',
        rule_id: '2',
        action_type: 'whatsapp',
        scheduled_date: addDays(new Date(), 1).toISOString(),
        status: 'pending',
        content: 'WhatsApp para lead frio',
        customer_name: 'Maria Santos',
        customer_email: 'maria@empresa.com',
        customer_phone: '(11) 88888-8888'
      }
    ];
    setScheduledActions(mockActions);
  };

  const calculateStats = async () => {
    setStats({
      total_rules: 5,
      active_rules: 3,
      pending_actions: 12,
      executed_today: 8,
      success_rate: 85.2
    });
  };

  const createRule = async () => {
    if (!newRule.name || !newRule.template_content) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate creating rule
      const rule: FollowUpRule = {
        id: Date.now().toString(),
        ...newRule as FollowUpRule,
      };

      setRules([rule, ...rules]);
      setNewRule({
        name: '',
        trigger_condition: 'no_contact_7_days',
        delay_days: 1,
        action_type: 'email',
        template_content: '',
        priority: 'media'
      });
      setShowCreateRule(false);

      toast({
        title: "Regra criada",
        description: "Nova regra de follow-up foi criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar regra",
        variant: "destructive",
      });
    }
  };

  const toggleRule = async (ruleId: string, active: boolean) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, active } : rule
    ));

    toast({
      title: active ? "Regra ativada" : "Regra desativada",
      description: `A regra foi ${active ? 'ativada' : 'desativada'} com sucesso!`,
    });
  };

  const executeAction = async (actionId: string) => {
    setScheduledActions(scheduledActions.map(action => 
      action.id === actionId ? { ...action, status: 'executed' } : action
    ));

    toast({
      title: "Ação executada",
      description: "A ação de follow-up foi executada com sucesso!",
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <Phone className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'task': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed': return 'bg-success/15 text-success';
      case 'pending': return 'bg-warning/15 text-warning';
      case 'failed': return 'bg-destructive/15 text-destructive';
      case 'skipped': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-destructive/15 text-destructive';
      case 'media': return 'bg-warning/15 text-warning';
      case 'baixa': return 'bg-success/15 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const triggerConditions = [
    { value: 'no_contact_7_days', label: 'Sem contato há 7 dias' },
    { value: 'no_contact_15_days', label: 'Sem contato há 15 dias' },
    { value: 'cold_lead_30_days', label: 'Lead frio há 30 dias' },
    { value: 'opportunity_stuck_15_days', label: 'Oportunidade parada há 15 dias' },
    { value: 'quote_not_responded_7_days', label: 'Orçamento sem resposta há 7 dias' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Follow-up Automatizado</h2>
          <p className="text-muted-foreground">
            Sistema inteligente de automação de follow-ups e lembretes comerciais
          </p>
        </div>
        <Dialog open={showCreateRule} onOpenChange={setShowCreateRule}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Regra de Follow-up</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome da Regra</Label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="Ex: Follow-up leads frios"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Condição de Disparo</Label>
                  <Select 
                    value={newRule.trigger_condition} 
                    onValueChange={(value) => setNewRule({...newRule, trigger_condition: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerConditions.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo de Ação</Label>
                  <Select 
                    value={newRule.action_type} 
                    onValueChange={(value: any) => setNewRule({...newRule, action_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="call">Ligação</SelectItem>
                      <SelectItem value="task">Tarefa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Atraso (dias)</Label>
                  <Input
                    type="number"
                    value={newRule.delay_days}
                    onChange={(e) => setNewRule({...newRule, delay_days: Number(e.target.value)})}
                    min="0"
                  />
                </div>

                <div>
                  <Label>Prioridade</Label>
                  <Select 
                    value={newRule.priority} 
                    onValueChange={(value: any) => setNewRule({...newRule, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Template da Mensagem</Label>
                <Textarea
                  value={newRule.template_content}
                  onChange={(e) => setNewRule({...newRule, template_content: e.target.value})}
                  placeholder="Use {nome}, {empresa}, etc. para personalizar"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateRule(false)}>
                  Cancelar
                </Button>
                <Button onClick={createRule}>
                  Criar Regra
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Regras</p>
                <p className="text-2xl font-bold">{stats.total_rules}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regras Ativas</p>
                <p className="text-2xl font-bold text-green-600">{stats.active_rules}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ações Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending_actions}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Executadas Hoje</p>
                <p className="text-2xl font-bold">{stats.executed_today}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">{stats.success_rate}%</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Regras de Automação</TabsTrigger>
          <TabsTrigger value="scheduled">Ações Agendadas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getActionIcon(rule.action_type)}
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge className={getPriorityColor(rule.priority)}>
                          {rule.priority}
                        </Badge>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {triggerConditions.find(t => t.value === rule.trigger_condition)?.label}
                      </p>
                      <p className="text-sm">{rule.template_content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRule(rule.id, !rule.active)}
                      >
                        {rule.active ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Ações Agendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getActionIcon(action.action_type)}
                        <h3 className="font-medium">{action.customer_name}</h3>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status === 'pending' ? 'Pendente' :
                           action.status === 'executed' ? 'Executada' :
                           action.status === 'failed' ? 'Falhou' : action.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {action.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Agendado para: {format(parseISO(action.scheduled_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {action.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => executeAction(action.id)}
                        >
                          Executar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Execução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Histórico será implementado em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};