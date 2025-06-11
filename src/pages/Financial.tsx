
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
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);

  // Dados mock para o dashboard
  const dashboardData = {
    totalReceitas: 186028.2,
    totalDespesas: 31112.84,
    saldo: 154915.36,
    transacoes: 483
  };

  // Dados mock para canais
  const channelsData = {
    site: { revenue: 86728, transactions: 265 },
    mercadoLivre: { revenue: 64739, transactions: 193 },
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
                <FinancialDashboard data={dashboardData} />
              </TabsContent>

              <TabsContent value="new">
                {showNewTransactionForm ? (
                  <NewTransactionForm onClose={() => setShowNewTransactionForm(false)} />
                ) : (
                  <NewTransactionForm onClose={() => setShowNewTransactionForm(false)} />
                )}
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
