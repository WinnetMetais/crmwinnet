
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Download, BarChart3 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

type RangeOption = '7d' | '30d' | '90d' | '12m';

interface DashboardHeaderProps {
  dateRange: RangeOption;
  setDateRange: (value: RangeOption) => void;
}

export const DashboardHeader = ({ dateRange, setDateRange }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
      <div className="flex space-x-4 items-center">
        <SidebarTrigger className="text-white hover:bg-white/10" />
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Dashboard Winnet Metais</h1>
            <p className="text-blue-100">Central de Análises e Métricas Comerciais</p>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 items-center">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="12m">Último ano</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        
        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};
