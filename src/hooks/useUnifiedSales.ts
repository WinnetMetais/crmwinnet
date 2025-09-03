import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedCRMService, UnifiedCustomer, SalesAnalytics } from '@/services/unifiedCRM';
import { useToast } from '@/hooks/use-toast';

/**
 * Unified Sales Hook
 * Consolidates all sales-related queries and mutations with optimized caching
 */

export const useUnifiedSales = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all customers with relationship counts
  const useCustomersWithCounts = () => {
    return useQuery({
      queryKey: ['customers-with-counts'],
      queryFn: unifiedCRMService.getCustomersWithCounts,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 30000, // 30 seconds
    });
  };

  // Get single customer with all relationships
  const useCustomerWithRelationships = (customerId: string) => {
    return useQuery({
      queryKey: ['customer-relationships', customerId],
      queryFn: () => unifiedCRMService.getCustomerWithRelationships(customerId),
      enabled: !!customerId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Get comprehensive sales analytics
  const useSalesAnalytics = () => {
    return useQuery({
      queryKey: ['sales-analytics'],
      queryFn: unifiedCRMService.getSalesAnalytics,
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: 60000, // 1 minute
    });
  };

  // Create customer with auto-opportunity
  const useCreateCustomer = () => {
    return useMutation({
      mutationFn: unifiedCRMService.createCustomer,
      onSuccess: (data) => {
        // Invalidate all related queries
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        queryClient.invalidateQueries({ queryKey: ['customers-with-counts'] });
        queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
        
        toast({
          title: 'Cliente criado com sucesso',
          description: 'Uma oportunidade foi criada automaticamente.',
        });
      },
      onError: (error: any) => {
        console.error('Error creating customer:', error);
        toast({
          title: 'Erro ao criar cliente',
          description: error.message || 'Erro inesperado',
          variant: 'destructive',
        });
      },
    });
  };

  // Progress opportunity to deal
  const useProgressOpportunityToDeal = () => {
    return useMutation({
      mutationFn: ({ opportunityId, dealData }: { opportunityId: string; dealData?: any }) =>
        unifiedCRMService.progressOpportunityToDeal(opportunityId, dealData),
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
        
        toast({
          title: 'Oportunidade convertida',
          description: 'Deal criado com sucesso!',
        });
      },
      onError: (error: any) => {
        console.error('Error progressing opportunity:', error);
        toast({
          title: 'Erro ao converter oportunidade',
          description: error.message || 'Erro inesperado',
          variant: 'destructive',
        });
      },
    });
  };

  // Refresh analytics
  const useRefreshAnalytics = () => {
    return useMutation({
      mutationFn: unifiedCRMService.refreshAnalytics,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        
        toast({
          title: 'Analytics atualizadas',
          description: 'Dados consolidados com sucesso!',
        });
      },
      onError: (error: any) => {
        console.error('Error refreshing analytics:', error);
        toast({
          title: 'Erro ao atualizar analytics',
          description: error.message || 'Erro inesperado',
          variant: 'destructive',
        });
      },
    });
  };

  return {
    // Queries
    useCustomersWithCounts,
    useCustomerWithRelationships,
    useSalesAnalytics,
    
    // Mutations
    useCreateCustomer,
    useProgressOpportunityToDeal,
    useRefreshAnalytics,
  };
};

/**
 * Simplified hook for quick access to sales analytics
 */
export const useSalesMetrics = (): {
  data: SalesAnalytics | undefined;
  isLoading: boolean;
  error: any;
  refresh: () => void;
} => {
  const { useSalesAnalytics, useRefreshAnalytics } = useUnifiedSales();
  const { data, isLoading, error } = useSalesAnalytics();
  const { mutate: refresh } = useRefreshAnalytics();

  return {
    data,
    isLoading,
    error,
    refresh,
  };
};

/**
 * Hook for customer management with all relationships
 */
export const useCustomerManager = (customerId?: string) => {
  const { useCustomerWithRelationships, useCreateCustomer } = useUnifiedSales();
  
  const customerQuery = useCustomerWithRelationships(customerId || '');
  const createCustomer = useCreateCustomer();

  return {
    customer: customerQuery.data,
    isLoading: customerQuery.isLoading,
    error: customerQuery.error,
    createCustomer: createCustomer.mutate,
    isCreating: createCustomer.isPending,
  };
};