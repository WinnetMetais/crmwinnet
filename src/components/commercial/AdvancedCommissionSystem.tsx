import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calculator, 
  Plus, 
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type Commission = Database['public']['Tables']['commissions']['Row'];
type CommissionRule = Database['public']['Tables']['commission_rules']['Row'];

interface SalesTarget {
  salesperson: string;
  monthly_target: number;
  current_sales: number;
  commission_earned: number;
  deals_closed: number;
  achievement_percentage: number;
}

export const AdvancedCommissionSystem = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [salesTargets, setSalesTargets] = useState<SalesTarget[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedPeriod, selectedSalesperson]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadCommissions(),
        loadRules(),
        loadSalesTargets()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommissions = async () => {
    try {
      let query = supabase.from('commissions').select('*');
      
      if (selectedSalesperson !== 'all') {
        query = query.eq('user_id', selectedSalesperson);
      }
      
      if (selectedPeriod === 'current-month') {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        query = query.gte('created_at', firstDay.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      setCommissions(data || []);
    } catch (error) {
      console.error('Erro ao carregar comissões:', error);
    }
  };

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('commission_rules')
        .select('*')
        .eq('active', true)
        .order('min_value', { ascending: true });
      
      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
    }
  };

  const loadSalesTargets = async () => {
    try {
      const { data: deals, error } = await supabase
        .from('deals')
        .select('assigned_to, value, status, created_at')
        .eq('status', 'won');

      if (error) throw error;

      const targetsByPerson = deals?.reduce((acc, deal) => {
        const salesperson = deal.assigned_to || 'Não atribuído';
        if (!acc[salesperson]) {
          acc[salesperson] = {
            salesperson,
            monthly_target: 100000,
            current_sales: 0,
            commission_earned: 0,
            deals_closed: 0,
            achievement_percentage: 0
          };
        }

        acc[salesperson].current_sales += deal.value || 0;
        acc[salesperson].deals_closed += 1;
        
        return acc;
      }, {} as Record<string, SalesTarget>) || {};

      Object.values(targetsByPerson).forEach(target => {
        const personCommissions = commissions.filter(c => c.user_id === target.salesperson);
        target.commission_earned = personCommissions.reduce((sum, c) => sum + (c.amount || 0), 0);
        target.achievement_percentage = (target.current_sales / target.monthly_target) * 100;
      });

      setSalesTargets(Object.values(targetsByPerson));
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  };

  const approveCommission = async (commissionId: string) => {
    try {
      const { error } = await supabase
        .from('commissions')
        .update({ status: 'aprovado' })
        .eq('id', commissionId);

      if (error) throw error;

      toast({
        title: "Comissão aprovada",
        description: "A comissão foi aprovada com sucesso!",
      });

      loadCommissions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar comissão",
        variant: "destructive",
      });
    }
  };

  const calculateCommissionByRule = (salesAmount: number): { rate: number; amount: number; rule?: CommissionRule } => {
    const applicableRule = rules.find(rule => 
      salesAmount >= (rule.min_value || 0) && salesAmount <= (rule.max_value || 0)
    );

    if (applicableRule) {
      const amount = salesAmount * ((applicableRule.percentage || 0) / 100);
      return { 
        rate: applicableRule.percentage || 0, 
        amount,
        rule: applicableRule 
      };
    }

    return { rate: 3, amount: salesAmount * 0.03 };
  };

  const totalCommissions = commissions.reduce((sum, comm) => sum + (comm.amount || 0), 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pendente').length;
  const approvedCommissions = commissions.filter(c => c.status === 'aprovado').length;
  const avgCommissionRate = commissions.length ? 
    commissions.reduce((sum, comm) => sum + (comm.percentage || 0), 0) / commissions.length : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'aprovado': return 'bg-blue-100 text-blue-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Mês Atual</SelectItem>
            <SelectItem value="last-month">Mês Anterior</SelectItem>
            <SelectItem value="all-time">Todo o Período</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Vendedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Comissões</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCommissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCommissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCommissionRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commissions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="targets">Metas</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comissões Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex-1">
                      <p className="font-medium">Deal: {commission.deal_id}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(commission.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        {commission.percentage && ` (${commission.percentage}%)`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(commission.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(commission.status || 'pendente')}>
                        {commission.status || 'pendente'}
                      </Badge>
                      {commission.status === 'pendente' && (
                        <Button 
                          size="sm" 
                          onClick={() => approveCommission(commission.id)}
                        >
                          Aprovar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {commissions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma comissão registrada no período selecionado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targets" className="space-y-4">
          {salesTargets.map((target) => (
            <Card key={target.salesperson}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{target.salesperson}</span>
                  <Badge variant="outline">{target.deals_closed} negócios</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Meta: R$ {target.monthly_target.toLocaleString('pt-BR')}</span>
                    <span className={getAchievementColor(target.achievement_percentage)}>
                      {target.achievement_percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={Math.min(target.achievement_percentage, 100)} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vendas Atuais</p>
                    <p className="font-bold">R$ {target.current_sales.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comissão Acumulada</p>
                    <p className="font-bold text-green-600">
                      R$ {target.commission_earned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Comissão Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between border p-3 rounded">
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(rule.min_value || 0).toLocaleString('pt-BR')} - 
                        R$ {(rule.max_value || 0).toLocaleString('pt-BR')}
                      </p>
                      {rule.product_category && (
                        <p className="text-xs text-muted-foreground">Categoria: {rule.product_category}</p>
                      )}
                    </div>
                    <Badge variant="secondary">{rule.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Simulador de Comissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Valor da Venda (R$)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 50000"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    const result = calculateCommissionByRule(value);
                    const calcResult = document.getElementById('calc-result');
                    if (calcResult) {
                      calcResult.innerHTML = `
                        <p class="text-sm text-muted-foreground">Taxa: ${result.rate}%</p>
                        <p class="text-2xl font-bold text-green-700">
                          R$ ${result.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        ${result.rule ? `<p class="text-xs text-muted-foreground">Regra: ${result.rule.name}</p>` : ''}
                      `;
                    }
                  }}
                />
              </div>
              <div id="calc-result" className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Digite um valor para calcular</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
