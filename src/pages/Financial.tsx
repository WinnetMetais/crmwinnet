
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";
import { NewTransactionForm } from "@/components/financial/NewTransactionForm";
import { CashFlowManager } from "@/components/financial/CashFlowManager";
import { ExpenseControl } from "@/components/financial/ExpenseControl";
import { RevenueAnalysis } from "@/components/financial/RevenueAnalysis";
import { ChannelAnalysis } from "@/components/financial/ChannelAnalysis";
import { SpreadsheetSync } from "@/components/financial/SpreadsheetSync";
import { DataValidationTool } from "@/components/financial/DataValidationTool";
import { WinnetDataImporter } from "@/components/financial/WinnetDataImporter";
import { FinancialBulkOperations } from "@/components/financial/FinancialBulkOperations";

const Financial = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Gestão Financeira</h1>
                <p className="text-muted-foreground">Controle completo das finanças da Winnet Metais</p>
              </div>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-10 w-full">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="new">Nova</TabsTrigger>
                <TabsTrigger value="cashflow">Fluxo</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
                <TabsTrigger value="revenue">Receitas</TabsTrigger>
                <TabsTrigger value="channels">Canais</TabsTrigger>
                <TabsTrigger value="spreadsheet">Planilha</TabsTrigger>
                <TabsTrigger value="validation">Validação</TabsTrigger>
                <TabsTrigger value="winnet">Winnet</TabsTrigger>
                <TabsTrigger value="bulk">Operações</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <FinancialDashboard />
              </TabsContent>

              <TabsContent value="new">
                <NewTransactionForm />
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
                <ChannelAnalysis />
              </TabsContent>

              <TabsContent value="spreadsheet">
                <SpreadsheetSync />
              </TabsContent>

              <TabsContent value="validation">
                <DataValidationTool />
              </TabsContent>

              <TabsContent value="winnet">
                <WinnetDataImporter />
              </TabsContent>

              <TabsContent value="bulk">
                <FinancialBulkOperations />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Financial;
