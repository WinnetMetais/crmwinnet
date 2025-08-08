import { supabase } from '@/integrations/supabase/client';

export async function listLeads(){
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw error; return data || [];
}
export async function upsertLead(lead:any){
  const { data, error } = await supabase.from('leads').upsert(lead).select('*').single();
  if (error) throw error; return data;
}
export async function deleteLead(id:string){
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
}

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

export async function listOportunidades(){
  const { data, error } = await supabase.from('oportunidades').select('*, leads(*), clientes(*)').order('created_at', { ascending: false });
  if (error) throw error; return data || [];
}
export async function upsertOportunidade(o:any){
  const { data, error } = await supabase.from('oportunidades').upsert(o).select('*').single();
  if (error) throw error; return data;
}
export async function deleteOportunidade(id:string){
  const { error } = await supabase.from('oportunidades').delete().eq('id', id);
  if (error) throw error;
}

export async function listPedidos(){
  const { data, error } = await supabase.from('pedidos').select('*').order('emissao', { ascending: false });
  if (error) throw error; return data || [];
}
