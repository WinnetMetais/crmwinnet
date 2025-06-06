
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Users, Calculator, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Commission {
  id: string;
  salesperson: string;
  period: string;
  salesAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'paid' | 'approved';
  deals: number;
}

interface CommissionRule {
  id: string;
  name: string;
  minSales: number;
  maxSales: number;
  rate: number;
  active: boolean;
}

export const CommissionSystem = () => {
  const [commissions] = useState<Commission[]>([
    {
      id: '1',
      salesperson: 'João Silva',
      period: 'Janeiro 2024',
      salesAmount: 125000,
      commissionRate: 3.5,
      commissionAmount: 4375,
      status: 'paid',
      deals: 8
    },
    {
      id: '2',
      salesperson: 'Maria Santos',
      period: 'Janeiro 2024',
      salesAmount: 98000,
      commissionRate: 3.0,
      commissionAmount: 2940,
      status: 'approved',
      deals: 6
    },
    {
      id: '3',
      salesperson: 'Pedro Costa',
      period: 'Janeiro 2024',
      salesAmount: 156000,
      commissionRate: 4.0,
      commissionAmount: 6240,
      status: 'pending',
      deals: 12
    }
  ]);

  const [rules] = useState<CommissionRule[]>([
    {
      id: '1',
      name: 'Nível Básico',
      minSales: 0,
      maxSales: 50000,
      rate: 2.5,
      active: true
    },
    {
      id: '2',
      name: 'Nível Intermediário',
      minSales: 50001,
      maxSales: 100000,
      rate: 3.0,
      active: true
    },
    {
      id: '3',
      name: 'Nível Avançado',
      minSales: 100001,
      maxSales: 200000,
      rate: 3.5,
      active: true
    },
    {
      id: '4',
      name: 'Nível Expert',
      minSales: 200001,
      maxSales: 999999999,
      rate: 4.5,
      active: true
    }
  ]);

  const [newRule, setNewRule] = useState({
    name: '',
    minSales: 0,
    maxSales: 0,
    rate: 0
  });

  const totalCommissions = commissions.reduce((sum, comm) => sum + comm.commissionAmount, 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').length;
  const avgCommissionRate = commissions.reduce((sum, comm) => sum + comm.commissionRate, 0) / commissions.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRule = () => {
    if (!newRule.name || newRule.rate <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos da regra.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Regra criada",
      description: "Nova regra de comissão foi criada com sucesso!",
    });

    setNewRule({
      name: '',
      minSales: 0,
      maxSales: 0,
      rate: 0
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
              <Calculator className="h-8 w-8 text-orange-600" />
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
              <TrendingUp className="h-8 w-8 text-blue-600" />
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
              <Users className="h-8 w-8 text-purple-600" />
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Vendedor</th>
                      <th className="text-right p-3">Período</th>
                      <th className="text-right p-3">Vendas</th>
                      <th className="text-right p-3">Taxa</th>
                      <th className="text-right p-3">Comissão</th>
                      <th className="text-right p-3">Negócios</th>
                      <th className="text-right p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((commission) => (
                      <tr key={commission.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{commission.salesperson}</td>
                        <td className="p-3 text-right">{commission.period}</td>
                        <td className="p-3 text-right">R$ {commission.salesAmount.toLocaleString()}</td>
                        <td className="p-3 text-right">{commission.commissionRate}%</td>
                        <td className="p-3 text-right font-bold text-green-600">
                          R$ {commission.commissionAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">{commission.deals}</td>
                        <td className="p-3 text-right">
                          <Badge className={getStatusColor(commission.status)}>
                            {commission.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Vendas: R$ {rule.minSales.toLocaleString()} - R$ {rule.maxSales.toLocaleString()}</p>
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
                      value={newRule.minSales}
                      onChange={(e) => setNewRule({...newRule, minSales: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSales">Vendas Máximas (R$)</Label>
                    <Input
                      id="maxSales"
                      type="number"
                      value={newRule.maxSales}
                      onChange={(e) => setNewRule({...newRule, maxSales: Number(e.target.value)})}
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

                <Button onClick={handleCreateRule} className="w-full">
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="calcRate">Taxa de Comissão (%)</Label>
                    <Input
                      id="calcRate"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 3.5"
                    />
                  </div>
                  <Button className="w-full">
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
                        <span className="font-medium">R$ 0,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de Comissão:</span>
                        <span className="font-medium">0,0%</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Comissão Total:</span>
                        <span className="text-green-600">R$ 0,00</span>
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
