import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Unified Real-time Sync Hook
 * Consolidates all real-time subscriptions into a single, optimized hook
 * Eliminates redundancy and improves performance
 */
export const useUnifiedRealtimeSync = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log('🔄 Iniciando sincronização em tempo real unificada');

    // Create a single channel for all real-time updates
    const unifiedChannel = supabase
      .channel('unified-sync')
      
      // Customer changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'customers'
      }, (payload) => {
        console.log('👥 Customer change:', payload);
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        queryClient.invalidateQueries({ queryKey: ['crm-customers'] });
      })
      
      // Deal changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'deals'
      }, (payload) => {
        console.log('🤝 Deal change:', payload);
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
      })
      
      // Opportunity changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'opportunities'
      }, (payload) => {
        console.log('🎯 Opportunity change:', payload);
        queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        queryClient.invalidateQueries({ queryKey: ['sales-pipeline'] });
      })
      
      // Quote changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'quotes'
      }, (payload) => {
        console.log('📄 Quote change:', payload);
        queryClient.invalidateQueries({ queryKey: ['quotes'] });
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
      })
      
      // Transaction changes (financial)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, (payload) => {
        console.log('💰 Transaction change:', payload);
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
      })
      
      // Analytics refresh trigger
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sales_analytics'
      }, (payload) => {
        console.log('📊 Analytics refresh:', payload);
        queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      })
      
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Sincronização em tempo real ativa');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro na sincronização em tempo real');
        }
      });

    // Cleanup function
    return () => {
      console.log('🔄 Desconectando sincronização em tempo real');
      supabase.removeChannel(unifiedChannel);
    };
  }, [user, queryClient]);

  return {
    isConnected: true // You could enhance this to track actual connection status
  };
};