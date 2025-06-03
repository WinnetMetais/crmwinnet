
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  ShoppingBag, 
  Users, 
  DollarSign,
  Calculator
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CommercialGroupProps {
  isActive: (path: string) => boolean;
  isActiveGroup: (paths: string[]) => boolean;
}

export const CommercialGroup = ({ isActive, isActiveGroup }: CommercialGroupProps) => {
  const commercialPaths = ['/sales', '/customers', '/products', '/promotions', '/financial'];
  
  return (
    <Collapsible defaultOpen={isActiveGroup(commercialPaths)}>
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="group/collapsible">
            Comercial
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/sales')}
                  asChild
                >
                  <Link 
                    to="/sales"
                    className="w-full flex items-center"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Vendas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/financial')}
                  asChild
                >
                  <Link 
                    to="/financial"
                    className="w-full flex items-center"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    <span>Financeiro</span>
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
                  isActive={isActive('/products')}
                  asChild
                >
                  <Link 
                    to="/products"
                    className="w-full flex items-center"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Produtos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/promotions')}
                  asChild
                >
                  <Link 
                    to="/promotions"
                    className="w-full flex items-center"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    <span>Promoções</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};
