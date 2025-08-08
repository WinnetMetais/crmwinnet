import { useEffect, useState } from 'react';
import { listLeads, upsertLead, deleteLead } from '@/api/crm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function Leads(){
  useEffect(()=>{ document.title = 'Leads CRM | Winnet'; },[]);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ nome:'', empresa:'', email:'', telefone:'', origem:'', etapa:'NOVO' });
  async function load(){ setItems(await listLeads()); }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{
    const ch = supabase.channel('rt-leads').on('postgres_changes', { event:'*', schema:'public', table:'leads' }, load).subscribe();
    return ()=>{ supabase.removeChannel(ch); };
  },[]);
  async function save(){ await upsertLead(form); setForm({ nome:'', empresa:'', email:'', telefone:'', origem:'', etapa:'NOVO' }); await load(); }
  async function remove(id:string){ if (confirm('Excluir lead?')){ await deleteLead(id); await load(); } }
  const set = (k:string,v:any)=> setForm((f:any)=>({ ...f, [k]:v }));
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Leads</h1>
      <div className="grid md:grid-cols-6 gap-2">
        {['nome','empresa','email','telefone','origem','etapa'].map(k=> (
          <Input key={k} placeholder={k} value={form[k]||''} onChange={e=>set(k,e.target.value)} />
        ))}
        <Button className="md:col-span-6" onClick={save}>Salvar</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr><th>Nome</th><th>Empresa</th><th>Email</th><th>Telefone</th><th>Origem</th><th>Etapa</th><th></th></tr></thead>
        <tbody>
          {items.map(x=> (
            <tr key={x.id} className="border-t">
              <td>{x.nome}</td><td>{x.empresa}</td><td>{x.email}</td><td>{x.telefone}</td><td>{x.origem}</td><td>{x.etapa}</td>
              <td><Button variant="outline" onClick={()=>remove(x.id)}>Excluir</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
