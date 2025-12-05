import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ChevronRight,
  Eye,
  Edit,
  Phone
} from "lucide-react";

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  value: number;
  color: string;
  conversion: number;
  deals: Array<{
    id: string;
    title: string;
    customer: string;
    value: number;
    daysInStage: number;
    probability: number;
  }>;
}

const mockFunnelData: FunnelStage[] = [
  {
    id: 'lead',
    name: 'Leads',
    count: 45,
    value: 150000,
    color: 'bg-blue-500',
    conversion: 100,
    deals: [
      { id: '1', title: 'Chapa de Aço 1000kg', customer: 'Construtora ABC', value: 25000, daysInStage: 2, probability: 25 },
      { id: '2', title: 'Perfis em Alumínio', customer: 'Indústria XYZ', value: 18000, daysInStage: 5, probability: 30 },
    ]
  },
  {
    id: 'qualified',
    name: 'Qualificados',
    count: 28,
    value: 95000,
    color: 'bg-warning',
    conversion: 62,
    deals: [
      { id: '3', title: 'Tubos de Aço Inox', customer: 'Metalúrgica Solar', value: 35000, daysInStage: 8, probability: 60 },
      { id: '4', title: 'Chapas Galvanizadas', customer: 'Construções Modernas', value: 22000, daysInStage: 12, probability: 55 },
    ]
  },
  {
    id: 'proposal',
    name: 'Proposta',
    count: 18,
    value: 72000,
    color: 'bg-orange-500',
    conversion: 64,
    deals: [
      { id: '5', title: 'Estruturas Metálicas', customer: 'Engenharia Forte', value: 48000, daysInStage: 15, probability: 75 },
      { id: '6', title: 'Vigas de Ferro', customer: 'Construtora Prata', value: 24000, daysInStage: 6, probability: 70 },
    ]
  },
  {
    id: 'negotiation',
    name: 'Negociação',
    count: 12,
    value: 58000,
    color: 'bg-purple-500',
    conversion: 67,
    deals: [
      { id: '7', title: 'Barras de Aço Especial', customer: 'Indústria Pesada', value: 38000, daysInStage: 20, probability: 85 },
      { id: '8', title: 'Chapas Perfiladas', customer: 'Metalúrgica Boa Vista', value: 20000, daysInStage: 4, probability: 80 },
    ]
  },
  {
    id: 'won',
    name: 'Fechados',
    count: 8,
    value: 45000,
    color: 'bg-green-500',
    conversion: 67,
    deals: [
      { id: '9', title: 'Projeto Completo Galpão', customer: 'Construções Elite', value: 28000, daysInStage: 1, probability: 100 },
      { id: '10', title: 'Estrutura de Cobertura', customer: 'Engenharia Total', value: 17000, daysInStage: 2, probability: 100 },
    ]
  }
];

export const ImprovedSalesFunnel = () => {
  const totalLeads = mockFunnelData[0]?.count || 0;
  const totalValue = mockFunnelData.reduce((sum, stage) => sum + stage.value, 0);
  const wonDeals = mockFunnelData.find(stage => stage.id === 'won')?.count || 0;
  const overallConversion = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

  const getDaysColor = (days: number) => {
    if (days <= 7) return 'text-success';
    if (days <= 15) return 'text-warning';
    return 'text-destructive';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'bg-success/15 text-success';
    if (probability >= 50) return 'bg-warning/15 text-warning';
    return 'bg-destructive/15 text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Métricas do Funil */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">R$ {totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversão Geral</p>
                <p className="text-2xl font-bold">{overallConversion.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Negócios Ganhos</p>
                <p className="text-2xl font-bold">{wonDeals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funil Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockFunnelData.map((stage, index) => {
              const nextStage = mockFunnelData[index + 1];
              const maxWidth = 100;
              const stageWidth = totalLeads > 0 ? (stage.count / totalLeads) * maxWidth : 0;

              return (
                <div key={stage.id} className="space-y-3">
                  {/* Barra do Estágio */}
                  <div className="flex items-center space-x-4">
                    <div className="w-32 text-right">
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    
                    <div className="flex-1 relative">
                      <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className={`${stage.color} h-full transition-all duration-500 flex items-center justify-center text-white font-medium text-sm`}
                          style={{ width: `${stageWidth}%` }}
                        >
                          {stage.count} deals
                        </div>
                      </div>
                    </div>

                    <div className="w-24 text-center">
                      <p className="font-semibold">R$ {(stage.value / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-muted-foreground">{stage.conversion}%</p>
                    </div>

                    {nextStage && (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Deals do Estágio */}
                  <div className="ml-36 space-y-2">
                    {stage.deals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h4 className="font-medium text-sm">{deal.title}</h4>
                              <p className="text-xs text-muted-foreground">{deal.customer}</p>
                            </div>
                            <Badge className={getProbabilityColor(deal.probability)}>
                              {deal.probability}%
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-sm">R$ {deal.value.toLocaleString()}</p>
                            <p className={`text-xs ${getDaysColor(deal.daysInStage)}`}>
                              {deal.daysInStage} dias
                            </p>
                          </div>

                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Análise de Conversão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão por Estágio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFunnelData.slice(0, -1).map((stage, index) => {
                const nextStage = mockFunnelData[index + 1];
                const conversionRate = stage.count > 0 ? (nextStage.count / stage.count) * 100 : 0;
                
                return (
                  <div key={`${stage.id}-conversion`} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {stage.name} → {nextStage.name}
                      </span>
                      <span className="text-sm font-bold">
                        {conversionRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={conversionRate} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oportunidades em Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockFunnelData
                .flatMap(stage => stage.deals)
                .filter(deal => deal.daysInStage > 15 || deal.probability < 50)
                .map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-sm">{deal.title}</h4>
                      <p className="text-xs text-muted-foreground">{deal.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">R$ {deal.value.toLocaleString()}</p>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {deal.daysInStage}d
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {deal.probability}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};