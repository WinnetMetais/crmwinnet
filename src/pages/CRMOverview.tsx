
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataQualityDashboard } from "@/components/crm/DataQualityDashboard";
import { CRMDataValidator } from "@/components/crm/CRMDataValidator";
import { CRMSystemStatus } from "@/components/crm/CRMSystemStatus";
import { CRMAnalysisReport } from "@/components/crm/CRMAnalysisReport";
import { useCustomers, useDeals, useTasks, useCRMMetrics } from "@/hooks/useCRM";
import { Users, DollarSign, CheckSquare, TrendingUp, RefreshCw, Activity, Target, AlertCircle, BarChart3, Menu } from "lucide-react";
import { CRMDataService } from "@/services/crmData";
import { toast } from "sonner";

const CRMOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: deals, isLoading: dealsLoading } = useDeals();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const metrics = useCRMMetrics();

  const handleSyncData = async () => {
    setIsLoading(true);
    try {
      await CRMDataService.syncCRMData();
      toast.success('Dados sincronizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao sincronizar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const isLoadingData = customersLoading || dealsLoading || tasksLoading;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="page-wrapper">
        <DashboardSidebar />
        
        <div className="flex-1">
          {/* Header limpo e profissional */}
          <header className="header-clean">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-md transition-colors" />
                  <div className="flex items-center gap-4">
                    <div className="icon-wrapper icon-blue">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="heading-1">CRM Overview</h1>
                      <p className="body-medium">Visão completa do relacionamento com clientes</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleSyncData} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-200"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Sincronizar
                </Button>
              </div>
            </div>
          </header>

          {/* Área de conteúdo */}
          <main className="content-area">
            <div className="max-w-7xl mx-auto section-spacing">
              
              {/* Métricas principais */}
              <section className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="heading-2 mb-2">Métricas Principais</h2>
                  <p className="body-medium">Acompanhe os indicadores-chave do seu CRM</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div className="metric-container animate-slide-in">
                    <div className="flex items-center justify-between mb-4">
                      <div className="icon-wrapper icon-blue">
                        <Users className="h-6 w-6" />
                      </div>
                      <Badge className="badge-success">Ativo</Badge>
                    </div>
                    <div>
                      <p className="body-small uppercase tracking-wider text-slate-500 mb-1">Total de Clientes</p>
                      <p className="text-2xl font-bold text-slate-900 mb-1">
                        {isLoadingData ? '...' : metrics.totalCustomers}
                      </p>
                      <p className="body-small text-slate-500">Clientes registrados</p>
                    </div>
                  </div>

                  <div className="metric-container animate-slide-in" style={{animationDelay: '0.1s'}}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="icon-wrapper icon-green">
                        <Target className="h-6 w-6" />
                      </div>
                      <Badge className="badge-success">Crescendo</Badge>
                    </div>
                    <div>
                      <p className="body-small uppercase tracking-wider text-slate-500 mb-1">Negócios Ativos</p>
                      <p className="text-2xl font-bold text-slate-900 mb-1">
                        {isLoadingData ? '...' : metrics.totalDeals}
                      </p>
                      <p className="body-small text-slate-500">Oportunidades em andamento</p>
                    </div>
                  </div>

                  <div className="metric-container animate-slide-in" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="icon-wrapper icon-orange">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <Badge className="badge-neutral">Pipeline</Badge>
                    </div>
                    <div>
                      <p className="body-small uppercase tracking-wider text-slate-500 mb-1">Receita Estimada</p>
                      <p className="text-2xl font-bold text-slate-900 mb-1">
                        {isLoadingData ? '...' : `R$ ${metrics.totalRevenue.toLocaleString()}`}
                      </p>
                      <p className="body-small text-slate-500">Valor do pipeline</p>
                    </div>
                  </div>

                  <div className="metric-container animate-slide-in" style={{animationDelay: '0.3s'}}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="icon-wrapper icon-purple">
                        <CheckSquare className="h-6 w-6" />
                      </div>
                      <Badge className="badge-warning">Atenção</Badge>
                    </div>
                    <div>
                      <p className="body-small uppercase tracking-wider text-slate-500 mb-1">Tarefas Pendentes</p>
                      <p className="text-2xl font-bold text-slate-900 mb-1">
                        {isLoadingData ? '...' : metrics.pendingTasks}
                      </p>
                      <p className="body-small text-slate-500">Requerem ação</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Atividade Recente */}
              <section className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                <div className="mb-6">
                  <h2 className="heading-2 mb-2">Atividade Recente</h2>
                  <p className="body-medium">Acompanhe as últimas atualizações do sistema</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Clientes Recentes */}
                  <Card className="card-clean">
                    <div className="card-header-clean">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-blue-600" />
                          <span className="heading-4">Clientes Recentes</span>
                        </div>
                        <Badge className="badge-neutral">
                          {customers?.slice(0, 5).length || 0}
                        </Badge>
                      </CardTitle>
                    </div>
                    <div className="card-content-clean">
                      <div className="space-y-4">
                        {customers?.slice(0, 5).map((customer) => (
                          <div key={customer.id} className="flex items-center justify-between p-3 rounded-md border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="body-medium font-medium text-slate-900">{customer.name}</p>
                                <p className="body-small text-slate-500">{customer.company || 'Empresa não informada'}</p>
                              </div>
                            </div>
                            <Badge className={customer.status === 'active' ? 'badge-success' : 'badge-neutral'}>
                              {customer.status || 'N/A'}
                            </Badge>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                            <p className="body-medium text-slate-500">
                              {isLoadingData ? 'Carregando clientes...' : 'Nenhum cliente encontrado'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Negócios em Andamento */}
                  <Card className="card-clean">
                    <div className="card-header-clean">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-emerald-600" />
                          <span className="heading-4">Negócios Ativos</span>
                        </div>
                        <Badge className="badge-success">
                          {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').length || 0}
                        </Badge>
                      </CardTitle>
                    </div>
                    <div className="card-content-clean">
                      <div className="space-y-4">
                        {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').slice(0, 5).map((deal) => (
                          <div key={deal.id} className="flex items-center justify-between p-3 rounded-md border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Target className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="body-medium font-medium text-slate-900">{deal.title}</p>
                                <p className="body-small text-slate-500">{deal.customers?.name || 'Cliente não definido'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="body-medium font-semibold text-emerald-600">
                                R$ {(deal.estimated_value || 0).toLocaleString()}
                              </p>
                              <Badge className="badge-neutral text-xs">
                                {deal.status}
                              </Badge>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <Target className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                            <p className="body-medium text-slate-500">
                              {isLoadingData ? 'Carregando negócios...' : 'Nenhum negócio ativo'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Tarefas Urgentes */}
                  <Card className="card-clean">
                    <div className="card-header-clean">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="heading-4">Tarefas Urgentes</span>
                        </div>
                        <Badge className="badge-warning">
                          {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').length || 0}
                        </Badge>
                      </CardTitle>
                    </div>
                    <div className="card-content-clean">
                      <div className="space-y-4">
                        {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 rounded-md border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              </div>
                              <div>
                                <p className="body-medium font-medium text-slate-900">{task.title}</p>
                                <p className="body-small text-slate-500">{task.assigned_to || 'Não atribuído'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="badge-warning mb-1">
                                {task.priority}
                              </Badge>
                              {task.due_date && (
                                <p className="body-small text-slate-500">
                                  {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <CheckSquare className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                            <p className="body-medium text-slate-500">
                              {isLoadingData ? 'Carregando tarefas...' : 'Nenhuma tarefa urgente'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </section>

              {/* Relatórios e Análises */}
              <section className="animate-fade-in" style={{animationDelay: '0.6s'}}>
                <div className="mb-6">
                  <h2 className="heading-2 mb-2">Relatórios e Análises</h2>
                  <p className="body-medium">Insights detalhados sobre o desempenho do CRM</p>
                </div>
                
                <Card className="card-clean">
                  <Tabs defaultValue="analysis" className="w-full">
                    <div className="card-header-clean">
                      <TabsList className="grid grid-cols-4 w-full max-w-4xl bg-slate-100 rounded-md p-1">
                        <TabsTrigger 
                          value="analysis" 
                          className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm py-2 px-4 text-sm font-medium text-slate-600 rounded transition-all"
                        >
                          Análise Geral
                        </TabsTrigger>
                        <TabsTrigger 
                          value="status" 
                          className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm py-2 px-4 text-sm font-medium text-slate-600 rounded transition-all"
                        >
                          Status do Sistema
                        </TabsTrigger>
                        <TabsTrigger 
                          value="quality" 
                          className="data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm py-2 px-4 text-sm font-medium text-slate-600 rounded transition-all"
                        >
                          Qualidade dos Dados
                        </TabsTrigger>
                        <TabsTrigger 
                          value="validator" 
                          className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2 px-4 text-sm font-medium text-slate-600 rounded transition-all"
                        >
                          Validador
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="card-content-clean">
                      <TabsContent value="analysis" className="mt-0">
                        <CRMAnalysisReport />
                      </TabsContent>

                      <TabsContent value="status" className="mt-0">
                        <CRMSystemStatus />
                      </TabsContent>

                      <TabsContent value="quality" className="mt-0">
                        <DataQualityDashboard />
                      </TabsContent>

                      <TabsContent value="validator" className="mt-0">
                        <CRMDataValidator />
                      </TabsContent>
                    </div>
                  </Tabs>
                </Card>
              </section>

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CRMOverview;
