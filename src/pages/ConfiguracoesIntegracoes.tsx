import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ConfiguracoesIntegracoes(){
  useEffect(()=>{ document.title = 'Configurações & Integrações | Winnet'; },[]);
  const [wa,setWa] = useState({ phone_id:'', token:'' });
  const save = async()=>{ alert('Segredos do WhatsApp ficam APENAS nos Supabase secrets. Configure em Supabase -> Project Settings -> Functions -> Secrets.'); };
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Configurações & Integrações</h1>
      <div className="space-y-2">
        <h2 className="font-semibold">WhatsApp Cloud API</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          <Input placeholder="Phone ID (Supabase secret)" value={wa.phone_id} onChange={e=>setWa({...wa,phone_id:e.target.value})} />
          <Input placeholder="Token (Supabase secret)" value={wa.token} onChange={e=>setWa({...wa,token:e.target.value})} />
        </div>
        <Button onClick={save}>Salvar</Button>
      </div>
      <p className="text-sm opacity-70">Dica: use app de teste do Meta e cadastre números autorizados.</p>
    </div>
  );
}
