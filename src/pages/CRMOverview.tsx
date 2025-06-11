
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataQualityDashboard } from "@/components/crm/DataQualityDashboard";
import { CRMDataValidator } from "@/components/crm/CRMDataValidator";
import { CRMSystemStatus } from "@/components/crm/CRMSystemStatus";
import { CRMAnalysisReport } from "@/components/crm/CRMAnalysisReport";

const CRMOverview = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">CRM Overview</h1>
                <p className="text-muted-foreground">Visão geral e validação dos dados do CRM</p>
              </div>
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
