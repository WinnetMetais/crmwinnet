
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomReportsGenerator } from "@/components/tools/CustomReportsGenerator";
import { ExportSystem } from "@/components/tools/ExportSystem";
import { AdvancedTaskSystem } from "@/components/tools/AdvancedTaskSystem";

const Reports = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Ferramentas Avançadas</h1>
                <p className="text-muted-foreground">Relatórios customizados, exportações e gestão de tarefas</p>
              </div>
            </div>

            <Tabs defaultValue="reports" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
                <TabsTrigger value="export">Exportação</TabsTrigger>
                <TabsTrigger value="tasks">Tarefas Avançadas</TabsTrigger>
              </TabsList>

              <TabsContent value="reports">
                <CustomReportsGenerator />
              </TabsContent>

              <TabsContent value="export">
                <ExportSystem />
              </TabsContent>

              <TabsContent value="tasks">
                <AdvancedTaskSystem />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
