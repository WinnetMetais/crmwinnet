
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, FileText, TrendingUp, Eye } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AnalysisGroupProps {
  isActive: (path: string) => boolean;
  isActiveGroup: (paths: string[]) => boolean;
}

export const AnalysisGroup = ({ isActive, isActiveGroup }: AnalysisGroupProps) => {
  const analysisPaths = ['/dashboard', '/reports', '/performance', '/crm-overview'];
  
  return (
    <Collapsible defaultOpen={isActiveGroup(analysisPaths)}>
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="group/collapsible">
            Análises
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/dashboard')}
                  asChild
                >
                  <Link 
                    to="/dashboard"
                    className="w-full flex items-center"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/crm-overview')}
                  asChild
                >
                  <Link 
                    to="/crm-overview"
                    className="w-full flex items-center"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Visão Geral CRM</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/reports')}
                  asChild
                >
                  <Link 
                    to="/reports"
                    className="w-full flex items-center"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Relatórios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/performance')}
                  asChild
                >
                  <Link 
                    to="/performance"
                    className="w-full flex items-center"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Performance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};
