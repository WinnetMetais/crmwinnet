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

interface Commission {
  id: string;
  salesperson: string;
  base_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  created_at: string;
  deal_id?: string;
  quote_id?: string;
  payment_date?: string;
  bonus_amount?: number;
}

interface CommissionRule {
  id: string;
  name: string;
  min_sales: number;
  max_sales: number;
  rate: number;
  active: boolean;
  bonus_threshold?: number;
  bonus_rate?: number;
}

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
      let query = supabase
        .from('commissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedSalesperson !== 'all') {
        query = query.eq('salesperson', selectedSalesperson);
      }

      // Filter by period
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
        .order('min_sales', { ascending: true });
      
      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
    }
  };

  const loadSalesTargets = async () => {
    try {
      // Fetch deals data to calculate targets
      const { data: deals, error } = await supabase
        .from('deals')
        .select('assigned_to, value, status, created_at')
        .eq('status', 'won');

      if (error) throw error;

      // Group by salesperson and calculate metrics
      const targetsByPerson = deals?.reduce((acc, deal) => {
        const salesperson = deal.assigned_to || 'Não atribuído';
        if (!acc[salesperson]) {
          acc[salesperson] = {
            salesperson,
            monthly_target: 100000, // Default target
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

      // Calculate commission earned and achievement percentage
      Object.values(targetsByPerson).forEach(target => {
        const personCommissions = commissions.filter(c => c.salesperson === target.salesperson);
        target.commission_earned = personCommissions.reduce((sum, c) => sum + c.commission_amount, 0);
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
        .update({ status: 'approved' })
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
      salesAmount >= rule.min_sales && salesAmount <= rule.max_sales
    );

    if (applicableRule) {
      const amount = salesAmount * (applicableRule.rate / 100);
      return { 
        rate: applicableRule.rate, 
        amount,
        rule: applicableRule 
      };
    }

    // Default commission rate if no rule applies
    return { rate: 3, amount: salesAmount * 0.03 };
  };

  const totalCommissions = commissions.reduce((sum, comm) => sum + comm.commission_amount, 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').length;
  const approvedCommissions = commissions.filter(c => c.status === 'approved').length;
  const avgCommissionRate = commissions.length ? 
    commissions.reduce((sum, comm) => sum + comm.commission_rate, 0) / commissions.length : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Mês Atual</SelectItem>
            <SelectItem value="last-month">Mês Anterior</SelectItem>
            <SelectItem value="quarter">Trimestre</SelectItem>
            <SelectItem value="year">Ano</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Vendedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Vendedores</SelectItem>
            <SelectItem value="João Silva">João Silva</SelectItem>
            <SelectItem value="Maria Santos">Maria Santos</SelectItem>
            <SelectItem value="Pedro Costa">Pedro Costa</SelectItem>
            <SelectItem value="Ana Lima">Ana Lima</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Comissões</p>
                <p className="text-3xl font-bold">R$ {totalCommissions.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold">{pendingCommissions}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovadas</p>
                <p className="text-3xl font-bold">{approvedCommissions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Média</p>
                <p className="text-3xl font-bold">{avgCommissionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commissions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="targets">Metas de Vendas</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Comissões</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Vendedor</th>
                        <th className="text-right p-3">Valor Base</th>
                        <th className="text-right p-3">Taxa</th>
                        <th className="text-right p-3">Comissão</th>
                        <th className="text-right p-3">Status</th>
                        <th className="text-right p-3">Data</th>
                        <th className="text-right p-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((commission) => (
                        <tr key={commission.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{commission.salesperson}</td>
                          <td className="p-3 text-right">R$ {commission.base_amount.toLocaleString()}</td>
                          <td className="p-3 text-right">{commission.commission_rate}%</td>
                          <td className="p-3 text-right font-bold text-green-600">
                            R$ {commission.commission_amount.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <Badge className={getStatusColor(commission.status)}>
                              {commission.status === 'pending' ? 'Pendente' : 
                               commission.status === 'approved' ? 'Aprovada' :
                               commission.status === 'paid' ? 'Paga' : commission.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            {new Date(commission.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right">
                            {commission.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => approveCommission(commission.id)}
                              >
                                Aprovar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targets">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho das Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesTargets.map((target) => (
                  <Card key={target.salesperson}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{target.salesperson}</h3>
                          <p className="text-sm text-muted-foreground">
                            {target.deals_closed} deals fechados
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getAchievementColor(target.achievement_percentage)}`}>
                            {target.achievement_percentage.toFixed(1)}%
                          </p>
                          <p className="text-sm text-muted-foreground">da meta</p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={Math.min(target.achievement_percentage, 100)} 
                        className="mb-4" 
                      />
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Vendas Realizadas</p>
                          <p className="font-semibold">R$ {target.current_sales.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Meta Mensal</p>
                          <p className="font-semibold">R$ {target.monthly_target.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Comissão Ganha</p>
                          <p className="font-semibold text-green-600">
                            R$ {target.commission_earned.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Seção de regras de comissão</p>
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Calculadora Avançada de Comissão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Valor de Vendas (R$)</Label>
                      <Input type="number" placeholder="Ex: 150000" />
                    </div>
                    <div>
                      <Label>Vendedor</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o vendedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="joao">João Silva</SelectItem>
                          <SelectItem value="maria">Maria Santos</SelectItem>
                          <SelectItem value="pedro">Pedro Costa</SelectItem>
                          <SelectItem value="ana">Ana Lima</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calcular Comissão
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Resultado da Simulação</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Regra Aplicada:</span>
                        <span className="font-medium">Padrão (3%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comissão Base:</span>
                        <span className="font-medium">R$ 4.500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bônus por Meta:</span>
                        <span className="font-medium text-green-600">R$ 500</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total Final:</span>
                        <span className="text-green-600">R$ 5.000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
