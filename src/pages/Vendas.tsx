import { useEffect, useState } from 'react';
// @ts-ignore
import { listPedidos } from '@/api/crm';

export default function Vendas(){
  useEffect(()=>{ document.title = 'Vendas (Pedidos) | Winnet'; },[]);
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ (async ()=> setItems(await listPedidos()))(); },[]);
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Vendas (Pedidos)</h1>
      <table className="w-full text-sm">
        <thead><tr><th>Número</th><th>Cliente</th><th>Status</th><th>Emissão</th><th>Total</th></tr></thead>
        <tbody>
          {items.map((x:any)=>(
            <tr key={x.id} className="border-t">
              <td>{x.numero}</td>
              <td>{x.clientes?.nome_fantasia || '-'}</td>
              <td>{x.status}</td>
              <td>{x.emissao}</td>
              <td>R$ {Number(x.total_liquido||0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
