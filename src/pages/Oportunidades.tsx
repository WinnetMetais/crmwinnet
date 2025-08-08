import { useEffect, useState } from 'react';
import { listOportunidades, upsertOportunidade, deleteOportunidade } from '@/api/crm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function Oportunidades(){
  useEffect(()=>{ document.title = 'Oportunidades CRM | Winnet'; },[]);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ titulo:'', valor_previsto:0, probabilidade:50, etapa:'NOVO' });
  async function load(){ setItems(await listOportunidades()); }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{
    const ch = supabase.channel('rt-oportunidades').on('postgres_changes', { event:'*', schema:'public', table:'oportunidades' }, load).subscribe();
    return ()=>{ supabase.removeChannel(ch); };
  },[]);
  async function save(){ await upsertOportunidade(form); setForm({ titulo:'', valor_previsto:0, probabilidade:50, etapa:'NOVO' }); await load(); }
  async function remove(id:string){ if (confirm('Excluir oportunidade?')){ await deleteOportunidade(id); await load(); } }
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Oportunidades</h1>
      <div className="grid md:grid-cols-6 gap-2">
        <Input placeholder="Título" value={form.titulo||''} onChange={e=>setForm({...form,titulo:e.target.value})} />
        <Input placeholder="Valor Previsto" type="number" value={form.valor_previsto||0} onChange={e=>setForm({...form,valor_previsto:parseFloat(e.target.value)})} />
        <Input placeholder="Probabilidade" type="number" value={form.probabilidade||50} onChange={e=>setForm({...form,probabilidade:parseInt(e.target.value)})} />
        <Input placeholder="Etapa" value={form.etapa||'NOVO'} onChange={e=>setForm({...form,etapa:e.target.value})} />
        <Button className="md:col-span-2" onClick={save}>Salvar</Button>
      </div>
      <table className="w-full text-sm">
        <thead><tr><th>Título</th><th>Valor</th><th>Prob.</th><th>Etapa</th><th></th></tr></thead>
        <tbody>
          {items.map(x=> (
            <tr key={x.id} className="border-t">
              <td>{x.titulo}</td><td>R$ {Number(x.valor_previsto||0).toFixed(2)}</td><td>{x.probabilidade}%</td><td>{x.etapa}</td>
              <td><Button variant="outline" onClick={()=>remove(x.id)}>Excluir</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
