
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, Database, FileText, Shield } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface ConfigGroupProps {
  isActive: (path: string) => boolean;
  isActiveGroup: (paths: string[]) => boolean;
}

export const ConfigGroup = ({ isActive, isActiveGroup }: ConfigGroupProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Configurações</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/users')}
              tooltip="Gestão de Usuários"
              asChild
            >
              <Link to="/users">
                <Users className="mr-2 h-4 w-4" />
                <span>Usuários</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/config')}
              tooltip="Configurações Gerais"
              asChild
            >
              <Link to="/config">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/backup')}
              tooltip="Backup & Auditoria"
              asChild
            >
              <Link to="/backup">
                <Database className="mr-2 h-4 w-4" />
                <span>Backup</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/templates')}
              tooltip="Templates"
              asChild
            >
              <Link to="/templates">
                <FileText className="mr-2 h-4 w-4" />
                <span>Templates</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
