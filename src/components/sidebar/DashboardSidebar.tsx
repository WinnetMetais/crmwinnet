
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Sparkles } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { AnalysisGroup } from './SidebarGroups/AnalysisGroup';
import { ContentGroup } from './SidebarGroups/ContentGroup';
import { CommercialGroup } from './SidebarGroups/CommercialGroup';
import { FinancialGroup } from './SidebarGroups/FinancialGroup';
import { ToolsGroup } from './SidebarGroups/ToolsGroup';
import { ConfigGroup } from './SidebarGroups/ConfigGroup';

const DashboardSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <Sidebar variant="inset" className="border-r border-slate-200 bg-white shadow-lg" style={{backgroundColor: 'white'}}>
      <SidebarHeader className="bg-white" style={{backgroundColor: 'white'}}>
        <div className="flex h-16 items-center justify-center px-4 bg-gradient-to-r from-primary to-[hsl(191,93%,50%)] text-white rounded-lg mx-3 mt-3 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-white" />
              <span className="font-bold text-lg text-white">Winnet Metais</span>
            </div>
            <span className="text-xs opacity-90 font-medium text-white/90">CRM & Gestão Comercial</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white px-3 py-2" style={{backgroundColor: 'white'}}>
        <CommercialGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <FinancialGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ToolsGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ConfigGroup isActive={isActive} isActiveGroup={isActiveGroup} />
      </SidebarContent>
      
      <SidebarFooter className="bg-white border-t border-slate-200 p-3" style={{backgroundColor: 'white'}}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/config')}
              asChild
              className="text-slate-700 hover:bg-blue-50 hover:text-blue-700 data-[state=open]:bg-blue-100 data-[state=open]:text-blue-700 rounded-lg transition-all duration-200 p-3"
              style={{color: 'rgb(51, 65, 85)'}}
            >
              <Link 
                to="/config"
                className="w-full flex items-center px-3 py-2"
                style={{color: 'rgb(51, 65, 85)'}}
              >
                <Settings className="mr-3 h-4 w-4" />
                <span className="font-medium">Configurações Gerais</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
