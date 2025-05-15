
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Layers, Users, TrendingUp } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

export const AnalysisGroup: React.FC<{ isActiveGroup: (paths: string[]) => boolean, isActive: (path: string) => boolean }> = ({ isActiveGroup, isActive }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Análise</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/dashboard')}
              tooltip="Dashboard"
              asChild
            >
              <Link to="/dashboard">
                <BarChart className="mr-2 h-4 w-4" />
                <span>Visão Geral</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/campaigns')}
              tooltip="Campanhas"
              asChild
            >
              <Link to="/campaigns">
                <Layers className="mr-2 h-4 w-4" />
                <span>Campanhas</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link to="/campaigns/google">Google Ads</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link to="/campaigns/facebook">Facebook/Instagram</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link to="/campaigns/linkedin">LinkedIn</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/audience')}
              tooltip="Audiência"
              asChild
            >
              <Link to="/audience">
                <Users className="mr-2 h-4 w-4" />
                <span>Audiência</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/performance')}
              tooltip="Performance"
              asChild
            >
              <Link to="/performance">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
