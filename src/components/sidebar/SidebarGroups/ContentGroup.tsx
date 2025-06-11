
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Megaphone, BookOpen } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface ContentGroupProps {
  isActive: (path: string) => boolean;
  isActiveGroup: (paths: string[]) => boolean;
}

export const ContentGroup = ({ isActive, isActiveGroup }: ContentGroupProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conteúdo</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/content')}
              tooltip="Gestão de Conteúdo"
              asChild
            >
              <Link to="/content">
                <FileText className="mr-2 h-4 w-4" />
                <span>Conteúdo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/calendar')}
              tooltip="Calendário Editorial"
              asChild
            >
              <Link to="/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendário Editorial</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/automation')}
              tooltip="Automação de Marketing"
              asChild
            >
              <Link to="/automation">
                <Megaphone className="mr-2 h-4 w-4" />
                <span>Automação Marketing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
