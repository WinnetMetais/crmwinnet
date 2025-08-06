import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppMessage } from '@/services/whatsapp';

export const useWhatsAppRealtime = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('whatsapp_messages')
          .select('*')
          .order('received_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const formattedMessages = data?.map((msg: any) => ({
          id: msg.id,
          contact: msg.contact_name || 'Contato não identificado',
          message: msg.message,
          timestamp: new Date(msg.received_at || msg.created_at).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          message_type: msg.message_type || 'text',
          direction: msg.direction || 'received',
          status: msg.status,
          customer_id: msg.customer_id,
          phone_number: msg.phone_number,
          whatsapp_message_id: msg.whatsapp_message_id,
          is_read: msg.is_read,
          received_at: msg.received_at,
          created_at: msg.created_at
        })) || [];

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Set up realtime subscription
    const channel = supabase
      .channel('whatsapp-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages'
        },
        (payload) => {
          console.log('New WhatsApp message received:', payload.new);
          
          const newMessage = {
            id: payload.new.id,
            contact: payload.new.contact_name || 'Contato não identificado',
            message: payload.new.message,
            timestamp: new Date(payload.new.received_at || payload.new.created_at).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            message_type: payload.new.message_type || 'text',
            direction: payload.new.direction || 'received',
            status: payload.new.status,
            customer_id: payload.new.customer_id,
            phone_number: payload.new.phone_number,
            whatsapp_message_id: payload.new.whatsapp_message_id,
            is_read: payload.new.is_read,
            received_at: payload.new.received_at,
            created_at: payload.new.created_at
          };
          
          setMessages(prev => [newMessage, ...prev.slice(0, 49)]); // Keep only last 50 messages
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'whatsapp_messages'
        },
        (payload) => {
          console.log('WhatsApp message updated:', payload.new);
          
          setMessages(prev => prev.map(msg => 
            msg.id === payload.new.id 
              ? {
                  ...msg,
                  status: payload.new.status,
                  is_read: payload.new.is_read
                }
              : msg
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    messages,
    loading,
    refreshMessages: async () => {
      setLoading(true);
      // Reload messages logic here
      setLoading(false);
    }
  };
};