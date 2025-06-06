
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, Award, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [goals] = useState<SalesGoal[]>([
    {
      id: '1',
      salesperson: 'João Silva',
      period: 'Janeiro 2024',
      goal: 150000,
      achieved: 125000,
      percentage: 83.3,
      status: 'on-track',
      daysRemaining: 8
    },
    {
      id: '2',
      salesperson: 'Maria Santos',
      period: 'Janeiro 2024',
      goal: 120000,
      achieved: 98000,
      percentage: 81.7,
      status: 'behind',
      daysRemaining: 8
    },
    {
      id: '3',
      salesperson: 'Pedro Costa',
      period: 'Janeiro 2024',
      goal: 100000,
      achieved: 108000,
      percentage: 108.0,
      status: 'exceeded',
      daysRemaining: 8
    },
    {
      id: '4',
      salesperson: 'Ana Lima',
      period: 'Janeiro 2024',
      goal: 130000,
      achieved: 67000,
      percentage: 51.5,
      status: 'at-risk',
      daysRemaining: 8
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    salesperson: '',
    period: '',
    goal: 0
  });

  const totalGoals = goals.reduce((sum, goal) => sum + goal.goal, 0);
  const totalAchieved = goals.reduce((sum, goal) => sum + goal.achieved, 0);
  const overallPercentage = (totalAchieved / totalGoals) * 100;
  const onTrackGoals = goals.filter(g => g.status === 'on-track' || g.status === 'exceeded').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'behind': return 'bg-yellow-100 text-yellow-800';
      case 'at-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-600';
    if (percentage >= 80) return 'bg-blue-600';
    if (percentage >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const handleCreateGoal = () => {
    if (!newGoal.salesperson || !newGoal.period || newGoal.goal <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos da meta.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Meta criada",
      description: "Nova meta de vendas foi definida com sucesso!",
    });

    setNewGoal({
      salesperson: '',
      period: '',
      goal: 0
    });
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
              <Label htmlFor="period">Período</Label>
              <Input
                id="period"
                placeholder="Ex: Fevereiro 2024"
                value={newGoal.period}
                onChange={(e) => setNewGoal({...newGoal, period: e.target.value})}
              />
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

            <Button onClick={handleCreateGoal} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Definir Meta
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
