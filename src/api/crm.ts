import { supabase } from '@/integrations/supabase/client';

// Leads functions removed - using customers table instead

export async function listClientes(){
  const { data, error } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
  if (error) throw error; return data || [];
}
export async function upsertCliente(c:any){
  const { data, error } = await supabase.from('clientes').upsert(c).select('*').single();
  if (error) throw error; return data;
}
export async function deleteCliente(id:string){
  const { error } = await supabase.from('clientes').delete().eq('id', id);
  if (error) throw error;
}

// Oportunidades functions removed - using opportunities table instead

export async function listPedidos(){
  const { data, error } = await supabase.from('pedidos').select('*').order('emissao', { ascending: false });
  if (error) throw error; return data || [];
}
