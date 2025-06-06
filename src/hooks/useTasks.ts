
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/tasks';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });
};

export const usePendingTasks = () => {
  return useQuery({
    queryKey: ['tasks', 'pending'],
    queryFn: taskService.getPendingTasks,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Sucesso',
        description: 'Tarefa criada com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar tarefa',
        variant: 'destructive',
      });
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: taskService.completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Sucesso',
        description: 'Tarefa concluída!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao concluir tarefa',
        variant: 'destructive',
      });
    },
  });
};
