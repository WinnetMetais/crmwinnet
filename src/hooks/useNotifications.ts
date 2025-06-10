
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
    createNotification({
      type,
      title: 'Atualização de Cliente',
      message,
      user_id: '', // Será preenchido pelo backend
      metadata: { module: 'customers', customerId },
    });
  };

  const createSalesNotification = (dealId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    createNotification({
      type,
      title: 'Atualização de Vendas',
      message,
      user_id: '', // Será preenchido pelo backend
      metadata: { module: 'sales', dealId },
    });
  };

  const createTaskNotification = (taskId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    createNotification({
      type,
      title: 'Atualização de Tarefa',
      message,
      user_id: '', // Será preenchido pelo backend
      metadata: { module: 'tasks', taskId },
    });
  };

  const createFinancialNotification = (transactionId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    createNotification({
      type,
      title: 'Atualização Financeira',
      message,
      user_id: '', // Será preenchido pelo backend
      metadata: { module: 'financial', transactionId },
    });
  };

  const createProductNotification = (productId: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    createNotification({
      type,
      title: 'Atualização de Produto',
      message,
      user_id: '', // Será preenchido pelo backend
      metadata: { module: 'products', productId },
    });
  };

  return {
    createCustomerNotification,
    createSalesNotification,
    createTaskNotification,
    createFinancialNotification,
    createProductNotification,
  };
};
