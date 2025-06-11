
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
import { Users, DollarSign, CheckSquare, TrendingUp, RefreshCw } from "lucide-react";
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
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">CRM Overview</h1>
                  <p className="text-muted-foreground">Visão geral e validação dos dados do CRM</p>
                </div>
              </div>
              <Button onClick={handleSyncData} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Sincronizar Dados
              </Button>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                      <p className="text-3xl font-bold">
                        {isLoadingData ? '...' : metrics.totalCustomers}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Negócios</p>
                      <p className="text-3xl font-bold">
                        {isLoadingData ? '...' : metrics.totalDeals}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Receita Estimada</p>
                      <p className="text-2xl font-bold">
                        {isLoadingData ? '...' : `R$ ${metrics.totalRevenue.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                      <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tarefas Pendentes</p>
                      <p className="text-3xl font-bold">
                        {isLoadingData ? '...' : metrics.pendingTasks}
                      </p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                      <CheckSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status dos Dados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Clientes Recentes
                    <Badge variant="outline">{customers?.slice(0, 5).length || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customers?.slice(0, 5).map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.company || 'Sem empresa'}</p>
                        </div>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status || 'N/A'}
                        </Badge>
                      </div>
                    )) || (
                      <p className="text-muted-foreground text-center py-4">
                        {isLoadingData ? 'Carregando...' : 'Nenhum cliente encontrado'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Negócios Ativos
                    <Badge variant="outline">{deals?.filter(d => d.status === 'lead' || d.status === 'qualified').length || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deals?.filter(d => d.status === 'lead' || d.status === 'qualified').slice(0, 5).map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-muted-foreground">{deal.customers?.name || 'Cliente não definido'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            R$ {(deal.estimated_value || 0).toLocaleString()}
                          </p>
                          <Badge variant="outline">{deal.status}</Badge>
                        </div>
                      </div>
                    )) || (
                      <p className="text-muted-foreground text-center py-4">
                        {isLoadingData ? 'Carregando...' : 'Nenhum negócio ativo'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Tarefas Urgentes
                    <Badge variant="outline">{tasks?.filter(t => t.priority === 'high' && t.status === 'pending').length || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks?.filter(t => t.priority === 'high' && t.status === 'pending').slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.assigned_to || 'Não atribuído'}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">{task.priority}</Badge>
                          {task.due_date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(task.due_date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    )) || (
                      <p className="text-muted-foreground text-center py-4">
                        {isLoadingData ? 'Carregando...' : 'Nenhuma tarefa urgente'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="analysis" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                <TabsTrigger value="analysis">Análise</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="quality">Qualidade</TabsTrigger>
                <TabsTrigger value="validator">Validador</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis">
                <CRMAnalysisReport />
              </TabsContent>

              <TabsContent value="status">
                <CRMSystemStatus />
              </TabsContent>

              <TabsContent value="quality">
                <DataQualityDashboard />
              </TabsContent>

              <TabsContent value="validator">
                <CRMDataValidator />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CRMOverview;
