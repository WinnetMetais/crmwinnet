
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
  status?: string;
  lead_source?: string;
  website?: string;
  last_contact_date?: string;
  created_at?: string;
  updated_at?: string;
  segment_id?: string;
  cnpj?: string;
  contact_person?: string;
}

export async function getCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    toast({
      title: "Erro ao buscar clientes",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
}

export async function getCustomerById(id: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao buscar cliente",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function createCustomer(customer: Omit<Customer, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Cliente criado",
      description: "O cliente foi criado com sucesso.",
    });

    // Enviar notificação para o sistema
    await supabase.from('notifications').insert({
      type: 'success',
      title: 'Novo Cliente Cadastrado',
      message: `Cliente ${customer.name} foi cadastrado com sucesso.`,
      metadata: { module: 'customers', customerId: data.id }
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao criar cliente",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Cliente atualizado",
      description: "O cliente foi atualizado com sucesso.",
    });

    // Enviar notificação para o sistema
    await supabase.from('notifications').insert({
      type: 'info',
      title: 'Cliente Atualizado',
      message: `Dados do cliente ${data.name} foram atualizados.`,
      metadata: { module: 'customers', customerId: id }
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Erro ao atualizar cliente",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteCustomer(id: string) {
  try {
    // Buscar dados do cliente antes de deletar
    const { data: customerData } = await supabase
      .from('customers')
      .select('name')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
    });

    // Enviar notificação para o sistema
    await supabase.from('notifications').insert({
      type: 'warning',
      title: 'Cliente Removido',
      message: `Cliente ${customerData?.name || 'Desconhecido'} foi removido do sistema.`,
      metadata: { module: 'customers', customerId: id }
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Erro ao remover cliente",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
}
