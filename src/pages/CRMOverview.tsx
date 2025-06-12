
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
import { Users, DollarSign, CheckSquare, TrendingUp, RefreshCw, Activity, Target, AlertCircle, BarChart3 } from "lucide-react";
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
      <div className="flex min-h-screen w-full bg-white">
        <DashboardSidebar />
        
        <div className="flex-1 bg-white">
          {/* Header Limpo e Moderno */}
          <div className="crm-header">
            <div className="container mx-auto py-8 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg" />
                  <div className="flex items-center gap-4">
                    <div className="crm-icon-container crm-icon-blue">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800 mb-1">CRM Overview</h1>
                      <p className="text-slate-600">Visão geral e validação dos dados do CRM</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleSyncData} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Sincronizar Dados
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-8 px-6 space-y-8 bg-white">
            {/* Métricas Principais com Design Limpo */}
            <div className="space-y-6">
              <div className="crm-section-header">
                <div className="crm-section-divider"></div>
                <h2 className="crm-section-title">Métricas Principais</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card className="crm-metric-card hover:border-blue-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Total Clientes</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {isLoadingData ? '...' : metrics.totalCustomers}
                        </p>
                        <p className="text-sm text-slate-500">Ativos no sistema</p>
                      </div>
                      <div className="crm-icon-container crm-icon-blue group-hover:bg-blue-100">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="crm-metric-card hover:border-emerald-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Total Negócios</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {isLoadingData ? '...' : metrics.totalDeals}
                        </p>
                        <p className="text-sm text-slate-500">Oportunidades abertas</p>
                      </div>
                      <div className="crm-icon-container crm-icon-emerald group-hover:bg-emerald-100">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="crm-metric-card hover:border-orange-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Receita Estimada</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {isLoadingData ? '...' : `R$ ${metrics.totalRevenue.toLocaleString()}`}
                        </p>
                        <p className="text-sm text-slate-500">Pipeline total</p>
                      </div>
                      <div className="crm-icon-container crm-icon-orange group-hover:bg-orange-100">
                        <DollarSign className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="crm-metric-card hover:border-purple-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Tarefas Pendentes</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {isLoadingData ? '...' : metrics.pendingTasks}
                        </p>
                        <p className="text-sm text-slate-500">Aguardando ação</p>
                      </div>
                      <div className="crm-icon-container crm-icon-purple group-hover:bg-purple-100">
                        <CheckSquare className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Seção de Dados em Tempo Real */}
            <div className="space-y-6">
              <div className="crm-section-header">
                <div className="crm-section-divider"></div>
                <h2 className="crm-section-title">Dados em Tempo Real</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Clientes Recentes */}
                <Card className="crm-data-card">
                  <div className="crm-data-header">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-3 text-slate-800">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Clientes Recentes
                      </span>
                      <Badge className="crm-badge-active">
                        {customers?.slice(0, 5).length || 0}
                      </Badge>
                    </CardTitle>
                  </div>
                  <div className="crm-data-content">
                    <div className="space-y-3">
                      {customers?.slice(0, 5).map((customer) => (
                        <div key={customer.id} className="crm-data-item">
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 mb-1">{customer.name}</p>
                            <p className="text-sm text-slate-600">{customer.company || 'Sem empresa'}</p>
                          </div>
                          <Badge 
                            className={customer.status === 'active' 
                              ? 'crm-badge-active' 
                              : 'crm-badge-inactive'
                            }
                          >
                            {customer.status || 'N/A'}
                          </Badge>
                        </div>
                      )) || (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                          <p className="text-slate-500">
                            {isLoadingData ? 'Carregando clientes...' : 'Nenhum cliente encontrado'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Negócios Ativos */}
                <Card className="crm-data-card">
                  <div className="crm-data-header">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-3 text-slate-800">
                        <Target className="h-5 w-5 text-emerald-600" />
                        Negócios Ativos
                      </span>
                      <Badge className="crm-badge-active">
                        {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').length || 0}
                      </Badge>
                    </CardTitle>
                  </div>
                  <div className="crm-data-content">
                    <div className="space-y-3">
                      {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').slice(0, 5).map((deal) => (
                        <div key={deal.id} className="crm-data-item">
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 mb-1">{deal.title}</p>
                            <p className="text-sm text-slate-600">{deal.customers?.name || 'Cliente não definido'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-emerald-600 mb-1">
                              R$ {(deal.estimated_value || 0).toLocaleString()}
                            </p>
                            <Badge className="crm-badge-inactive text-xs">
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
                <Card className="crm-data-card">
                  <div className="crm-data-header">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-3 text-slate-800">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Tarefas Urgentes
                      </span>
                      <Badge className="crm-badge-priority-high">
                        {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').length || 0}
                      </Badge>
                    </CardTitle>
                  </div>
                  <div className="crm-data-content">
                    <div className="space-y-3">
                      {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').slice(0, 5).map((task) => (
                        <div key={task.id} className="crm-data-item">
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 mb-1">{task.title}</p>
                            <p className="text-sm text-slate-600">{task.assigned_to || 'Não atribuído'}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="crm-badge-priority-high mb-1">
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

            {/* Seção de Análises com Tabs Limpos */}
            <div className="space-y-6">
              <div className="crm-section-header">
                <div className="crm-section-divider"></div>
                <h2 className="crm-section-title">Análises e Relatórios</h2>
              </div>
              
              <Card className="crm-card border-slate-200">
                <Tabs defaultValue="analysis" className="w-full">
                  <div className="border-b border-slate-200 bg-slate-50">
                    <div className="px-6 pt-4 pb-2">
                      <TabsList className="grid grid-cols-4 w-full max-w-3xl bg-white shadow-sm border border-slate-200">
                        <TabsTrigger 
                          value="analysis" 
                          className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 py-2 px-4 text-sm font-medium text-slate-600"
                        >
                          Análise Geral
                        </TabsTrigger>
                        <TabsTrigger 
                          value="status" 
                          className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 py-2 px-4 text-sm font-medium text-slate-600"
                        >
                          Status do Sistema
                        </TabsTrigger>
                        <TabsTrigger 
                          value="quality" 
                          className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 py-2 px-4 text-sm font-medium text-slate-600"
                        >
                          Qualidade dos Dados
                        </TabsTrigger>
                        <TabsTrigger 
                          value="validator" 
                          className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 py-2 px-4 text-sm font-medium text-slate-600"
                        >
                          Validador
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
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
    </SidebarProvider>
  );
};

export default CRMOverview;
