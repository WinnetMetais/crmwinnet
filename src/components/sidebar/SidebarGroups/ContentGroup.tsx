
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, MessageSquare, Megaphone } from 'lucide-react';
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
              isActive={isActive('/content/plan')}
              tooltip="Planejamento"
              asChild
            >
              <Link to="/content/plan">
                <Target className="mr-2 h-4 w-4" />
                <span>Planejamento</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/social')}
              tooltip="Redes Sociais"
              asChild
            >
              <Link to="/social">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Redes Sociais</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/ads')}
              tooltip="Anúncios"
              asChild
            >
              <Link to="/ads">
                <Megaphone className="mr-2 h-4 w-4" />
                <span>Anúncios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
