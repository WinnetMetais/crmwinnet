import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  quote_id?: string;
  issue_date: string;
  gross_total: number;
  net_total: number;
  status: string;
  owner_id?: string;
  user_id?: string;
  delivery_address?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  description?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at'>;

class OrdersService {
  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers(name, email),
        order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getOrder(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers(name, email, cnpj),
        order_items(*, products(name, description))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        user_id: userData.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteOrder(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const ordersService = new OrdersService();