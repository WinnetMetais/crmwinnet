
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";
import { CashFlowManager } from "@/components/financial/CashFlowManager";
import { ExpenseControl } from "@/components/financial/ExpenseControl";
import { RevenueAnalysis } from "@/components/financial/RevenueAnalysis";
import { ChannelAnalysis } from "@/components/financial/ChannelAnalysis";
import { SpreadsheetSync } from "@/components/financial/SpreadsheetSync";
import { WinnetDataImporter } from "@/components/financial/WinnetDataImporter";

const Financial = () => {
  // Dados de exemplo para os canais (serão atualizados com dados reais após importação)
  const channelsData = {
    site: { revenue: 86728.00, transactions: 265 },
    mercadoLivre: { revenue: 64739.00, transactions: 193 },
    madeiraMadeira: { revenue: 7971.67, transactions: 4 },
    via: { revenue: 2495.42, transactions: 3 },
    comercial: { revenue: 22093.86, transactions: 8 }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Módulo Financeiro</h1>
                <p className="text-muted-foreground">Gestão completa das finanças da Winnet Metais</p>
              </div>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
                <TabsTrigger value="revenue">Receitas</TabsTrigger>
                <TabsTrigger value="channels">Canais</TabsTrigger>
                <TabsTrigger value="winnet-import">Dados Winnet</TabsTrigger>
                <TabsTrigger value="sync">Sincronização</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <FinancialDashboard data={{}} />
              </TabsContent>

              <TabsContent value="cashflow">
                <CashFlowManager />
              </TabsContent>

              <TabsContent value="expenses">
                <ExpenseControl />
              </TabsContent>

              <TabsContent value="revenue">
                <RevenueAnalysis />
              </TabsContent>

              <TabsContent value="channels">
                <ChannelAnalysis channels={channelsData} />
              </TabsContent>

              <TabsContent value="winnet-import">
                <WinnetDataImporter />
              </TabsContent>

              <TabsContent value="sync">
                <SpreadsheetSync />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Financial;
