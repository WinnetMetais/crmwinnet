import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function FinanceiroDashboard(){
  useEffect(()=>{ document.title = 'Dashboard Financeiro | Winnet'; },[]);
  const [data, setData] = useState<any[]>([]);
  const [cards, setCards] = useState<any>({ entradas:0, saidas:0, saldo:0 });
  async function load(){
    const { data } = await supabase.from('lancamentos').select('data_lanc, entrada, saida').gte('data_lanc', new Date(new Date().getFullYear(),0,1).toISOString());
    const byMonth: Record<string, { mes:string; entradas:number; saidas:number; saldo:number }> = {};
    (data||[]).forEach((r:any)=>{ const d = new Date(r.data_lanc); const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; byMonth[key] ||= { mes:key, entradas:0, saidas:0, saldo:0 }; byMonth[key].entradas += Number(r.entrada||0); byMonth[key].saidas += Number(r.saida||0); byMonth[key].saldo = byMonth[key].entradas - byMonth[key].saidas; });
    const arr = Object.values(byMonth).sort((a,b)=>a.mes.localeCompare(b.mes)); setData(arr);
    const total = arr.reduce((acc,c)=>({ entradas: acc.entradas + c.entradas, saidas: acc.saidas + c.saidas, saldo: acc.saldo + c.saldo }), { entradas:0, saidas:0, saldo:0 });
    setCards(total);
  }
  useEffect(()=>{ load(); },[]);
  // Realtime refresh
  useEffect(()=>{
    const ch = supabase
      .channel('rt-financeiro')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lancamentos' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  },[]);
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="border rounded p-4"><div className="opacity-70 text-sm">Entradas (YTD)</div><div className="text-xl font-bold">R$ {cards.entradas.toFixed(2)}</div></div>
        <div className="border rounded p-4"><div className="opacity-70 text-sm">Saídas (YTD)</div><div className="text-xl font-bold">R$ {cards.saldo >= 0 ? cards.saidas.toFixed(2) : cards.saidas.toFixed(2)}</div></div>
        <div className="border rounded p-4"><div className="opacity-70 text-sm">Saldo (YTD)</div><div className="text-xl font-bold">R$ {cards.saldo.toFixed(2)}</div></div>
      </div>
      <div className="border rounded p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" /><YAxis /><Tooltip />
            <Line type="monotone" dataKey="entradas" stroke="#16a34a" />
            <Line type="monotone" dataKey="saidas" stroke="#ef4444" />
            <Line type="monotone" dataKey="saldo" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
