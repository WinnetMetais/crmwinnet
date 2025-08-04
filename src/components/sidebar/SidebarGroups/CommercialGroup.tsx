
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { 
  ShoppingCart, 
  Users, 
  MessageSquare,
  TrendingUp,
  Package,
  Calculator,
  DollarSign
} from 'lucide-react';

interface CommercialGroupProps {
  isActive: (path: string) => boolean;
  isActiveGroup: (paths: string[]) => boolean;
}

export const CommercialGroup = ({ isActive, isActiveGroup }: CommercialGroupProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Comercial & CRM</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/commercial')}
              asChild
            >
              <Link 
                to="/commercial"
                className="w-full flex items-center"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Comercial</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/products')}
              asChild
            >
              <Link 
                to="/products"
                className="w-full flex items-center"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Produtos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/customers')}
              asChild
            >
              <Link 
                to="/customers"
                className="w-full flex items-center"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Clientes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/sales')}
              asChild
            >
              <Link 
                to="/sales"
                className="w-full flex items-center"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Vendas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/quotes')}
              asChild
            >
              <Link 
                to="/quotes"
                className="w-full flex items-center"
              >
                <Calculator className="mr-2 h-4 w-4" />
                <span>Orçamentos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/crm')}
              asChild
            >
              <Link 
                to="/crm"
                className="w-full flex items-center"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>CRM Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
