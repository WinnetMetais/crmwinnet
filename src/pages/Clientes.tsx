import { useEffect, useState } from 'react';
import { listClientes, upsertCliente, deleteCliente } from '@/api/crm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function Clientes(){
  useEffect(()=>{ document.title = 'Clientes CRM | Winnet'; },[]);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ nome_fantasia:'', razao_social:'', cnpj_cpf:'', email:'', telefone:'', whatsapp:'' });
  async function load(){ setItems(await listClientes()); }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{
    const ch = supabase.channel('rt-clientes').on('postgres_changes', { event:'*', schema:'public', table:'clientes' }, load).subscribe();
    return ()=>{ supabase.removeChannel(ch); };
  },[]);
  async function save(){ await upsertCliente(form); setForm({ nome_fantasia:'', razao_social:'', cnpj_cpf:'', email:'', telefone:'', whatsapp:'' }); await load(); }
  async function remove(id:string){ if (confirm('Excluir cliente?')){ await deleteCliente(id); await load(); } }
  const set = (k:string,v:any)=> setForm((f:any)=>({ ...f, [k]:v }));
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Clientes</h1>
      <div className="grid md:grid-cols-6 gap-2">
        {['nome_fantasia','razao_social','cnpj_cpf','email','telefone','whatsapp'].map(k=> (
          <Input key={k} placeholder={k} value={form[k]||''} onChange={e=>set(k,e.target.value)} />
        ))}
        <Button className="md:col-span-6" onClick={save}>Salvar</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr><th>Fantasia</th><th>Razão</th><th>CNPJ/CPF</th><th>Email</th><th>Tel</th><th>Whats</th><th></th></tr></thead>
        <tbody>
          {items.map(x=> (
            <tr key={x.id} className="border-t">
              <td>{x.nome_fantasia}</td><td>{x.razao_social}</td><td>{x.cnpj_cpf}</td><td>{x.email}</td><td>{x.telefone}</td><td>{x.whatsapp}</td>
              <td><Button variant="outline" onClick={()=>remove(x.id)}>Excluir</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
