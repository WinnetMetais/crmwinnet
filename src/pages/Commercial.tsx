import React, { useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppIntegration } from "@/components/commercial/WhatsAppIntegration";
import { QuoteEmailSender } from "@/components/commercial/QuoteEmailSender";
import { CommissionSystem } from "@/components/commercial/CommissionSystem";
import { SalesGoalsControl } from "@/components/commercial/SalesGoalsControl";
import { NegotiationHistory } from "@/components/commercial/NegotiationHistory";
import { CommercialSpreadsheetSync } from "@/components/commercial/CommercialSpreadsheetSync";
import { CommercialBulkOperations } from "@/components/commercial/CommercialBulkOperations";

const Commercial = () => {
  useEffect(() => { document.title = 'Comercial | Winnet'; }, []);
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-primary">Módulo Comercial</h1>
                <p className="text-muted-foreground">Gestão completa do processo comercial da Winnet Metais</p>
              </div>
            </div>

            <Tabs defaultValue="whatsapp" className="space-y-6">
              <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full overflow-x-auto">
                <TabsTrigger value="whatsapp" className="text-sm">WhatsApp</TabsTrigger>
                <TabsTrigger value="email" className="text-sm">Email</TabsTrigger>
                <TabsTrigger value="commission" className="text-sm">Comissões</TabsTrigger>
                <TabsTrigger value="goals" className="text-sm">Metas</TabsTrigger>
                <TabsTrigger value="negotiations" className="text-sm">Negociações</TabsTrigger>
                <TabsTrigger value="spreadsheet" className="text-sm">Planilha</TabsTrigger>
                <TabsTrigger value="bulk" className="text-sm">Operações</TabsTrigger>
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

              <TabsContent value="spreadsheet">
                <CommercialSpreadsheetSync />
              </TabsContent>

              <TabsContent value="bulk">
                <CommercialBulkOperations />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Commercial;
