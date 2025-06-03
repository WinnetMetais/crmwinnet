
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Calendar,
  FileText,
  BarChart3,
  CheckCircle
} from "lucide-react";

export const CRMAnalysis = () => {
  const crmMetrics = {
    totalLeads: 145,
    activeOpportunities: 23,
    monthlyRevenue: 285750,
    conversionRate: 18.5,
    averageTicket: 12400,
    contentPieces: 47,
    scheduledPosts: 15,
    completionRate: 76
  };

  const moduleStatus = [
    { name: 'Gestão Comercial', completion: 95, features: ['Pipeline', 'Oportunidades', 'Orçamentos', 'Funil'] },
    { name: 'Módulo Financeiro', completion: 90, features: ['Receitas', 'Despesas', 'Fluxo de Caixa', 'Relatórios'] },
    { name: 'Planejamento de Conteúdo', completion: 85, features: ['Calendário', 'Estratégias', 'Templates', 'Analytics'] },
    { name: 'Gestão de Clientes', completion: 70, features: ['Cadastro', 'Histórico', 'Segmentação'] },
    { name: 'Relatórios e Analytics', completion: 80, features: ['Dashboards', 'KPIs', 'Exportação'] }
  ];

  const recommendedImprovements = [
    {
      priority: 'Alta',
      module: 'CRM',
      suggestion: 'Adicionar módulo de Automação de Marketing',
      impact: 'Aumentar conversão em 25%'
    },
    {
      priority: 'Média',
      module: 'Vendas',
      suggestion: 'Implementar follow-up automático',
      impact: 'Reduzir tempo de resposta'
    },
    {
      priority: 'Média',
      module: 'Financeiro',
      suggestion: 'Dashboard de previsão de recebimentos',
      impact: 'Melhor planejamento financeiro'
    },
    {
      priority: 'Baixa',
      module: 'Conteúdo',
      suggestion: 'Integração com redes sociais',
      impact: 'Publicação automática'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais do CRM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmMetrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Ativas</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmMetrics.activeOpportunities}</div>
            <p className="text-xs text-muted-foreground">R$ 1.2M em pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmMetrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Meta: 20%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {crmMetrics.averageTicket.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% vs trimestre</p>
          </CardContent>
        </Card>
      </div>

      {/* Status dos Módulos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Status dos Módulos do CRM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleStatus.map((module) => (
              <div key={module.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{module.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {module.features.join(' • ')}
                    </p>
                  </div>
                  <Badge variant={module.completion >= 90 ? 'default' : module.completion >= 80 ? 'secondary' : 'outline'}>
                    {module.completion}%
                  </Badge>
                </div>
                <Progress value={module.completion} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações de Melhorias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recomendações de Melhorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendedImprovements.map((rec, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={
                      rec.priority === 'Alta' ? 'destructive' : 
                      rec.priority === 'Média' ? 'default' : 'secondary'
                    }>
                      {rec.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{rec.module}</span>
                  </div>
                  <h4 className="font-medium">{rec.suggestion}</h4>
                  <p className="text-sm text-muted-foreground">{rec.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Próximas Ações Sugeridas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximas Ações Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <h4 className="font-medium">Implementar Automação de E-mail Marketing</h4>
                <p className="text-sm text-muted-foreground">Para nutrir leads e aumentar conversões</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <h4 className="font-medium">Adicionar Chat Online no Site</h4>
                <p className="text-sm text-muted-foreground">Atendimento em tempo real para qualificar leads</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <h4 className="font-medium">Dashboard de Previsão de Vendas</h4>
                <p className="text-sm text-muted-foreground">Análise preditiva baseada no pipeline atual</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
