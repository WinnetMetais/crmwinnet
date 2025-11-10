
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
};

export const NotificationBanner = () => {
  const { unreadNotifications, markAsRead } = useNotifications();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Mostra apenas a notificação mais recente que não foi dispensada
  const latestNotification = (unreadNotifications as Notification[])
    .filter(n => !dismissedIds.includes(n.id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
    markAsRead(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationVariant = (type: string): "default" | "destructive" => {
    return type === 'warning' ? 'destructive' : 'default';
  };

  if (!latestNotification) return null;

  return (
    <Alert variant={getNotificationVariant(latestNotification.type)} className="mb-4">
      {getNotificationIcon(latestNotification.type)}
      <AlertTitle className="flex items-center justify-between">
        {latestNotification.title}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDismiss(latestNotification.id)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription>
        {latestNotification.message}
      </AlertDescription>
    </Alert>
  );
};
