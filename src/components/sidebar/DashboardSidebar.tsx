
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
import { ToolsGroup } from './SidebarGroups/ToolsGroup';
import { ConfigGroup } from './SidebarGroups/ConfigGroup';

const DashboardSidebar = () => {
  const location = useLocation();
  
  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <Sidebar variant="inset" className="border-r bg-slate-50">
      <SidebarHeader>
        <div className="flex h-16 items-center px-4 bg-blue-600 text-white rounded-lg mx-2 mt-2">
          <div className="flex flex-col">
            <span className="font-bold text-lg">Winnet Metais</span>
            <span className="text-xs opacity-90">CRM & Gestão Comercial</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <AnalysisGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ContentGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <CommercialGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ToolsGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ConfigGroup isActive={isActive} isActiveGroup={isActiveGroup} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/config')}
              asChild
            >
              <Link 
                to="/config"
                className="w-full flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
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
