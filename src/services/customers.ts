
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
  social_reason?: string;
  lifecycle_stage?: string;
  tags?: string[];
  owner?: string;
  created_by?: string;
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

export async function createCustomer(customerData: Omit<Customer, "id" | "created_at" | "updated_at">): Promise<Customer> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  const { data, error } = await supabase
    .from("customers")
    .insert([{
      ...customerData,
      created_by: user.user.id,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating customer:", error);
    throw new Error("Erro ao criar cliente: " + error.message);
  }

  return data;
}

export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .update({
      ...customerData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating customer:", error);
    throw new Error("Erro ao atualizar cliente: " + error.message);
  }

  return data;
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    const code = (error as any)?.code || '';
    const msg = (error as any)?.message || '';
    if (code === '23503' || /foreign key constraint/i.test(msg)) {
      throw new Error('Não é possível excluir este cliente porque existem negociações/oportunidades vinculadas. Exclua ou desvincule-as antes de continuar.');
    }
    console.error("Error deleting customer:", error);
    throw new Error("Erro ao excluir cliente: " + msg);
  }
}

export async function deleteCustomerCascade(id: string): Promise<void> {
  try {
    // Apagar itens ligados às oportunidades do cliente (quando não houver CASCADE no banco)
    const { data: opps } = await supabase
      .from('opportunities')
      .select('id')
      .eq('customer_id', id);

    const oppIds = (opps || []).map((o: any) => o.id);
    if (oppIds.length > 0) {
      // @ts-ignore
      await supabase.from('opportunity_items').delete().in('opportunity_id', oppIds);
    }

    // Apagar oportunidades, negócios (deals) e interações
    await supabase.from('opportunities').delete().eq('customer_id', id);
    await supabase.from('deals').delete().eq('customer_id', id);
    // @ts-ignore
    await supabase.from('customer_interactions').delete().eq('customer_id', id);

    // Por fim, apagar o cliente
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;

    toast({
      title: 'Cliente excluído',
      description: 'Cliente e registros vinculados foram removidos com sucesso.',
    });
  } catch (e: any) {
    console.error('Cascade delete error:', e);
    throw new Error('Erro ao excluir cliente e vínculos: ' + (e?.message || ''));
  }
}
