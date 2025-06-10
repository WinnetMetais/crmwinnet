
import React, { createContext, useContext, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

const NotificationContext = createContext<{
  unreadCount: number;
  createNotification: (notification: any) => void;
} | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { unreadCount, createNotification, unreadNotifications } = useNotifications();

  // Mostrar toast para novas notificações
  useEffect(() => {
    if (unreadNotifications.length > 0) {
      const latestNotification = unreadNotifications[0];
      
      // Verifica se é uma notificação realmente nova (criada nos últimos 10 segundos)
      const isNew = new Date().getTime() - new Date(latestNotification.created_at).getTime() < 10000;
      
      if (isNew) {
        toast({
          title: latestNotification.title,
          description: latestNotification.message,
          variant: latestNotification.type === 'warning' ? 'destructive' : 'default',
        });
      }
    }
  }, [unreadNotifications]);

  return (
    <NotificationContext.Provider value={{ unreadCount, createNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
