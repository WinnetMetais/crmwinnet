import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
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
import { WinnetSpreadsheetImporter } from "@/components/financial/WinnetSpreadsheetImporter";
import { FinancialBulkOperations } from "@/components/financial/FinancialBulkOperations";
import { TransactionsList } from "@/components/financial/TransactionsList";
import { CreateSampleData } from "@/components/financial/CreateSampleData";
import { useFinancialSummary, useTransactions } from "@/hooks/useTransactions";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import FinanceiroDashboard from "@/pages/FinanceiroDashboard";

const Financial = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: financialSummary, isLoading: isSummaryLoading } = useFinancialSummary();
  const { data: transactions = [], isLoading: isTransactionsLoading } = useTransactions();
  
  // Ativa atualizações em tempo real
  useRealtimeUpdates();

  // SEO title
  useEffect(() => {
    document.title = 'Gestão Financeira | Winnet';
  }, []);

  // Dados reais do resumo financeiro
  const dashboardData = financialSummary ? {
    ...financialSummary,
    transacoes: transactions.length
  } : {
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
    transacoes: transactions.length
  };

  // Análise de canais baseada nas transações reais
  const channelsData = React.useMemo(() => {
    const channels: Record<string, { revenue: number; transactions: number }> = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'receita' && transaction.channel) {
        if (!channels[transaction.channel]) {
          channels[transaction.channel] = { revenue: 0, transactions: 0 };
        }
        channels[transaction.channel].revenue += Number(transaction.amount);
        channels[transaction.channel].transactions++;
      }
    });

    return channels;
  }, [transactions]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4 max-w-7xl">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold text-primary">Gestão Financeira</h1>
                <p className="text-muted-foreground">Controle completo das finanças da Winnet Metais</p>
              </div>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 lg:grid-cols-13 w-full">
              <TabsTrigger value="dashboard" className="text-sm">Dashboard</TabsTrigger>
              <TabsTrigger value="realtime" className="text-sm">Tempo Real</TabsTrigger>
              <TabsTrigger value="transactions" className="text-sm">Transações</TabsTrigger>
              <TabsTrigger value="new" className="text-sm">Nova</TabsTrigger>
              <TabsTrigger value="sample" className="text-sm">Exemplo</TabsTrigger>
              <TabsTrigger value="cashflow" className="text-sm">Fluxo</TabsTrigger>
              <TabsTrigger value="expenses" className="text-sm">Despesas</TabsTrigger>
              <TabsTrigger value="revenue" className="text-sm">Receitas</TabsTrigger>
              <TabsTrigger value="channels" className="text-sm">Canais</TabsTrigger>
              <TabsTrigger value="spreadsheet" className="text-sm">Planilha</TabsTrigger>
              <TabsTrigger value="validation" className="text-sm">Validação</TabsTrigger>
              <TabsTrigger value="winnet" className="text-sm">Winnet</TabsTrigger>
              <TabsTrigger value="winnet-real" className="text-sm">Winnet Real</TabsTrigger>
              <TabsTrigger value="bulk" className="text-sm">Operações</TabsTrigger>
            </TabsList>

              <TabsContent value="dashboard" className="space-y-4">
                <FinancialDashboard data={dashboardData} />
              </TabsContent>

              <TabsContent value="realtime" className="space-y-4">
                <FinanceiroDashboard />
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <TransactionsList />
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <NewTransactionForm onClose={() => setActiveTab('transactions')} />
              </TabsContent>

              <TabsContent value="sample" className="space-y-4">
                <CreateSampleData />
              </TabsContent>

              <TabsContent value="cashflow" className="space-y-4">
                <CashFlowManager />
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <ExpenseControl />
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                <RevenueAnalysis />
              </TabsContent>

              <TabsContent value="channels" className="space-y-4">
                <ChannelAnalysis channels={channelsData} />
              </TabsContent>

              <TabsContent value="spreadsheet" className="space-y-4">
                <SpreadsheetSync />
              </TabsContent>

              <TabsContent value="validation" className="space-y-4">
                <DataValidationTool />
              </TabsContent>

              <TabsContent value="winnet" className="space-y-4">
                <WinnetDataImporter />
              </TabsContent>

              <TabsContent value="winnet-real" className="space-y-4">
                <WinnetSpreadsheetImporter />
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4">
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