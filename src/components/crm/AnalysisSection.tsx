
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataQualityDashboard } from "@/components/crm/DataQualityDashboard";
import { CRMDataValidator } from "@/components/crm/CRMDataValidator";
import { CRMSystemStatus } from "@/components/crm/CRMSystemStatus";
import { CRMAnalysisReport } from "@/components/crm/CRMAnalysisReport";
import { BarChart3, Shield, Database, CheckCircle } from "lucide-react";

export const AnalysisSection = () => {
  return (
    <section>
      <div className="mb-8">
        <h2 className="heading-2 mb-2 text-slate-900">Relatórios e Análises</h2>
        <p className="body-medium text-slate-600">Insights detalhados sobre o desempenho e qualidade do CRM</p>
      </div>
      
      <Card className="card-clean hover-glow">
        <Tabs defaultValue="analysis" className="w-full">
          <div className="card-header-clean">
            <TabsList className="grid grid-cols-4 w-full max-w-4xl bg-slate-100 rounded-lg p-1 border border-slate-200">
              <TabsTrigger 
                value="analysis" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm py-3 px-4 text-sm font-medium text-slate-600 rounded-md transition-all flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Análise Geral
              </TabsTrigger>
              <TabsTrigger 
                value="status" 
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm py-3 px-4 text-sm font-medium text-slate-600 rounded-md transition-all flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Status do Sistema
              </TabsTrigger>
              <TabsTrigger 
                value="quality" 
                className="data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm py-3 px-4 text-sm font-medium text-slate-600 rounded-md transition-all flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Qualidade dos Dados
              </TabsTrigger>
              <TabsTrigger 
                value="validator" 
                className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm py-3 px-4 text-sm font-medium text-slate-600 rounded-md transition-all flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Validador
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="card-content-clean">
            <TabsContent value="analysis" className="mt-0 animate-fade-in">
              <CRMAnalysisReport />
            </TabsContent>

            <TabsContent value="status" className="mt-0 animate-fade-in">
              <CRMSystemStatus />
            </TabsContent>

            <TabsContent value="quality" className="mt-0 animate-fade-in">
              <DataQualityDashboard />
            </TabsContent>

            <TabsContent value="validator" className="mt-0 animate-fade-in">
              <CRMDataValidator />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </section>
  );
};
