
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

const DashboardSidebar = () => {
  const location = useLocation();
  
  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader>
        <div className="flex h-12 items-center px-4">
          <span className="font-bold text-lg">Insight Hub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <AnalysisGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ContentGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <CommercialGroup isActive={isActive} isActiveGroup={isActiveGroup} />
        <ToolsGroup isActive={isActive} isActiveGroup={isActiveGroup} />
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
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
