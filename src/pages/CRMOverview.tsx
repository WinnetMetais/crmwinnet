
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { MetricsSection } from "@/components/crm/MetricsSection";
import { RealtimeDataSection } from "@/components/crm/RealtimeDataSection";
import { AnalysisSection } from "@/components/crm/AnalysisSection";
import { useCustomers, useDeals, useTasks, useCRMMetrics } from "@/hooks/useCRM";
import { RefreshCw, BarChart3 } from "lucide-react";
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
              <MetricsSection 
                metrics={metrics} 
                isLoadingData={isLoadingData} 
              />

              {/* Atividade Recente */}
              <RealtimeDataSection 
                customers={customers} 
                deals={deals} 
                tasks={tasks} 
                isLoadingData={isLoadingData} 
              />

              {/* Relatórios e Análises */}
              <AnalysisSection />

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CRMOverview;
