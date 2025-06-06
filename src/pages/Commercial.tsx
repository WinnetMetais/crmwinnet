
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppIntegration } from "@/components/commercial/WhatsAppIntegration";
import { QuoteEmailSender } from "@/components/commercial/QuoteEmailSender";
import { CommissionSystem } from "@/components/commercial/CommissionSystem";
import { SalesGoalsControl } from "@/components/commercial/SalesGoalsControl";
import { NegotiationHistory } from "@/components/commercial/NegotiationHistory";

const Commercial = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Módulo Comercial</h1>
                <p className="text-muted-foreground">Gestão completa do processo comercial da Winnet Metais</p>
              </div>
            </div>

            <Tabs defaultValue="whatsapp" className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="commission">Comissões</TabsTrigger>
                <TabsTrigger value="goals">Metas</TabsTrigger>
                <TabsTrigger value="negotiations">Negociações</TabsTrigger>
              </TabsList>

              <TabsContent value="whatsapp">
                <WhatsAppIntegration />
              </TabsContent>

              <TabsContent value="email">
                <QuoteEmailSender />
              </TabsContent>

              <TabsContent value="commission">
                <CommissionSystem />
              </TabsContent>

              <TabsContent value="goals">
                <SalesGoalsControl />
              </TabsContent>

              <TabsContent value="negotiations">
                <NegotiationHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Commercial;
