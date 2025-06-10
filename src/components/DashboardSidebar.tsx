
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { Aperture } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import { NotificationCenter } from "@/components/notifications";
import { AnalysisGroup } from "./sidebar/SidebarGroups/AnalysisGroup";
import { CommercialGroup } from "./sidebar/SidebarGroups/CommercialGroup";
import { ContentGroup } from "./sidebar/SidebarGroups/ContentGroup";
import { FinancialGroup } from "./sidebar/SidebarGroups/FinancialGroup";
import { ToolsGroup } from "./sidebar/SidebarGroups/ToolsGroup";
import { ConfigGroup } from "./sidebar/SidebarGroups/ConfigGroup";
import { useLocation } from 'react-router-dom';

const DashboardSidebar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
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
        {user?.email && (
          <p className="text-sm text-muted-foreground">
            Bem-vindo(a) de volta, {user.email}!
          </p>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <AnalysisGroup isActiveGroup={isActiveGroup} isActive={isActive} />
        <CommercialGroup isActiveGroup={isActiveGroup} isActive={isActive} />
        <ContentGroup isActiveGroup={isActiveGroup} isActive={isActive} />
        <FinancialGroup isActiveGroup={isActiveGroup} isActive={isActive} />
        <ToolsGroup isActiveGroup={isActiveGroup} isActive={isActive} />
        <ConfigGroup isActiveGroup={isActiveGroup} isActive={isActive} />
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="outline" className="w-full" onClick={() => signOut()}>
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
