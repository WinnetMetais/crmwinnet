import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarMenu,
  SidebarNav,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  BarChart,
  Mail,
  Settings,
  HelpCircle,
  Activity,
  FileBarGraph,
  MessageSquare,
  UserPlus,
  FileText,
  Calendar,
  Bell,
  Aperture,
  LucideIcon
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import { NotificationCenter } from "@/components/notifications";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarItemComponent: React.FC<SidebarItemProps> = ({ href, icon: Icon, label }) => (
  <SidebarItem>
    <Link to={href} className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  </SidebarItem>
);

const DashboardSidebar = () => {
  const { user, signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarContent className="w-64 py-4 flex flex-col">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Aperture className="h-6 w-6" />
            <span className="font-bold text-lg">
              <Link to="/">
                Dashboard
              </Link>
            </span>
          </div>
          <NotificationCenter />
        </div>
        <SidebarHeader>
          <p className="text-sm text-muted-foreground">
            Bem-vindo(a) de volta, {user?.name}!
          </p>
        </SidebarHeader>
        <SidebarNav>
          <SidebarItemComponent href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItemComponent href="/analysis" icon={BarChart} label="Análise" />
          <SidebarItemComponent href="/crm" icon={UserPlus} label="CRM" />
          <SidebarItemComponent href="/content" icon={FileText} label="Conteúdo" />
          <SidebarItemComponent href="/marketing-automation" icon={Activity} label="Automação" />
          <SidebarItemComponent href="/customers" icon={Users} label="Clientes" />
          <SidebarItemComponent href="/products" icon={Package} label="Produtos" />
          <SidebarItemComponent href="/sales" icon={ShoppingBag} label="Vendas" />
          <SidebarItemComponent href="/commercial" icon={MessageSquare} label="Comercial" />
          <SidebarItemComponent href="/financial" icon={FileBarGraph} label="Financeiro" />
          <SidebarItemComponent href="/reports" icon={BarChart} label="Relatórios" />
          <SidebarItemComponent href="/filters" icon={Settings} label="Filtros" />
          <SidebarItemComponent href="/calendar" icon={Calendar} label="Calendário" />
          <SidebarItemComponent href="/tasks" icon={Bell} label="Tarefas" />
          <SidebarItemComponent href="/ai" icon={HelpCircle} label="IA Dashboard" />
        </SidebarNav>
        <SidebarMenu>
          <SidebarItem>
            <Link to="/config" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary">
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </SidebarItem>
          <SidebarItem>
            <Link to="/users" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary">
              <Users className="h-4 w-4" />
              Usuários
            </Link>
          </SidebarItem>
          <SidebarItem>
            <Link to="/templates" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary">
              <FileText className="h-4 w-4" />
              Templates
            </Link>
          </SidebarItem>
          <SidebarItem>
            <Link to="/backup" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary">
              <HelpCircle className="h-4 w-4" />
              Backup
            </Link>
          </SidebarItem>
        </SidebarMenu>
        <SidebarFooter className="mt-auto">
          <Button variant="outline" className="w-full" onClick={() => signOut()}>
            Sair
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
