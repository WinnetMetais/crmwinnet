
import React from 'react';
import { Link } from 'react-router-dom';
import { FileBarChart, Filter, CalendarIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export const ToolsGroup: React.FC<{ isActiveGroup: (paths: string[]) => boolean, isActive: (path: string) => boolean }> = ({ isActiveGroup, isActive }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/reports')}
              tooltip="Relatórios"
              asChild
            >
              <Link to="/reports">
                <FileBarChart className="mr-2 h-4 w-4" />
                <span>Relatórios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/filters')}
              tooltip="Filtros"
              asChild
            >
              <Link to="/filters">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filtros Avançados</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/calendar')}
              tooltip="Agenda"
              asChild
            >
              <Link to="/calendar">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Agenda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
