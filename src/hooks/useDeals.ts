import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealService } from '@/services/deals';
import { useToast } from '@/hooks/use-toast';

export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: dealService.getDeals,
  });
};

export const useDeal = (id: string) => {
  return useQuery({
    queryKey: ['deals', id],
    queryFn: () => dealService.getDealById(id),
    enabled: !!id,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: dealService.createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: 'Sucesso',
        description: 'Deal criado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar deal',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      dealService.updateDeal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: 'Sucesso',
        description: 'Deal atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar deal',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: dealService.deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: 'Sucesso',
        description: 'Deal deletado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao deletar deal',
        variant: 'destructive',
      });
    },
  });
};