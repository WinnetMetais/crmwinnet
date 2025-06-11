
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CRMDataService } from "@/services/crmData";
import { ValidationResult, QualityMetrics, DataValidationLog, CRMFilters } from "@/types/crm";
import { DateFilterType } from "@/hooks/useDateFilters";

export const useCRMData = () => {
  const [filters, setFilters] = useState<CRMFilters>({
    dateFilter: 'hoje' as DateFilterType,
    dateRange: null,
    searchTerm: '',
    status: [],
    priority: [],
    segment: []
  });

  const queryClient = useQueryClient();

  // Query para carregar clientes com filtros
  const {
    data: customers = [],
    isLoading: customersLoading,
    error: customersError
  } = useQuery({
    queryKey: ['crm-customers', filters],
    queryFn: () => CRMDataService.getCustomersWithFilters(filters),
    refetchOnWindowFocus: false
  });

  // Query para métricas de qualidade
  const {
    data: qualityMetrics = {},
    isLoading: metricsLoading
  } = useQuery({
    queryKey: ['crm-quality-metrics'],
    queryFn: CRMDataService.getQualityMetrics,
    refetchInterval: 300000 // Atualizar a cada 5 minutos
  });

  // Query para logs de validação
  const {
    data: validationLogs = [],
    isLoading: logsLoading
  } = useQuery({
    queryKey: ['crm-validation-logs'],
    queryFn: () => CRMDataService.getRecentValidationLogs(50),
    refetchInterval: 60000 // Atualizar a cada 1 minuto
  });

  // Mutation para executar validação
  const runValidationMutation = useMutation({
    mutationFn: (customerIds?: string[]) => CRMDataService.runDataValidation(customerIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-customers'] });
      queryClient.invalidateQueries({ queryKey: ['crm-quality-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['crm-validation-logs'] });
    }
  });

  // Atualizar filtros
  const updateFilters = (newFilters: Partial<CRMFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Filtro de data
  const updateDateFilter = (filter: DateFilterType, range: { from: Date; to: Date }) => {
    setFilters(prev => ({
      ...prev,
      dateFilter: filter,
      dateRange: range
    }));
  };

  // Estatísticas calculadas
  const stats = {
    total: customers.length,
    high: customers.filter(c => c.severity === 'high').length,
    medium: customers.filter(c => c.severity === 'medium').length,
    low: customers.filter(c => c.severity === 'low').length,
    avgScore: customers.length > 0 
      ? Math.round(customers.reduce((sum, c) => sum + (c.data_quality_score || 0), 0) / customers.length)
      : 0
  };

  return {
    // Dados
    customers,
    qualityMetrics,
    validationLogs,
    stats,
    filters,
    
    // Estados de carregamento
    customersLoading,
    metricsLoading,
    logsLoading,
    isValidating: runValidationMutation.isPending,
    
    // Erros
    customersError,
    
    // Ações
    updateFilters,
    updateDateFilter,
    runValidation: runValidationMutation.mutate,
    
    // Utilidades
    refreshData: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-customers'] });
      queryClient.invalidateQueries({ queryKey: ['crm-quality-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['crm-validation-logs'] });
    }
  };
};
