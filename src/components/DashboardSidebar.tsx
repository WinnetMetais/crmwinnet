
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  PieChart, 
  Settings, 
  Users, 
  CalendarIcon, 
  Filter, 
  FileBarChart,
  Layers,
  Target,
  MessageSquare,
  Megaphone,
  TrendingUp
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

const DashboardSidebar = () => {
  const location = useLocation();
  
  // Helper function to check if a route is active
  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader>
        <div className="flex h-12 items-center px-4">
          <span className="font-bold text-lg">Insight Hub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup defaultOpen={isActiveGroup(['/dashboard', '/campaigns', '/audience'])}>
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

        <SidebarGroup defaultOpen={isActiveGroup(['/content', '/social'])}>
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

        <SidebarGroup defaultOpen={isActiveGroup(['/reports', '/calendar', '/filters'])}>
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/config')}
              asChild
            >
              <Link 
                to="/config"
                className="w-full flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
