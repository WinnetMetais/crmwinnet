import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, LineChart, GitBranch, KanbanSquare, Plus } from "lucide-react";
import { SalesFunnelChart } from "@/components/sales/SalesFunnelChart";
import { SalesPipeline } from "@/components/sales/SalesPipeline";
import { SalesKanban } from "@/components/sales/SalesKanban";
import { SalesStats } from "@/components/sales/SalesStats";
import { NewOpportunityForm } from "@/components/sales/NewOpportunityForm";
import { OpportunityFormModal } from "@/components/sales/OpportunityFormModal";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { DealEditModal } from "@/components/sales/DealEditModal";
import { OpportunitiesRealtime } from "@/components/sales/OpportunitiesRealtime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeal } from "@/services/pipeline";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

const Sales = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewOpportunityForm, setShowNewOpportunityForm] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);

  const queryClient = useQueryClient();
  useRealtimeUpdates(); // Enable real-time updates for sales

  const createDealMutation = useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
      queryClient.invalidateQueries({ queryKey: ['deals-pipeline'] });
      setShowSimpleModal(false);
    }
  });

  const handleQuickCreate = () => {
    setShowSimpleModal(true);
  };

  const handleSaveDeal = (dealData: any) => {
    createDealMutation.mutate(dealData);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div className="flex justify-between items-center w-full">
                <div>
                  <h1 className="text-3xl font-bold">Gestão de Vendas</h1>
                  <p className="text-muted-foreground">Gerencie o processo comercial da Winnet Metais</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowCustomerModal(true)} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                  </Button>
                  <Button onClick={handleQuickCreate} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Deal Rápido
                  </Button>
                  <Button onClick={() => setShowOpportunityModal(true)}>
                    Nova Oportunidade <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <SalesStats />

            <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="funnel" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Funil de Vendas
                </TabsTrigger>
                <TabsTrigger value="pipeline" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Pipeline
                </TabsTrigger>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <KanbanSquare className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Funil de Vendas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <SalesFunnelChart />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <OpportunitiesRealtime />
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="funnel" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Funil de Vendas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[500px]">
                      <SalesFunnelChart detailed={true} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pipeline" className="mt-6">
                <SalesPipeline />
              </TabsContent>

              <TabsContent value="kanban" className="mt-6">
                <SalesKanban />
              </TabsContent>
            </Tabs>

            {/* Modal de Criação Rápida */}
            <DealEditModal
              deal={null}
              open={showSimpleModal}
              onClose={() => setShowSimpleModal(false)}
              onSave={handleSaveDeal}
              mode="create"
            />

            {/* Modais */}
            {showCustomerModal && (
              <CustomerFormModal
                onSubmit={(data) => {
                  console.log('Customer data:', data);
                  setShowCustomerModal(false);
                }}
                onCancel={() => setShowCustomerModal(false)}
                mode="create"
              />
            )}

            {showOpportunityModal && (
              <OpportunityFormModal
                open={showOpportunityModal}
                onClose={() => setShowOpportunityModal(false)}
                mode="create"
              />
            )}

            {/* Formulário Completo de Nova Oportunidade */}
            {showNewOpportunityForm && (
              <NewOpportunityForm onClose={() => setShowNewOpportunityForm(false)} />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Sales;
