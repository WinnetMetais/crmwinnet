
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
          {/* Header Principal com Gradiente Sutil */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="container mx-auto py-12 px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">CRM Overview</h1>
                      <p className="text-lg text-gray-600">Visão geral e validação dos dados do CRM</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleSyncData} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                >
                  <RefreshCw className={`mr-3 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                  Sincronizar Dados
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-10 px-8 space-y-10 bg-white">
            {/* Métricas Principais - Grid Responsivo */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-blue-600 rounded"></div>
                <h2 className="text-2xl font-semibold text-gray-900">Métricas Principais</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <Card className="bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Clientes</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {isLoadingData ? '...' : metrics.totalCustomers}
                        </p>
                        <p className="text-sm text-gray-500">Ativos no sistema</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors duration-200">
                        <Users className="h-10 w-10 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Negócios</p>
                        <p className="text-3xl font-bold text-emerald-600">
                          {isLoadingData ? '...' : metrics.totalDeals}
                        </p>
                        <p className="text-sm text-gray-500">Oportunidades abertas</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors duration-200">
                        <TrendingUp className="h-10 w-10 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Receita Estimada</p>
                        <p className="text-3xl font-bold text-orange-600">
                          {isLoadingData ? '...' : `R$ ${metrics.totalRevenue.toLocaleString()}`}
                        </p>
                        <p className="text-sm text-gray-500">Pipeline total</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors duration-200">
                        <DollarSign className="h-10 w-10 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tarefas Pendentes</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {isLoadingData ? '...' : metrics.pendingTasks}
                        </p>
                        <p className="text-sm text-gray-500">Aguardando ação</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors duration-200">
                        <CheckSquare className="h-10 w-10 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Seção de Dados Detalhados */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-emerald-600 rounded"></div>
                <h2 className="text-2xl font-semibold text-gray-900">Dados em Tempo Real</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Clientes Recentes */}
                <Card className="bg-white border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center justify-between text-xl">
                      <span className="flex items-center gap-3 text-gray-900">
                        <Activity className="h-6 w-6 text-blue-600" />
                        Clientes Recentes
                      </span>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                        {customers?.slice(0, 5).length || 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {customers?.slice(0, 5).map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{customer.name}</p>
                            <p className="text-sm text-gray-600">{customer.company || 'Sem empresa'}</p>
                          </div>
                          <Badge 
                            className={customer.status === 'active' 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                            }
                          >
                            {customer.status || 'N/A'}
                          </Badge>
                        </div>
                      )) || (
                        <div className="text-center py-12">
                          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">
                            {isLoadingData ? 'Carregando clientes...' : 'Nenhum cliente encontrado'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Negócios Ativos */}
                <Card className="bg-white border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center justify-between text-xl">
                      <span className="flex items-center gap-3 text-gray-900">
                        <Target className="h-6 w-6 text-emerald-600" />
                        Negócios Ativos
                      </span>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                        {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').length || 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').slice(0, 5).map((deal) => (
                        <div key={deal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{deal.title}</p>
                            <p className="text-sm text-gray-600">{deal.customers?.name || 'Cliente não definido'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600 mb-1">
                              R$ {(deal.estimated_value || 0).toLocaleString()}
                            </p>
                            <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                              {deal.status}
                            </Badge>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-12">
                          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">
                            {isLoadingData ? 'Carregando negócios...' : 'Nenhum negócio ativo'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tarefas Urgentes */}
                <Card className="bg-white border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-red-100/50 rounded-t-xl">
                    <CardTitle className="flex items-center justify-between text-xl">
                      <span className="flex items-center gap-3 text-gray-900">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        Tarefas Urgentes
                      </span>
                      <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
                        {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').length || 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.assigned_to || 'Não atribuído'}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-red-100 text-red-700 border-red-200 mb-1">
                              {task.priority}
                            </Badge>
                            {task.due_date && (
                              <p className="text-xs text-gray-500">
                                {new Date(task.due_date).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-12">
                          <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">
                            {isLoadingData ? 'Carregando tarefas...' : 'Nenhuma tarefa urgente'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Seção de Análises */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-purple-600 rounded"></div>
                <h2 className="text-2xl font-semibold text-gray-900">Análises e Relatórios</h2>
              </div>
              
              <Card className="bg-white border-2 border-gray-100 shadow-lg">
                <Tabs defaultValue="analysis" className="w-full">
                  <div className="border-b border-gray-200 bg-gray-50/50 rounded-t-xl">
                    <div className="px-8 pt-6 pb-2">
                      <TabsList className="grid grid-cols-4 w-full max-w-4xl bg-white shadow-sm border border-gray-200">
                        <TabsTrigger 
                          value="analysis" 
                          className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 py-3 px-6 text-sm font-medium"
                        >
                          Análise Geral
                        </TabsTrigger>
                        <TabsTrigger 
                          value="status" 
                          className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 py-3 px-6 text-sm font-medium"
                        >
                          Status do Sistema
                        </TabsTrigger>
                        <TabsTrigger 
                          value="quality" 
                          className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 py-3 px-6 text-sm font-medium"
                        >
                          Qualidade dos Dados
                        </TabsTrigger>
                        <TabsTrigger 
                          value="validator" 
                          className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 py-3 px-6 text-sm font-medium"
                        >
                          Validador
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>

                  <div className="p-8 bg-white">
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
