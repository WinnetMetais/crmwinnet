
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { MetricsSection } from "@/components/crm/MetricsSection";
import { RealtimeDataSection } from "@/components/crm/RealtimeDataSection";
import { AnalysisSection } from "@/components/crm/AnalysisSection";
import { useCustomers, useDeals, useTasks, useCRMMetrics } from "@/hooks/useCRM";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { RefreshCw, BarChart3, Sparkles } from "lucide-react";
import { CRMDataService } from "@/services/crmData";
import { toast } from "sonner";

const CRMOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Configurar realtime updates
  useRealtimeUpdates();
  
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
    <div className="min-h-screen bg-white" style={{backgroundColor: 'white'}}>
      <SidebarProvider defaultOpen={true}>
        <div className="page-wrapper bg-white" style={{backgroundColor: 'white'}}>
          <DashboardSidebar />
          
          <div className="flex-1 bg-white" style={{backgroundColor: 'white'}}>
            {/* Header com contraste melhorado */}
            <header className="header-clean bg-white" style={{backgroundColor: 'white'}}>
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <SidebarTrigger className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200" />
                    <div className="flex items-center gap-4">
                      <div className="icon-wrapper icon-blue">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <div>
                        <h1 className="heading-1 flex items-center gap-2" style={{color: 'rgb(15, 23, 42)'}}>
                          CRM Overview
                          <Sparkles className="h-6 w-6 text-blue-500" />
                        </h1>
                        <p className="body-medium" style={{color: 'rgb(71, 85, 105)'}}>Painel de gestão centralizado - Winnet Metais</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSyncData} 
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Sincronizar
                  </Button>
                </div>
              </div>
            </header>

            {/* Área de conteúdo com fundo branco */}
            <main className="content-area bg-white" style={{backgroundColor: 'white'}}>
              <div className="max-w-7xl mx-auto section-spacing bg-white" style={{backgroundColor: 'white'}}>
                
                {/* Métricas principais */}
                <div className="animate-fade-in bg-white" style={{backgroundColor: 'white'}}>
                  <MetricsSection 
                    metrics={metrics} 
                    isLoadingData={isLoadingData} 
                  />
                </div>

                {/* Atividade Recente */}
                <div className="animate-fade-in bg-white" style={{animationDelay: '0.2s', backgroundColor: 'white'}}>
                  <RealtimeDataSection 
                    customers={customers} 
                    deals={deals} 
                    tasks={tasks} 
                    isLoadingData={isLoadingData} 
                  />
                </div>

                {/* Relatórios e Análises */}
                <div className="animate-fade-in bg-white" style={{animationDelay: '0.4s', backgroundColor: 'white'}}>
                  <AnalysisSection />
                </div>

              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CRMOverview;
