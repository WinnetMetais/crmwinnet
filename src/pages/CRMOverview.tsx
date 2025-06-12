
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
import { Users, DollarSign, CheckSquare, TrendingUp, RefreshCw, Activity, Target, AlertCircle, BarChart3, Calendar, Phone, Mail } from "lucide-react";
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
      <div className="page-container">
        <DashboardSidebar />
        
        <div className="flex-1">
          {/* Header moderno e limpo */}
          <div className="page-header">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors" />
                  <div className="flex items-center gap-4">
                    <div className="icon-container icon-blue">
                      <BarChart3 className="h-7 w-7" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-1">CRM Overview</h1>
                      <p className="text-slate-600">Visão geral completa do sistema de relacionamento com clientes</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleSyncData} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Sincronizar Dados
                </Button>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="page-content">
            <div className="content-wrapper">
              {/* Métricas principais */}
              <div className="space-y-6">
                <div className="section-header">
                  <div className="section-divider"></div>
                  <h2 className="section-title">Métricas Principais</h2>
                  <div className="ml-auto text-sm text-slate-600">
                    Última atualização: {new Date().toLocaleString('pt-BR')}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <Card className="metric-card group hover:border-blue-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">Total Clientes</p>
                          <p className="text-3xl font-bold text-blue-600 mb-1">
                            {isLoadingData ? '...' : metrics.totalCustomers}
                          </p>
                          <p className="text-sm text-slate-500">Clientes ativos</p>
                        </div>
                        <div className="icon-container icon-blue group-hover:bg-blue-100 transition-colors">
                          <Users className="h-7 w-7" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="metric-card group hover:border-emerald-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">Negócios Abertos</p>
                          <p className="text-3xl font-bold text-emerald-600 mb-1">
                            {isLoadingData ? '...' : metrics.totalDeals}
                          </p>
                          <p className="text-sm text-slate-500">Oportunidades ativas</p>
                        </div>
                        <div className="icon-container icon-emerald group-hover:bg-emerald-100 transition-colors">
                          <Target className="h-7 w-7" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="metric-card group hover:border-orange-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">Receita Pipeline</p>
                          <p className="text-3xl font-bold text-orange-600 mb-1">
                            {isLoadingData ? '...' : `R$ ${metrics.totalRevenue.toLocaleString()}`}
                          </p>
                          <p className="text-sm text-slate-500">Valor estimado</p>
                        </div>
                        <div className="icon-container icon-orange group-hover:bg-orange-100 transition-colors">
                          <DollarSign className="h-7 w-7" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="metric-card group hover:border-purple-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">Tarefas Pendentes</p>
                          <p className="text-3xl font-bold text-purple-600 mb-1">
                            {isLoadingData ? '...' : metrics.pendingTasks}
                          </p>
                          <p className="text-sm text-slate-500">Aguardando ação</p>
                        </div>
                        <div className="icon-container icon-purple group-hover:bg-purple-100 transition-colors">
                          <CheckSquare className="h-7 w-7" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Dados em tempo real */}
              <div className="space-y-6">
                <div className="section-header">
                  <div className="section-divider"></div>
                  <h2 className="section-title">Atividade Recente</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Clientes Recentes */}
                  <Card className="data-card">
                    <div className="card-header">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center gap-3 text-slate-900">
                          <Users className="h-5 w-5 text-blue-600" />
                          Clientes Recentes
                        </span>
                        <Badge className="badge-active">
                          {customers?.slice(0, 5).length || 0}
                        </Badge>
                      </CardTitle>
                    </div>
                    <div className="card-content">
                      <div className="space-y-4">
                        {customers?.slice(0, 5).map((customer) => (
                          <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{customer.name}</p>
                                <p className="text-sm text-slate-600">{customer.company || 'Sem empresa'}</p>
                              </div>
                            </div>
                            <Badge className={customer.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                              {customer.status || 'N/A'}
                            </Badge>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-500">
                              {isLoadingData ? 'Carregando clientes...' : 'Nenhum cliente encontrado'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Negócios Ativos */}
                  <Card className="data-card">
                    <div className="card-header">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center gap-3 text-slate-900">
                          <Target className="h-5 w-5 text-emerald-600" />
                          Negócios Ativos
                        </span>
                        <Badge className="badge-active">
                          {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').length || 0}
                        </Badge>
                      </CardTitle>
                    </div>
                    <div className="card-content">
                      <div className="space-y-4">
                        {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').slice(0, 5).map((deal) => (
                          <div key={deal.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Target className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{deal.title}</p>
                                <p className="text-sm text-slate-600">{deal.customers?.name || 'Cliente não definido'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-emerald-600">
                                R$ {(deal.estimated_value || 0).toLocaleString()}
                              </p>
                              <Badge className="badge-inactive text-xs mt-1">
                                {deal.status}
                              </Badge>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <Target className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-500">
                              {isLoadingData ? 'Carregando negócios...' : 'Nenhum negócio ativo'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Tarefas Urgentes */}
                  <Card className="data-card">
                    <div className="card-header">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center gap-3 text-slate-900">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          Tarefas Urgentes
                        </span>
                        <Badge className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').length || 0}
                        </Badge>
                      </CardTitle>
                    </div>
                    <div className="card-content">
                      <div className="space-y-4">
                        {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{task.title}</p>
                                <p className="text-sm text-slate-600">{task.assigned_to || 'Não atribuído'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 mb-1">
                                {task.priority}
                              </Badge>
                              {task.due_date && (
                                <p className="text-xs text-slate-500">
                                  {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-500">
                              {isLoadingData ? 'Carregando tarefas...' : 'Nenhuma tarefa urgente'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Seção de Análises */}
              <div className="space-y-6">
                <div className="section-header">
                  <div className="section-divider"></div>
                  <h2 className="section-title">Análises e Relatórios</h2>
                </div>
                
                <Card className="data-card">
                  <Tabs defaultValue="analysis" className="w-full">
                    <div className="card-header">
                      <TabsList className="grid grid-cols-4 w-full max-w-4xl bg-slate-100 rounded-lg p-1">
                        <TabsTrigger 
                          value="analysis" 
                          className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm py-2.5 px-4 text-sm font-medium text-slate-600 rounded-md transition-all"
                        >
                          Análise Geral
                        </TabsTrigger>
                        <TabsTrigger 
                          value="status" 
                          className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm py-2.5 px-4 text-sm font-medium text-slate-600 rounded-md transition-all"
                        >
                          Status do Sistema
                        </TabsTrigger>
                        <TabsTrigger 
                          value="quality" 
                          className="data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm py-2.5 px-4 text-sm font-medium text-slate-600 rounded-md transition-all"
                        >
                          Qualidade dos Dados
                        </TabsTrigger>
                        <TabsTrigger 
                          value="validator" 
                          className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2.5 px-4 text-sm font-medium text-slate-600 rounded-md transition-all"
                        >
                          Validador
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="card-content">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CRMOverview;
