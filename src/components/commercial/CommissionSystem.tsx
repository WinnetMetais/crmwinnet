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

interface Commission {
  id: string;
  salesperson: string;
  base_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  created_at: string;
}

interface CommissionRule {
  id: string;
  name: string;
  min_sales: number;
  max_sales: number;
  rate: number;
  active: boolean;
}

export const CommissionSystem = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [newRule, setNewRule] = useState({
    name: '',
    min_sales: 0,
    max_sales: 0,
    rate: 0,
  });
  const [calcSales, setCalcSales] = useState(0);
  const [loading, setLoading] = useState(false);

  // Carregar dados do Supabase
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
        .order('min_sales', { ascending: true });
      
      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
    }
  };

  const createRule = async () => {
    if (!newRule.name || newRule.min_sales >= newRule.max_sales || newRule.rate <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('commission_rules')
        .insert({
          ...newRule,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      setNewRule({ name: '', min_sales: 0, max_sales: 0, rate: 0 });
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
    } finally {
      setLoading(false);
    }
  };
  const [calcRate, setCalcRate] = useState(0);
  const [calcResult, setCalcResult] = useState(0);

  const totalCommissions = commissions.reduce((sum, comm) => sum + comm.commission_amount, 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').length;
  const avgCommissionRate = commissions.length ? commissions.reduce((sum, comm) => sum + comm.commission_rate, 0) / commissions.length : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRule = async () => {
    if (!newRule.name || newRule.rate <= 0 || newRule.min_sales >= newRule.max_sales) {
      toast({
        title: "Campos inválidos",
        description: "Preencha todos os campos corretamente e verifique as faixas de vendas.",
        variant: "destructive",
      });
      return;
    }

    const hasOverlap = rules.some(
      rule =>
        (newRule.min_sales >= rule.min_sales && newRule.min_sales <= rule.max_sales) ||
        (newRule.max_sales >= rule.min_sales && newRule.max_sales <= rule.max_sales)
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
        ...newRule,
        user_id: user.id,
        active: true,
      });
      if (error) throw error;
      
      toast({
        title: "Regra criada",
        description: "Nova regra de comissão foi criada com sucesso!",
      });
      setNewRule({ name: '', min_sales: 0, max_sales: 0, rate: 0 });
      loadRules();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar regra",
        variant: "destructive",
      });
    }
  };

  const handleCalculateCommission = () => {
    const commission = calcSales * (calcRate / 100);
    setCalcResult(commission);
    toast({
      title: "Cálculo realizado",
      description: `Comissão calculada: R$ ${commission.toLocaleString()}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Comissões</p>
                <p className="text-3xl font-bold">R$ {totalCommissions.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" aria-hidden="true" />
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
              <Calculator className="h-8 w-8 text-orange-600" aria-hidden="true" />
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
              <TrendingUp className="h-8 w-8 text-blue-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendedores</p>
                <p className="text-3xl font-bold">{commissions.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commissions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Comissões por Vendedor</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando comissões...</div>
              ) : (
                <div className="overflow-x-auto" role="grid">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" role="row">
                        <th className="text-left p-3" role="columnheader">Vendedor</th>
                        <th className="text-right p-3" role="columnheader">Valor Base</th>
                        <th className="text-right p-3" role="columnheader">Taxa</th>
                        <th className="text-right p-3" role="columnheader">Comissão</th>
                        <th className="text-right p-3" role="columnheader">Status</th>
                        <th className="text-right p-3" role="columnheader">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((commission) => (
                        <tr key={commission.id} className="border-b hover:bg-muted/50" role="row">
                          <td className="p-3 font-medium">{commission.salesperson}</td>
                          <td className="p-3 text-right">R$ {commission.base_amount.toLocaleString()}</td>
                          <td className="p-3 text-right">{commission.commission_rate}%</td>
                          <td className="p-3 text-right font-bold text-green-600">
                            R$ {commission.commission_amount.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            <Badge className={getStatusColor(commission.status)} aria-label={`Status: ${commission.status}`}>
                              {commission.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">{new Date(commission.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regras de Comissão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant={rule.active ? "default" : "secondary"} aria-label={`Regra ${rule.active ? 'Ativa' : 'Inativa'}`}>
                          {rule.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Vendas: R$ {rule.min_sales.toLocaleString()} - R$ {rule.max_sales.toLocaleString()}</p>
                        <p>Taxa: {rule.rate}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nova Regra de Comissão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ruleName">Nome da Regra</Label>
                  <Input
                    id="ruleName"
                    placeholder="Ex: Nível Premium"
                    value={newRule.name}
                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minSales">Vendas Mínimas (R$)</Label>
                    <Input
                      id="minSales"
                      type="number"
                      value={newRule.min_sales}
                      onChange={(e) => setNewRule({...newRule, min_sales: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSales">Vendas Máximas (R$)</Label>
                    <Input
                      id="maxSales"
                      type="number"
                      value={newRule.max_sales}
                      onChange={(e) => setNewRule({...newRule, max_sales: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rate">Taxa de Comissão (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={newRule.rate}
                    onChange={(e) => setNewRule({...newRule, rate: Number(e.target.value)})}
                  />
                </div>

                <Button onClick={handleCreateRule} className="w-full" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Regra
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Calculadora de Comissão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="calcSales">Valor de Vendas (R$)</Label>
                    <Input
                      id="calcSales"
                      type="number"
                      placeholder="Ex: 150000"
                      value={calcSales}
                      onChange={(e) => setCalcSales(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="calcRate">Taxa de Comissão (%)</Label>
                    <Input
                      id="calcRate"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 3.5"
                      value={calcRate}
                      onChange={(e) => setCalcRate(Number(e.target.value))}
                    />
                  </div>
                  <Button onClick={handleCalculateCommission} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular
                  </Button>
                </div>
                <div className="md:col-span-2">
                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Resultado</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Valor de Vendas:</span>
                        <span className="font-medium">R$ {calcSales.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de Comissão:</span>
                        <span className="font-medium">{calcRate.toFixed(1)}%</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Comissão Total:</span>
                        <span className="text-green-600">R$ {calcResult.toLocaleString()}</span>
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