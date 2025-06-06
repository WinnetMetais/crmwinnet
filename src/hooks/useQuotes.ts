
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '@/services/quotes';
import { useToast } from '@/hooks/use-toast';

export const useQuotes = () => {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: quoteService.getQuotes,
  });
};

export const useQuote = (id: string) => {
  return useQuery({
    queryKey: ['quotes', id],
    queryFn: () => quoteService.getQuoteById(id),
    enabled: !!id,
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: quoteService.createQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: 'Sucesso',
        description: 'Orçamento criado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar orçamento',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      quoteService.updateQuote(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: 'Sucesso',
        description: 'Orçamento atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar orçamento',
        variant: 'destructive',
      });
    },
  });
};
