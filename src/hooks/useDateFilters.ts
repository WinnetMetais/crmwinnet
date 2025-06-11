
import { useState, useMemo } from 'react';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export type DateFilterType = 'hoje' | '7_dias' | '30_dias' | '90_dias' | 'esta_semana' | 'este_mes' | 'este_ano' | 'customizado';

export interface DateRange {
  from: Date;
  to: Date;
}

export const useDateFilters = () => {
  const [selectedFilter, setSelectedFilter] = useState<DateFilterType>('hoje');
  const [customRange, setCustomRange] = useState<DateRange | null>(null);

  const dateRange = useMemo((): DateRange => {
    const now = new Date();
    
    switch (selectedFilter) {
      case 'hoje':
        return {
          from: startOfDay(now),
          to: endOfDay(now)
        };
      
      case '7_dias':
        return {
          from: startOfDay(subDays(now, 6)), // Incluindo hoje, são 7 dias
          to: endOfDay(now)
        };
      
      case '30_dias':
        return {
          from: startOfDay(subDays(now, 29)),
          to: endOfDay(now)
        };
      
      case '90_dias':
        return {
          from: startOfDay(subDays(now, 89)),
          to: endOfDay(now)
        };
      
      case 'esta_semana':
        return {
          from: startOfWeek(now, { weekStartsOn: 1 }), // Segunda-feira
          to: endOfWeek(now, { weekStartsOn: 1 }) // Domingo
        };
      
      case 'este_mes':
        return {
          from: startOfMonth(now),
          to: endOfMonth(now)
        };
      
      case 'este_ano':
        return {
          from: startOfYear(now),
          to: endOfYear(now)
        };
      
      case 'customizado':
        if (customRange) {
          return {
            from: startOfDay(customRange.from),
            to: endOfDay(customRange.to)
          };
        }
        // Fallback para hoje se não há range customizado
        return {
          from: startOfDay(now),
          to: endOfDay(now)
        };
      
      default:
        return {
          from: startOfDay(now),
          to: endOfDay(now)
        };
    }
  }, [selectedFilter, customRange]);

  const formatDateRange = (range: DateRange): string => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  };

  const getSQLDateFilter = (field: string): string => {
    const formatSQLDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    return `${field} >= '${formatSQLDate(dateRange.from)}' AND ${field} <= '${formatSQLDate(dateRange.to)}'`;
  };

  const getSupabaseFilter = () => {
    const formatSupabaseDate = (date: Date) => {
      return date.toISOString();
    };

    return {
      from: formatSupabaseDate(dateRange.from),
      to: formatSupabaseDate(dateRange.to)
    };
  };

  return {
    selectedFilter,
    setSelectedFilter,
    customRange,
    setCustomRange,
    dateRange,
    formatDateRange,
    getSQLDateFilter,
    getSupabaseFilter
  };
};
