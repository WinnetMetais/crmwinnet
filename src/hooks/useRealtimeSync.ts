import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    // Configurar canais de realtime para sincronização automática
    const setupRealtimeChannels = () => {
      // Canal para customers
      const customersChannel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'customers'
          },
          () => {
            console.log('Customers data changed, refreshing...');
            queryClient.invalidateQueries({ queryKey: ['crm-customers'] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
          }
        )
        .subscribe();

      // Canal para deals
      const dealsChannel = supabase
        .channel('deals-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deals'
          },
          () => {
            console.log('Deals data changed, refreshing...');
            queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
            queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
          }
        )
        .subscribe();

      // Canal para opportunities
      const opportunitiesChannel = supabase
        .channel('opportunities-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'opportunities'
          },
          () => {
            console.log('Opportunities data changed, refreshing...');
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
          }
        )
        .subscribe();

      // Canal para tasks
      const tasksChannel = supabase
        .channel('tasks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks'
          },
          () => {
            console.log('Tasks data changed, refreshing...');
            queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
          }
        )
        .subscribe();

      // Canal para transactions
      const transactionsChannel = supabase
        .channel('transactions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions'
          },
          () => {
            console.log('Transactions data changed, refreshing...');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
          }
        )
        .subscribe();

      channelsRef.current = [
        customersChannel,
        dealsChannel,
        opportunitiesChannel,
        tasksChannel,
        transactionsChannel
      ];
    };

    setupRealtimeChannels();

    // Cleanup function
    return () => {
      channelsRef.current.forEach(channel => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      });
      channelsRef.current = [];
    };
  }, [queryClient]);

  return {
    isConnected: channelsRef.current.length > 0
  };
};