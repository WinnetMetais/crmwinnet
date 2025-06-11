import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Target, BarChart3, TrendingUp, PieChart } from "lucide-react";

const ModuleAnalysis = () => {
  const analysisModules = [
    {
      name: "Análises",
      icon: BarChart3,
      status: "parcial",
      implemented: [
        "CRM Overview básico",
        "Estrutura de análise inicial"
      ],
      missing: [
        "Dashboard de vendas detalhado",
        "Análise de performance de produtos",
        "Relatório de conversão de leads",
        "Análise de margem por categoria",
        "Gráficos de tendências temporais",
        "Análise de sazonalidade",
        "Comparativo período anterior",
        "Métricas de ROI por cliente"
      ]
    },
    {
      name: "Conteúdo",
      icon: Target,
      status: "não implementado",
      implemented: [],
      missing: [
        "Planejamento de conteúdo",
        "Calendário editorial",
        "Gestão de campanhas de marketing",
        "Templates de propostas",
        "Biblioteca de materiais técnicos",
        "Catálogo digital de produtos",
        "Gestão de imagens de produtos",
        "Sistema de aprovação de conteúdo"
      ]
    },
    {
      name: "Comercial",
      icon: TrendingUp,
      status: "implementado",
      implemented: [
        "Gestão de clientes",
        "Cadastro de produtos",
        "Sistema de orçamentos",
        "Pipeline de vendas",
        "Kanban de oportunidades",
        "Cálculo automático de margens",
        "Funil de vendas"
      ],
      missing: [
        "Integração com WhatsApp",
        "Envio automático de orçamentos por email",
        "Assinatura digital de contratos",
        "Sistema de comissões",
        "Controle de metas por vendedor",
        "Histórico de negociações"
      ]
    },
    {
      name: "Ferramentas",
      icon: PieChart,
      status: "parcial",
      implemented: [
        "Estrutura básica de relatórios"
      ],
      missing: [
        "Gerador de relatórios customizados",
        "Exportação para PDF/Excel",
        "Agenda integrada",
        "Sistema de tarefas",
        "Filtros avançados por data/período",
        "Backup automático de dados",
        "Integração com Google Calendar",
        "Notificações push"
      ]
    },
    {
      name: "Configurações",
      icon: AlertCircle,
      status: "não implementado",
      implemented: [],
      missing: [
        "Gestão de usuários e permissões",
        "Configuração de margens padrão",
        "Personalização de campos",
        "Configuração de email SMTP",
        "Backup e restauração",
        "Logs de auditoria",
        "Configuração de impostos",
        "Templates de documentos",
        "Integração com APIs externas"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implementado": return "bg-green-100 text-green-800";
      case "parcial": return "bg-yellow-100 text-yellow-800";
      case "não implementado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "implementado": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "parcial": return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "não implementado": return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Análise dos Módulos do CRM</h1>
                <p className="text-muted-foreground">Mapeamento detalhado de funcionalidades implementadas e pendentes</p>
              </div>
            </div>

            <div className="grid gap-6">
              {analysisModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card key={module.name} className="w-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6" />
                          <span>{module.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(module.status)}
                          <Badge className={getStatusColor(module.status)}>
                            {module.status}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Implementado */}
                        <div>
                          <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Implementado ({module.implemented.length})
                          </h4>
                          {module.implemented.length > 0 ? (
                            <ul className="space-y-2">
                              {module.implemented.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhuma funcionalidade implementada</p>
                          )}
                        </div>

                        {/* Pendente */}
                        <div>
                          <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Pendente ({module.missing.length})
                          </h4>
                          {module.missing.length > 0 ? (
                            <ul className="space-y-2">
                              {module.missing.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">Todas as funcionalidades implementadas</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Resumo Geral */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resumo Geral do CRM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analysisModules.reduce((acc, mod) => acc + mod.implemented.length, 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Funcionalidades Implementadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {analysisModules.reduce((acc, mod) => acc + mod.missing.length, 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Funcionalidades Pendentes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.round((analysisModules.reduce((acc, mod) => acc + mod.implemented.length, 0) / 
                        (analysisModules.reduce((acc, mod) => acc + mod.implemented.length + mod.missing.length, 0)) * 100))}%
                    </div>
                    <p className="text-sm text-muted-foreground">Completude do Sistema</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Prioridades Recomendadas:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>Finalizar módulo de Configurações (gestão de usuários, permissões)</li>
                    <li>Implementar sistema de relatórios avançados</li>
                    <li>Adicionar funcionalidades de comunicação (email, WhatsApp)</li>
                    <li>Desenvolver módulo de Conteúdo completo</li>
                    <li>Expandir análises e métricas do CRM</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ModuleAnalysis;
