
import React from 'react';
import { 
  Settings, 
  Filter, 
  Download, 
  Calendar, 
  Bell,
  Users,
  TrendingUp,
  Bot,
  Database,
  Shield
} from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export const ToolsGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Ferramentas & Utilitários</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/filters" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtros Avançados</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/reports" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Relatórios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Calendário</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/tasks" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Tarefas & Notificações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Usuários</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/performance" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/ai-dashboard" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>IA Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/data-quality" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Qualidade dos Dados</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/backup" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Backup & Segurança</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
