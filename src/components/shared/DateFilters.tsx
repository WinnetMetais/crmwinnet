
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDateFilters, DateFilterType } from "@/hooks/useDateFilters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateFiltersProps {
  onFilterChange?: (filter: DateFilterType, range: { from: Date; to: Date }) => void;
  className?: string;
}

export const DateFilters = ({ onFilterChange, className }: DateFiltersProps) => {
  const {
    selectedFilter,
    setSelectedFilter,
    customRange,
    setCustomRange,
    dateRange,
    formatDateRange
  } = useDateFilters();

  const handleFilterChange = (filter: DateFilterType) => {
    setSelectedFilter(filter);
    
    // Notificar o componente pai sobre a mudança
    if (onFilterChange) {
      // Para filtros não customizados, calcular o range imediatamente
      if (filter !== 'customizado') {
        setTimeout(() => {
          onFilterChange(filter, dateRange);
        }, 0);
      }
    }
  };

  const handleCustomDateChange = (from: Date | undefined, to: Date | undefined) => {
    if (from && to) {
      const newRange = { from, to };
      setCustomRange(newRange);
      setSelectedFilter('customizado');
      
      if (onFilterChange) {
        onFilterChange('customizado', newRange);
      }
    }
  };

  React.useEffect(() => {
    if (onFilterChange && selectedFilter !== 'customizado') {
      onFilterChange(selectedFilter, dateRange);
    }
  }, [selectedFilter, dateRange, onFilterChange]);

  const filterButtons = [
    { key: 'hoje' as const, label: 'Hoje', primary: true },
    { key: '7_dias' as const, label: '7 Dias', primary: true },
    { key: '30_dias' as const, label: '30 Dias', primary: false },
    { key: '90_dias' as const, label: '90 Dias', primary: false },
    { key: 'esta_semana' as const, label: 'Esta Semana', primary: false },
    { key: 'este_mes' as const, label: 'Este Mês', primary: false },
    { key: 'este_ano' as const, label: 'Este Ano', primary: false }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filtros Rápidos */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((button) => (
          <Button
            key={button.key}
            variant={selectedFilter === button.key ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange(button.key)}
            className={cn(
              "h-8",
              button.primary && selectedFilter === button.key && "bg-blue-600 hover:bg-blue-700",
              button.primary && "border-blue-200 hover:border-blue-300"
            )}
          >
            {button.label}
          </Button>
        ))}
        
        {/* Filtro Customizado */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={selectedFilter === 'customizado' ? "default" : "outline"}
              size="sm"
              className="h-8"
            >
              <CalendarIcon className="h-3 w-3 mr-1" />
              Customizado
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-4">
              <div className="text-sm font-medium">Selecione o período</div>
              <div className="flex gap-2">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Data Inicial</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <CalendarIcon className="h-3 w-3 mr-2" />
                        {customRange?.from ? format(customRange.from, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customRange?.from}
                        onSelect={(date) => {
                          if (date && customRange?.to) {
                            handleCustomDateChange(date, customRange.to);
                          } else if (date) {
                            setCustomRange(prev => ({ ...prev, from: date } as any));
                          }
                        }}
                        locale={ptBR}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Data Final</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <CalendarIcon className="h-3 w-3 mr-2" />
                        {customRange?.to ? format(customRange.to, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customRange?.to}
                        onSelect={(date) => {
                          if (date && customRange?.from) {
                            handleCustomDateChange(customRange.from, date);
                          } else if (date) {
                            setCustomRange(prev => ({ ...prev, to: date } as any));
                          }
                        }}
                        locale={ptBR}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Período Selecionado */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-3 w-3" />
        <span>Período: {formatDateRange(dateRange)}</span>
      </div>
    </div>
  );
};
