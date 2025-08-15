import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeQuotes = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Configurar canal de realtime para quotes
    const quotesChannel = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        (payload) => {
          console.log('Quotes change detected:', payload);
          // Invalidar queries relacionadas a quotes
          queryClient.invalidateQueries({ queryKey: ['quotes'] });
        }
      )
      .subscribe();

    // Configurar canal de realtime para quote_items
    const quoteItemsChannel = supabase
      .channel('quote-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_items'
        },
        (payload) => {
          console.log('Quote items change detected:', payload);
          // Invalidar queries relacionadas a quotes
          queryClient.invalidateQueries({ queryKey: ['quotes'] });
        }
      )
      .subscribe();

    // Configurar canal de realtime para customers_quotes
    const customersChannel = supabase
      .channel('customers-quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers_quotes'
        },
        (payload) => {
          console.log('Customers quotes change detected:', payload);
          // Invalidar queries relacionadas a clientes
          queryClient.invalidateQueries({ queryKey: ['customers-quotes'] });
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(quoteItemsChannel);
      supabase.removeChannel(customersChannel);
    };
  }, [queryClient]);
};