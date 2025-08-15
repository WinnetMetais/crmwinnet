import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersQuotesService } from '@/services/customersQuotes';
import { useToast } from '@/hooks/use-toast';

export const useCustomersQuotes = () => {
  return useQuery({
    queryKey: ['customers-quotes'],
    queryFn: customersQuotesService.getCustomers,
  });
};

export const useCustomerQuote = (id: string) => {
  return useQuery({
    queryKey: ['customers-quotes', id],
    queryFn: () => customersQuotesService.getCustomerById(id),
    enabled: !!id,
  });
};

export const useSearchCustomersQuotes = (searchTerm: string) => {
  return useQuery({
    queryKey: ['customers-quotes', 'search', searchTerm],
    queryFn: () => customersQuotesService.searchCustomers(searchTerm),
    enabled: searchTerm.length >= 2,
  });
};

export const useCreateCustomerQuote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: customersQuotesService.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-quotes'] });
      toast({
        title: 'Sucesso',
        description: 'Cliente criado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar cliente',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCustomerQuote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      customersQuotesService.updateCustomer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-quotes'] });
      toast({
        title: 'Sucesso',
        description: 'Cliente atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar cliente',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCustomerQuote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: customersQuotesService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-quotes'] });
      toast({
        title: 'Sucesso',
        description: 'Cliente deletado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao deletar cliente',
        variant: 'destructive',
      });
    },
  });
};