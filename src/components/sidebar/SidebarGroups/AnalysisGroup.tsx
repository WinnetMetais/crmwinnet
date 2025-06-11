
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, PieChart, Target, Brain } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface AnalysisGroupProps {
  isActive: (path: string) => boolean;
  isActiveGroup: (paths: string[]) => boolean;
}

export const AnalysisGroup = ({ isActive, isActiveGroup }: AnalysisGroupProps) => {
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
              isActive={isActive('/crm-overview')}
              tooltip="Visão Geral CRM"
              asChild
            >
              <Link to="/crm-overview">
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
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/ai-dashboard')}
              tooltip="Assistente IA"
              asChild
            >
              <Link to="/ai-dashboard">
                <Brain className="mr-2 h-4 w-4" />
                <span>Assistente IA</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
