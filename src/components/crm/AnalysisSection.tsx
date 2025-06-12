
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataQualityDashboard } from "@/components/crm/DataQualityDashboard";
import { CRMDataValidator } from "@/components/crm/CRMDataValidator";
import { CRMSystemStatus } from "@/components/crm/CRMSystemStatus";
import { CRMAnalysisReport } from "@/components/crm/CRMAnalysisReport";

export const AnalysisSection = () => {
  return (
    <section className="animate-fade-in" style={{animationDelay: '0.6s'}}>
      <div className="mb-6">
        <h2 className="heading-2 mb-2">Relatórios e Análises</h2>
        <p className="body-medium">Insights detalhados sobre o desempenho do CRM</p>
      </div>
      
      <Card className="card-clean">
        <Tabs defaultValue="analysis" className="w-full">
          <div className="card-header-clean">
            <TabsList className="grid grid-cols-4 w-full max-w-4xl bg-slate-100 rounded-md p-1">
              <TabsTrigger 
                value="analysis" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm py-2 px-4 text-sm font-medium text-slate-600 rounded transition-all"
              >
                Análise Geral
              </TabsTrigger>
              <TabsTrigger 
                value="status" 
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm py-2 px-4 text-sm font-medium text-slate-600 rounded transition-all"
              >
                Status do Sistema
              </TabsTrigger>
              <TabsTrigger 
                value="quality" 
                className="data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm py-2 px-4 text-sm font-medium text-slate-600 rounded transition-all"
              >
                Qualidade dos Dados
              </TabsTrigger>
              <TabsTrigger 
                value="validator" 
                className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-2 px-4 text-sm font-medium text-slate-600 rounded transition-all"
              >
                Validador
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="card-content-clean">
            <TabsContent value="analysis" className="mt-0">
              <CRMAnalysisReport />
            </TabsContent>

            <TabsContent value="status" className="mt-0">
              <CRMSystemStatus />
            </TabsContent>

            <TabsContent value="quality" className="mt-0">
              <DataQualityDashboard />
            </TabsContent>

            <TabsContent value="validator" className="mt-0">
              <CRMDataValidator />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </section>
  );
};
