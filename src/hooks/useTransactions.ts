
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transactions';
import { useToast } from '@/hooks/use-toast';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: transactionService.getTransactions,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    staleTime: 10000, // Considera dados obsoletos após 10 segundos
  });
};

export const useTransactionsByType = (type: 'receita' | 'despesa') => {
  return useQuery({
    queryKey: ['transactions', type],
    queryFn: () => transactionService.getTransactionsByType(type),
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    staleTime: 10000, // Considera dados obsoletos após 10 segundos
  });
};

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: ['financial-summary'],
    queryFn: transactionService.getFinancialSummary,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
    staleTime: 10000, // Considera dados obsoletos após 10 segundos
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast({
        title: 'Sucesso',
        description: 'Transação criada com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar transação',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      transactionService.updateTransaction(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast({
        title: 'Sucesso',
        description: 'Transação atualizada com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar transação',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
      toast({
        title: 'Sucesso',
        description: 'Transação deletada com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao deletar transação',
        variant: 'destructive',
      });
    },
  });
};
