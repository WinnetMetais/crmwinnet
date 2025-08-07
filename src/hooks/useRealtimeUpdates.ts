import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Canal para atualizações de clientes
    const customersChannel = supabase
      .channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['crm-customers'] });
          queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
      )
      .subscribe();

    // Canal para atualizações de deals
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
          queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
          queryClient.invalidateQueries({ queryKey: ['deals'] });
          queryClient.invalidateQueries({ queryKey: ['deals-kanban'] });
        }
      )
      .subscribe();

    // Canal para atualizações de oportunidades
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
          queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        }
      )
      .subscribe();

    // Canal para atualizações de tarefas
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
          queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    // Canal para atualizações de transações
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
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
          console.log('Transactions updated via realtime');
        }
      )
      .subscribe();

    // Cleanup - remove channels quando o componente for desmontado
    return () => {
      supabase.removeChannel(customersChannel);
      supabase.removeChannel(dealsChannel);
      supabase.removeChannel(opportunitiesChannel);
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [queryClient]);
};

export default useRealtimeUpdates;