
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/sidebar/DashboardSidebar";
import { AIDashboard as AIMainDashboard } from "@/components/ai/AIDashboard";

const AIDashboard = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center space-x-4 mb-6">
              <SidebarTrigger />
            </div>
            
            <AIMainDashboard />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AIDashboard;
