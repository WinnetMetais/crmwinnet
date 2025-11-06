import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Users, Calculator, Plus } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type Commission = Database['public']['Tables']['commissions']['Row'];
type CommissionRule = Database['public']['Tables']['commission_rules']['Row'];

export const CommissionSystem = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [newRule, setNewRule] = useState({
    name: '',
    min_value: 0,
    max_value: 0,
    percentage: 0,
  });
  const [calcSales, setCalcSales] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCommissions();
    loadRules();
  }, []);

  const loadCommissions = async () => {
    try {
      const { data, error } = await supabase
        .from('commissions')
        .select('*')
        .order('created_at', { ascending: false });
      
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

  const handleCreateRule = async () => {
    if (!newRule.name || newRule.percentage <= 0 || newRule.min_value >= newRule.max_value) {
      toast({
        title: "Campos inválidos",
        description: "Preencha todos os campos corretamente e verifique as faixas de vendas.",
        variant: "destructive",
      });
      return;
    }

    const hasOverlap = rules.some(
      rule =>
        (newRule.min_value >= (rule.min_value || 0) && newRule.min_value <= (rule.max_value || 0)) ||
        (newRule.max_value >= (rule.min_value || 0) && newRule.max_value <= (rule.max_value || 0))
    );
    
    if (hasOverlap) {
      toast({
        title: "Conflito de faixa",
        description: "A faixa de vendas se sobrepõe a uma regra existente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('commission_rules').insert({
        name: newRule.name,
        min_value: newRule.min_value,
        max_value: newRule.max_value,
        percentage: newRule.percentage,
        user_id: user.id,
        active: true,
      });

      if (error) throw error;

      setNewRule({ name: '', min_value: 0, max_value: 0, percentage: 0 });
      loadRules();
      
      toast({
        title: "Sucesso",
        description: "Regra de comissão criada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar regra:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar regra de comissão",
        variant: "destructive",
      });
    }
  };

  const [calcRate, setCalcRate] = useState(0);
  const [calcResult, setCalcResult] = useState(0);

  const totalCommissions = commissions.reduce((sum, comm) => sum + (comm.amount || 0), 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pendente').length;
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

  const handleCalculateCommission = () => {
    const result = calcSales * (calcRate / 100);
    setCalcResult(result);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Comissões Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCommissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa Média</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCommissionRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Comissões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Deal: {commission.deal_id}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(commission.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                        {commission.percentage && ` (${commission.percentage}%)`}
                      </p>
                    </div>
                    <Badge className={getStatusColor(commission.status || 'pendente')}>
                      {commission.status || 'pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Regra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome da Regra</Label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Ex: Bronze"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Vendas Mín (R$)</Label>
                  <Input
                    type="number"
                    value={newRule.min_value}
                    onChange={(e) => setNewRule({ ...newRule, min_value: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Vendas Máx (R$)</Label>
                  <Input
                    type="number"
                    value={newRule.max_value}
                    onChange={(e) => setNewRule({ ...newRule, max_value: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Taxa (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newRule.percentage}
                    onChange={(e) => setNewRule({ ...newRule, percentage: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateRule} disabled={loading}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Regra
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between border p-3 rounded">
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(rule.min_value || 0).toLocaleString('pt-BR')} - R$ {(rule.max_value || 0).toLocaleString('pt-BR')}
                      </p>
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
                Calculadora de Comissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Valor da Venda (R$)</Label>
                <Input
                  type="number"
                  value={calcSales}
                  onChange={(e) => setCalcSales(parseFloat(e.target.value))}
                  placeholder="Ex: 50000"
                />
              </div>
              <div>
                <Label>Taxa de Comissão (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={calcRate}
                  onChange={(e) => setCalcRate(parseFloat(e.target.value))}
                  placeholder="Ex: 3.5"
                />
              </div>
              <Button onClick={handleCalculateCommission} className="w-full">
                Calcular
              </Button>
              {calcResult > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Comissão Estimada:</p>
                  <p className="text-2xl font-bold text-green-700">
                    R$ {calcResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
