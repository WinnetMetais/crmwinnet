
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, PieChart, Target } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export const AnalysisGroup: React.FC<{ isActiveGroup: (paths: string[]) => boolean, isActive: (path: string) => boolean }> = ({ isActiveGroup, isActive }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Análises</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/')}
              tooltip="Dashboard Principal"
              asChild
            >
              <Link to="/">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/analysis')}
              tooltip="Análises Avançadas"
              asChild
            >
              <Link to="/analysis">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Análises Avançadas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/crm')}
              tooltip="Visão Geral CRM"
              asChild
            >
              <Link to="/crm">
                <PieChart className="mr-2 h-4 w-4" />
                <span>Visão Geral CRM</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/module-analysis')}
              tooltip="Status dos Módulos"
              asChild
            >
              <Link to="/module-analysis">
                <Target className="mr-2 h-4 w-4" />
                <span>Status Módulos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
