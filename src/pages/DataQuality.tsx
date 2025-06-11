
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataQualityDashboard } from "@/components/crm/DataQualityDashboard";
import { CRMDataValidator } from "@/components/crm/CRMDataValidator";
import { CRMSystemStatus } from "@/components/crm/CRMSystemStatus";
import { 
  BarChart3, 
  CheckCircle, 
  Activity,
  Database
} from "lucide-react";

export default function DataQuality() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Qualidade dos Dados</h1>
          <p className="text-muted-foreground">
            Monitore e valide a qualidade dos dados do seu CRM
          </p>
        </div>
        <Database className="h-8 w-8 text-blue-600" />
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="validator" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Validador
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Status do Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <DataQualityDashboard />
        </TabsContent>

        <TabsContent value="validator" className="space-y-6">
          <CRMDataValidator />
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <CRMSystemStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
}
