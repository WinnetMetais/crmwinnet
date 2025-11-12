import { supabase } from "@/integrations/supabase/client";

export interface CustomerQuote {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cnpj_cpf?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  contact_person?: string;
  created_at: string;
  created_by?: string;
}

export const customersQuotesService = {
  // Buscar todos os clientes
  async getCustomers() {
    // @ts-ignore
    const { data, error } = await supabase
      .from('customers_quotes')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as CustomerQuote[];
  },

  // Buscar cliente por ID
  async getCustomerById(id: string) {
    const { data, error } = await supabase
      .from('customers_quotes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as CustomerQuote;
  },

  // Buscar clientes por termo
  async searchCustomers(searchTerm: string) {
    const { data, error } = await supabase
      .from('customers_quotes')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,cnpj_cpf.ilike.%${searchTerm}%`)
      .order('name', { ascending: true })
      .limit(20);
    
    if (error) throw error;
    return data as CustomerQuote[];
  },

  // Criar novo cliente
  async createCustomer(customer: Omit<CustomerQuote, 'id' | 'created_at' | 'created_by'>) {
    const { data, error } = await supabase
      .from('customers_quotes')
      .insert({
        ...customer,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as CustomerQuote;
  },

  // Atualizar cliente
  async updateCustomer(id: string, updates: Partial<CustomerQuote>) {
    const { data, error } = await supabase
      .from('customers_quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as CustomerQuote;
  },

  // Deletar cliente
  async deleteCustomer(id: string) {
    const { error } = await supabase
      .from('customers_quotes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};