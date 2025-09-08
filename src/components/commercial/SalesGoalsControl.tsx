
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, Award, Plus } from "lucide-react";

interface SalesGoal {
  id: string;
  salesperson: string;
  period: string;
  goal: number;
  achieved: number;
  percentage: number;
  status: 'on-track' | 'behind' | 'exceeded' | 'at-risk';
  daysRemaining: number;
}

export const SalesGoalsControl = () => {
  const [goals, setGoals] = useState<SalesGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    salesperson: '',
    periodType: 'monthly',
    goal: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  // Carregar metas do Supabase
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales_goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Converter para formato esperado pelo componente
      const formattedGoals = data?.map(goal => ({
        id: goal.id,
        salesperson: goal.salesperson,
        period: `${goal.period_start} - ${goal.period_end}`,
        goal: Number(goal.goal_amount),
        achieved: Number(goal.current_amount || 0),
        percentage: Math.round((Number(goal.current_amount || 0) / Number(goal.goal_amount)) * 100),
        status: getGoalStatus(Number(goal.current_amount || 0), Number(goal.goal_amount)),
        daysRemaining: Math.max(0, Math.ceil((new Date(goal.period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      })) || [];
      
      setGoals(formattedGoals);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalStatus = (achieved: number, goal: number): 'on-track' | 'behind' | 'exceeded' | 'at-risk' => {
    const percentage = (achieved / goal) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 75) return 'on-track';
    if (percentage >= 50) return 'behind';
    return 'at-risk';
  };

  const createGoal = async () => {
    if (!newGoal.salesperson || newGoal.goal <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calcular datas baseado no tipo de período
      let periodStart: Date, periodEnd: Date;
      
      if (newGoal.periodType === 'daily') {
        periodStart = new Date(newGoal.year, newGoal.month - 1, 1);
        periodEnd = new Date(newGoal.year, newGoal.month - 1, 1);
      } else if (newGoal.periodType === 'monthly') {
        periodStart = new Date(newGoal.year, newGoal.month - 1, 1);
        periodEnd = new Date(newGoal.year, newGoal.month, 0);
      } else { // yearly
        periodStart = new Date(newGoal.year, 0, 1);
        periodEnd = new Date(newGoal.year, 11, 31);
      }
      
      const { error } = await supabase
        .from('sales_goals')
        .insert({
          salesperson: newGoal.salesperson,
          period_start: periodStart.toISOString().split('T')[0],
          period_end: periodEnd.toISOString().split('T')[0],
          period_type: newGoal.periodType,
          goal_amount: newGoal.goal,
          current_amount: 0,
          user_id: user.id
        });

      if (error) throw error;

      setNewGoal({ 
        salesperson: '', 
        periodType: 'monthly', 
        goal: 0,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      });
      loadGoals();
      
      toast({
        title: "Sucesso",
        description: "Meta criada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar meta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedGoals = data?.map(goal => {
        const percentage = goal.goal_amount > 0 ? (goal.current_amount / goal.goal_amount) * 100 : 0;
        const status: SalesGoal['status'] = 
          percentage >= 100 ? 'exceeded' :
          percentage >= 80 ? 'on-track' :
          percentage >= 60 ? 'behind' : 'at-risk';

        return {
          id: goal.id,
          salesperson: goal.salesperson,
          period: `${goal.period_type} ${new Date(goal.period_start).getFullYear()}`,
          goal: goal.goal_amount,
          achieved: goal.current_amount,
          percentage,
          status,
          daysRemaining: Math.max(0, Math.ceil(
            (new Date(goal.period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ))
        };
      }) || [];

      setGoals(formattedGoals);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar metas de vendas.",
        variant: "destructive"
      });
    }
  };

  const totalGoals = goals.reduce((sum, goal) => sum + goal.goal, 0);
  const totalAchieved = goals.reduce((sum, goal) => sum + goal.achieved, 0);
  const overallPercentage = (totalAchieved / totalGoals) * 100;
  const onTrackGoals = goals.filter(g => g.status === 'on-track' || g.status === 'exceeded').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'bg-success/10 text-success';
      case 'on-track': return 'bg-primary/10 text-primary';
      case 'behind': return 'bg-warning/10 text-warning';
      case 'at-risk': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 80) return 'bg-primary';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const handleCreateGoal = async () => {
    if (!newGoal.salesperson || newGoal.goal <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos da meta.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calcular datas baseado no tipo de período
      let periodStart: Date, periodEnd: Date;
      
      if (newGoal.periodType === 'daily') {
        periodStart = new Date(newGoal.year, newGoal.month - 1, 1);
        periodEnd = new Date(newGoal.year, newGoal.month - 1, 1);
      } else if (newGoal.periodType === 'monthly') {
        periodStart = new Date(newGoal.year, newGoal.month - 1, 1);
        periodEnd = new Date(newGoal.year, newGoal.month, 0);
      } else { // yearly
        periodStart = new Date(newGoal.year, 0, 1);
        periodEnd = new Date(newGoal.year, 11, 31);
      }

      const { error } = await supabase
        .from('sales_goals')
        .insert({
          user_id: user.id,
          salesperson: newGoal.salesperson,
          period_type: newGoal.periodType,
          period_start: periodStart.toISOString().split('T')[0],
          period_end: periodEnd.toISOString().split('T')[0],
          goal_amount: newGoal.goal,
          current_amount: 0
        });

      if (error) throw error;

      toast({
        title: "Meta criada",
        description: "Nova meta de vendas foi definida com sucesso!",
      });
      
      setNewGoal({
        salesperson: '',
        periodType: 'monthly',
        goal: 0,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      });
      
      await fetchGoals();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar meta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta Total</p>
                <p className="text-3xl font-bold">R$ {totalGoals.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Realizado</p>
                <p className="text-3xl font-bold">R$ {totalAchieved.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-3xl font-bold">{overallPercentage.toFixed(1)}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">No Prazo</p>
                <p className="text-3xl font-bold">{onTrackGoals}/{goals.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Metas por Vendedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{goal.salesperson}</h4>
                        <p className="text-sm text-muted-foreground">{goal.period}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status === 'exceeded' ? 'Superou' :
                           goal.status === 'on-track' ? 'No prazo' :
                           goal.status === 'behind' ? 'Atrasado' : 'Em risco'}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {goal.daysRemaining} dias restantes
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso: {goal.percentage.toFixed(1)}%</span>
                        <span>R$ {goal.achieved.toLocaleString()} / R$ {goal.goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(goal.percentage)}`}
                          style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                          role="progressbar"
                          aria-valuenow={goal.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Progress: ${goal.percentage.toFixed(1)}%`}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Faltam</p>
                        <p className="font-medium">R$ {(goal.goal - goal.achieved).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Diário Necessário</p>
                        <p className="font-medium">R$ {Math.ceil((goal.goal - goal.achieved) / goal.daysRemaining).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Média Atual</p>
                        <p className="font-medium">R$ {Math.ceil(goal.achieved / (31 - goal.daysRemaining)).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Definir Nova Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="salesperson">Vendedor</Label>
              <Input
                id="salesperson"
                placeholder="Nome do vendedor"
                value={newGoal.salesperson}
                onChange={(e) => setNewGoal({...newGoal, salesperson: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="periodType">Tipo de Meta</Label>
              <select 
                id="periodType"
                className="w-full p-2 border rounded-md"
                value={newGoal.periodType}
                onChange={(e) => setNewGoal({...newGoal, periodType: e.target.value})}
              >
                <option value="daily">Diária</option>
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="year">Ano</Label>
                <Input
                  id="year"
                  type="number"
                  value={newGoal.year}
                  onChange={(e) => setNewGoal({...newGoal, year: Number(e.target.value)})}
                />
              </div>
              {(newGoal.periodType === 'monthly' || newGoal.periodType === 'daily') && (
                <div>
                  <Label htmlFor="month">Mês</Label>
                  <select 
                    id="month"
                    className="w-full p-2 border rounded-md"
                    value={newGoal.month}
                    onChange={(e) => setNewGoal({...newGoal, month: Number(e.target.value)})}
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>
                        {new Date(0, i).toLocaleDateString('pt-BR', {month: 'long'})}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="goal">Meta de Vendas (R$)</Label>
              <Input
                id="goal"
                type="number"
                placeholder="Ex: 150000"
                value={newGoal.goal}
                onChange={(e) => setNewGoal({...newGoal, goal: Number(e.target.value)})}
              />
            </div>

            <Button onClick={createGoal} className="w-full" disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              {loading ? 'Criando...' : 'Definir Meta'}
            </Button>

            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Dicas para Metas</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Defina metas realistas baseadas no histórico</p>
                <p>• Considere sazonalidade do mercado</p>
                <p>• Monitore progresso semanalmente</p>
                <p>• Ajuste estratégias conforme necessário</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
