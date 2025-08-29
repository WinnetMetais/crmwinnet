import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const RealtimeNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = payload.new as any;
          
          // Mostrar toast para notificações em tempo real
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });

          // Se for notificação de receita automática, tocar som
          if (notification.type === 'info' && notification.title.includes('Receita')) {
            try {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(() => {
                // Silently fail if audio can't play
              });
            } catch (error) {
              // Ignore audio errors
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  return null; // This component doesn't render anything
};