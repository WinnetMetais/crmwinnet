
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ShoppingBag, 
  Tag, 
  Search,
  LineChart,
  GitBranch,
  KanbanSquare
} from 'lucide-react';
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

export const CommercialGroup: React.FC<{ isActiveGroup: (paths: string[]) => boolean, isActive: (path: string) => boolean }> = ({ isActiveGroup, isActive }) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Comercial</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/sales')}
              tooltip="Vendas"
              asChild
            >
              <Link to="/sales">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Vendas</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link to="/sales?view=funnel">
                    <LineChart className="mr-2 h-4 w-4" />
                    Funil de Vendas
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link to="/sales?view=pipeline">
                    <GitBranch className="mr-2 h-4 w-4" />
                    Pipeline
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <Link to="/sales?view=kanban">
                    <KanbanSquare className="mr-2 h-4 w-4" />
                    Kanban
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/products')}
              tooltip="Produtos"
              asChild
            >
              <Link to="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Produtos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/promotions')}
              tooltip="Promoções"
              asChild
            >
              <Link to="/promotions">
                <Tag className="mr-2 h-4 w-4" />
                <span>Promoções</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive('/market-research')}
              tooltip="Pesquisa de Mercado"
              asChild
            >
              <Link to="/market-research">
                <Search className="mr-2 h-4 w-4" />
                <span>Pesquisa de Mercado</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
