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
  DollarSign,
  Calculator
} from 'lucide-react';

interface FinancialGroupProps {
  isActive: (path: string) => boolean;
  isActiveGroup: (paths: string[]) => boolean;
}

export const FinancialGroup = ({ isActive }: FinancialGroupProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-blue-700 font-medium">Financeiro</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/financial')}
              asChild
              className="text-blue-700 hover:bg-blue-50 hover:text-blue-800 data-[state=open]:bg-blue-100 data-[state=open]:text-blue-800"
            >
              <Link to="/financial" className="w-full flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Financeiro</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/financeiro/upload')}
              asChild
              className="text-blue-700 hover:bg-blue-50 hover:text-blue-800 data-[state=open]:bg-blue-100 data-[state=open]:text-blue-800"
            >
              <Link to="/financeiro/upload" className="w-full flex items-center">
                <Calculator className="mr-2 h-4 w-4" />
                <span>Importar XLSX</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
