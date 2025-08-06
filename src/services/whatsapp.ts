import { supabase } from "@/integrations/supabase/client";

export interface WhatsAppMessage {
  id: string;
  contact: string;
  message: string;
  timestamp: string;
  message_type: 'text' | 'audio' | 'image' | 'interactive' | 'button';
  direction: 'sent' | 'received';
  status: 'delivered' | 'read' | 'pending';
  customer_id?: string;
  phone_number?: string;
  whatsapp_message_id?: string;
  is_read?: boolean;
  received_at?: string;
  created_at: string;
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
}

export const whatsappService = {
  async getMessages(): Promise<WhatsAppMessage[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data?.map((msg: any) => ({
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
    } catch (error) {
      console.error('Error fetching WhatsApp messages:', error);
      return [];
    }
  },

  async sendMessage(data: {
    contact: string;
    message: string;
    customer_id?: string;
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('whatsapp_messages' as any)
        .insert({
          contact_name: data.contact,
          message: data.message,
          message_type: 'text',
          direction: 'sent',
          status: 'pending',
          customer_id: data.customer_id,
          user_id: user.id
        });

      if (error) throw error;

      // Here you would integrate with actual WhatsApp API
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  },

  async getContacts(): Promise<WhatsAppContact[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone')
        .not('phone', 'is', null)
        .order('name');

      if (error) throw error;

      return data?.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone || ''
      })) || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  }
};