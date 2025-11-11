
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, type Notification } from '@/services/notifications';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Buscar todas as notificações
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });

  // Buscar notificações não lidas
  const { data: unreadNotifications = [] } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: notificationService.getUnreadNotifications,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  // Criar nova notificação
  const createNotificationMutation = useMutation({
    mutationFn: notificationService.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar notificação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Marcar como lida
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    },
  });

  // Marcar todas como lidas
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    },
  });

  // Deletar notificação
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    },
  });

  return {
    notifications,
    unreadNotifications,
    unreadCount: unreadNotifications.length,
    isLoading,
    createNotification: createNotificationMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    isCreating: createNotificationMutation.isPending,
  };
};

// Hook para criar notificações específicas por módulo
export const useModuleNotifications = () => {
  const { createNotification } = useNotifications();

  const createCustomerNotification = (customerId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    // @ts-ignore - user_id will be filled by backend
    createNotification({
      type,
      title: 'Atualização de Cliente',
      message,
      metadata: { module: 'customers', customerId },
    } as any);
  };

  const createSalesNotification = (dealId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    // @ts-ignore - user_id will be filled by backend
    createNotification({
      type,
      title: 'Atualização de Vendas',
      message,
      metadata: { module: 'sales', dealId },
    } as any);
  };

  const createTaskNotification = (taskId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    // @ts-ignore - user_id will be filled by backend
    createNotification({
      type,
      title: 'Atualização de Tarefa',
      message,
      metadata: { module: 'tasks', taskId },
    } as any);
  };

  const createFinancialNotification = (transactionId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    // @ts-ignore - user_id will be filled by backend
    createNotification({
      type,
      title: 'Atualização Financeira',
      message,
      metadata: { module: 'financial', transactionId },
    } as any);
  };

  const createProductNotification = (productId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    // @ts-ignore - user_id will be filled by backend
    createNotification({
      type,
      title: 'Atualização de Produto',
      message,
      metadata: { module: 'products', productId },
    } as any);
  };

  return {
    createCustomerNotification,
    createSalesNotification,
    createTaskNotification,
    createFinancialNotification,
    createProductNotification,
  };
};
