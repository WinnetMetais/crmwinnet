
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

export const ContentGroup: React.FC<{ isActiveGroup: (paths: string[]) => boolean, isActive: (path: string) => boolean }> = ({ isActiveGroup, isActive }) => {
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
              isActive={isActive('/content/calendar')}
              tooltip="Calendário Editorial"
              asChild
            >
              <Link to="/content">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendário Editorial</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/marketing-automation')}
              tooltip="Automação de Marketing"
              asChild
            >
              <Link to="/marketing-automation">
                <Megaphone className="mr-2 h-4 w-4" />
                <span>Automação Marketing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/content/catalog')}
              tooltip="Catálogo Digital"
              asChild
            >
              <Link to="/content">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Catálogo Digital</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
