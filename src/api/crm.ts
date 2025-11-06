import { supabase } from '@/integrations/supabase/client';

// DEPRECATED: Use unifiedCRM service instead
// This file is kept for backward compatibility only

export async function listClientes(){
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error) throw error; return data || [];
}

export async function upsertCliente(c:any){
  const { data, error } = await supabase.from('customers').upsert(c).select('*').single();
  if (error) throw error; return data;
}

export async function deleteCliente(id:string){
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
}
