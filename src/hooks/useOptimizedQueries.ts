import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

/**
 * Hook otimizado para buscar clientes com paginação
 */
export const useOptimizedCustomers = (page: number = 0, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['customers', page, pageSize],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('customers')
        .select(`
          id, 
          name, 
          email, 
          phone,
          company,
          status,
          created_at,
          data_quality_score,
          segment_id,
          customer_segments(name)
        `, { count: 'exact' })
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return {
        data: data || [],
        total: count || 0,
        hasNextPage: (count || 0) > (page + 1) * pageSize,
        hasPreviousPage: page > 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    placeholderData: (previousData) => previousData, // Mantém dados anteriores durante nova busca
  });
};

/**
 * Hook otimizado para buscar oportunidades
 */
export const useOptimizedOpportunities = (page: number = 0, pageSize: number = 10, filters?: any) => {
  return useQuery({
    queryKey: ['opportunities', page, pageSize, filters],
    queryFn: async () => {
      let query = supabase
        .from('opportunities')
        .select(`
          id,
          title,
          value,
          stage,
          probability,
          expected_close_date,
          created_at,
          customer_id,
          customers(name, email)
        `, { count: 'exact' })
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      // Aplicar filtros se fornecidos
      if (filters?.stage) {
        query = query.eq('stage', filters.stage);
      }
      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }
      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      return {
        data: data || [],
        total: count || 0,
        hasNextPage: (count || 0) > (page + 1) * pageSize,
        hasPreviousPage: page > 0
      };
    },
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 8 * 60 * 1000, // 8 minutos
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook otimizado para buscar transações financeiras
 */
export const useOptimizedTransactions = (page: number = 0, pageSize: number = 10, filters?: any) => {
  return useQuery({
    queryKey: ['transactions', page, pageSize, filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          id,
          title,
          amount,
          type,
          category,
          date,
          status,
          created_at
        `, { count: 'exact' })
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('date', { ascending: false });

      // Aplicar filtros
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.date_from) {
        query = query.gte('date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('date', filters.date_to);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      return {
        data: data || [],
        total: count || 0,
        hasNextPage: (count || 0) > (page + 1) * pageSize,
        hasPreviousPage: page > 0
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 6 * 60 * 1000, // 6 minutos
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook para invalidar queries relacionadas quando há mudanças
 */
export const useRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Analytics reports updates
    const analyticsSubscription = supabase
      .channel('analytics-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'analytics_reports' }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['analytics_reports'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard_metrics'] });
        }
      )
      .subscribe();

    // Customer updates
    const customerSubscription = supabase
      .channel('customer-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'customers' }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['customers'] });
          queryClient.invalidateQueries({ queryKey: ['customer_metrics'] });
        }
      )
      .subscribe();

    // Opportunity updates
    const opportunitySubscription = supabase
      .channel('opportunity-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'opportunities' }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['opportunities'] });
          queryClient.invalidateQueries({ queryKey: ['sales_metrics'] });
        }
      )
      .subscribe();

    // Transaction updates
    const transactionSubscription = supabase
      .channel('transaction-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['financial_metrics'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(analyticsSubscription);
      supabase.removeChannel(customerSubscription);
      supabase.removeChannel(opportunitySubscription);
      supabase.removeChannel(transactionSubscription);
    };
  }, [queryClient]);
};

/**
 * Hook para buscar métricas do dashboard com cache otimizado
 */
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard_metrics'],
    queryFn: async () => {
      // Buscar métricas em paralelo
      const [customersQuery, opportunitiesQuery, transactionsQuery] = await Promise.allSettled([
        supabase
          .from('customers')
          .select('id, created_at, data_quality_score')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        supabase
          .from('opportunities')
          .select('id, value, stage, created_at')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        supabase
          .from('transactions')
          .select('amount, type, date')
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      ]);

      const customers = customersQuery.status === 'fulfilled' ? customersQuery.value.data || [] : [];
      const opportunities = opportunitiesQuery.status === 'fulfilled' ? opportunitiesQuery.value.data || [] : [];
      const transactions = transactionsQuery.status === 'fulfilled' ? transactionsQuery.value.data || [] : [];

      // Calcular métricas
      const totalCustomers = customers.length;
      const avgDataQuality = customers.reduce((acc, c) => acc + (c.data_quality_score || 0), 0) / totalCustomers || 0;
      
      const totalOpportunities = opportunities.length;
      const totalOpportunityValue = opportunities.reduce((acc, o) => acc + (o.value || 0), 0);
      
      const revenue = transactions
        .filter(t => t.type === 'receita')
        .reduce((acc, t) => acc + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'despesa')
        .reduce((acc, t) => acc + t.amount, 0);

      return {
        customers: {
          total: totalCustomers,
          avgDataQuality: Math.round(avgDataQuality)
        },
        opportunities: {
          total: totalOpportunities,
          totalValue: totalOpportunityValue
        },
        financial: {
          revenue,
          expenses,
          profit: revenue - expenses
        }
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};