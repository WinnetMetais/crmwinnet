
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
import { Users, DollarSign, CheckSquare, TrendingUp, RefreshCw, Activity, Target, AlertCircle } from "lucide-react";
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
        
        <div className="flex-1 bg-gray-50/30">
          <div className="crm-header">
            <div className="container mx-auto py-8 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">CRM Overview</h1>
                    <p className="text-lg text-gray-600 mt-1">Visão geral e validação dos dados do CRM</p>
                  </div>
                </div>
                <Button 
                  onClick={handleSyncData} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-sm"
                >
                  <RefreshCw className={`mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                  Sincronizar Dados
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-8 px-6 space-y-8">
            {/* Métricas Principais com Layout Melhorado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="crm-stat-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="crm-metric-label">Total Clientes</p>
                    <p className="crm-metric-value text-blue-600">
                      {isLoadingData ? '...' : metrics.totalCustomers}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Ativos no sistema</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="crm-stat-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="crm-metric-label">Total Negócios</p>
                    <p className="crm-metric-value text-emerald-600">
                      {isLoadingData ? '...' : metrics.totalDeals}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Oportunidades abertas</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="crm-stat-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="crm-metric-label">Receita Estimada</p>
                    <p className="crm-metric-value text-orange-600">
                      {isLoadingData ? '...' : `R$ ${metrics.totalRevenue.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Pipeline total</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="crm-stat-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="crm-metric-label">Tarefas Pendentes</p>
                    <p className="crm-metric-value text-purple-600">
                      {isLoadingData ? '...' : metrics.pendingTasks}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Aguardando ação</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                    <CheckSquare className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Status dos Dados com Visual Melhorado */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="crm-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Clientes Recentes
                    </span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {customers?.slice(0, 5).length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customers?.slice(0, 5).map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.company || 'Sem empresa'}</p>
                        </div>
                        <Badge 
                          variant={customer.status === 'active' ? 'default' : 'secondary'}
                          className={customer.status === 'active' ? 'crm-status-active' : 'crm-status-inactive'}
                        >
                          {customer.status || 'N/A'}
                        </Badge>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          {isLoadingData ? 'Carregando...' : 'Nenhum cliente encontrado'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>

              <div className="crm-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      Negócios Ativos
                    </span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').slice(0, 5).map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{deal.title}</p>
                          <p className="text-sm text-gray-600">{deal.customers?.name || 'Cliente não definido'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">
                            R$ {(deal.estimated_value || 0).toLocaleString()}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1 bg-gray-50">
                            {deal.status}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          {isLoadingData ? 'Carregando...' : 'Nenhum negócio ativo'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>

              <div className="crm-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      Tarefas Urgentes
                    </span>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.assigned_to || 'Não atribuído'}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="crm-priority-high text-xs">
                            {task.priority}
                          </Badge>
                          {task.due_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(task.due_date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          {isLoadingData ? 'Carregando...' : 'Nenhuma tarefa urgente'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </div>

            {/* Tabs com Design Melhorado */}
            <div className="crm-card">
              <Tabs defaultValue="analysis" className="w-full">
                <div className="border-b border-gray-100 px-6 pt-6">
                  <TabsList className="grid grid-cols-4 w-full max-w-3xl bg-gray-50/50">
                    <TabsTrigger value="analysis" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Análise
                    </TabsTrigger>
                    <TabsTrigger value="status" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Status
                    </TabsTrigger>
                    <TabsTrigger value="quality" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Qualidade
                    </TabsTrigger>
                    <TabsTrigger value="validator" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Validador
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
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
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CRMOverview;
