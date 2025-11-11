
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFieldService } from '@/services/customFields';
import { useToast } from '@/hooks/use-toast';

export const useCustomFieldsByModule = (module: string) => {
  return useQuery({
    queryKey: ['custom-fields', module],
    queryFn: () => customFieldService.getCustomFieldsByModule(module),
  });
};

export const useVisibleFieldsByModule = (module: string) => {
  return useQuery({
    queryKey: ['custom-fields', module, 'visible'],
    queryFn: () => customFieldService.getVisibleFieldsByModule(module),
  });
};

export const useCreateCustomField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: customFieldService.createCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast({
        title: 'Sucesso',
        description: 'Campo customizado criado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar campo customizado',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCustomField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    // @ts-ignore - Suppress type error for updates parameter
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      // @ts-ignore
      customFieldService.updateCustomField(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast({
        title: 'Sucesso',
        description: 'Campo customizado atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar campo customizado',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCustomField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: customFieldService.deleteCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast({
        title: 'Sucesso',
        description: 'Campo customizado removido com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao remover campo customizado',
        variant: 'destructive',
      });
    },
  });
};
