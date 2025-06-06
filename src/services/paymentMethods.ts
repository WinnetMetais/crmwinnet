
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type PaymentMethod = Tables<'payment_methods'>;

export const paymentMethodService = {
  // Buscar todos os métodos de pagamento ativos
  async getActivePaymentMethods() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Buscar todos os métodos de pagamento
  async getAllPaymentMethods() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }
};
