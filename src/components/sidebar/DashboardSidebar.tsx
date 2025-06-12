
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
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
    <Sidebar variant="inset" className="border-r border-slate-200 bg-white shadow-sm">
      <SidebarHeader>
        <div className="flex h-16 items-center px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl mx-3 mt-3 shadow-sm">
          <div className="flex flex-col">
            <span className="font-bold text-lg">Winnet Metais</span>
            <span className="text-xs opacity-90">CRM & Gestão Comercial</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white px-2">
        <AnalysisGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ContentGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <CommercialGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <FinancialGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ToolsGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ConfigGroup isActive={isActive} isActiveGroup={isActiveGroup} />
      </SidebarContent>
      
      <SidebarFooter className="bg-white border-t border-slate-200 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/config')}
              asChild
              className="text-blue-700 hover:bg-blue-50 hover:text-blue-800 data-[state=open]:bg-blue-100 data-[state=open]:text-blue-800 rounded-lg"
            >
              <Link 
                to="/config"
                className="w-full flex items-center px-3 py-2"
              >
                <Settings className="mr-3 h-4 w-4" />
                <span>Configurações Gerais</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
