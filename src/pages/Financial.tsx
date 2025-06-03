
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";
import { CashFlowManager } from "@/components/financial/CashFlowManager";
import { RevenueAnalysis } from "@/components/financial/RevenueAnalysis";
import { ExpenseControl } from "@/components/financial/ExpenseControl";
import { ChannelAnalysis } from "@/components/financial/ChannelAnalysis";

const Financial = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dados resumidos baseados nas planilhas
  const financialSummary = {
    totalRevenue: 1089950, // Fevereiro total
    totalExpenses: 507320, // Março total
    netProfit: 582630,
    cashFlow: 26508.14, // Saldo final
    channels: {
      site: { revenue: 86728, transactions: 265 },
      mercadoLivreCNPJ: { revenue: 64739, transactions: 193 },
      madeiraMadeira: { revenue: 7971.67, transactions: 4 },
      via: { revenue: 2495.42, transactions: 3 },
      comercial: { revenue: 22093.86, transactions: 8 }
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">Módulo Financeiro</h1>
                  <p className="text-muted-foreground">Gestão completa das finanças da Winnet Metais</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </div>
            </div>

            {/* Cards de Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {financialSummary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    +12.5% vs mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    R$ {financialSummary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    +8.3% vs mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {financialSummary.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    +15.2% vs mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    R$ {financialSummary.cashFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    Saldo positivo
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs do Sistema Financeiro */}
            <Tabs defaultValue="dashboard" className="space-y-4" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
                <TabsTrigger value="revenue">Receitas</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
                <TabsTrigger value="channels">Análise por Canal</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-4">
                <FinancialDashboard data={financialSummary} />
              </TabsContent>

              <TabsContent value="cashflow" className="space-y-4">
                <CashFlowManager />
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                <RevenueAnalysis />
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <ExpenseControl />
              </TabsContent>

              <TabsContent value="channels" className="space-y-4">
                <ChannelAnalysis channels={financialSummary.channels} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Financial;
