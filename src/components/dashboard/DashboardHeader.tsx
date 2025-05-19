
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (value: string) => void;
}

export const DashboardHeader = ({ dateRange, setDateRange }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-4 items-center">
        <SidebarTrigger />
        <h1 className="text-3xl font-bold">Dashboard de Marketing - Winnet Metais</h1>
      </div>
      <div className="flex space-x-4 items-center">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="12m">Último ano</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};
