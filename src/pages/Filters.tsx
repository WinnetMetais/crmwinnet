
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { AdvancedFilters } from "@/components/tools/AdvancedFilters";

const Filters = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Filtros Avançados</h1>
                <p className="text-muted-foreground">Sistema avançado de filtros por data/período e critérios customizados</p>
              </div>
            </div>

            <AdvancedFilters />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Filters;
