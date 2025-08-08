import { useEffect, useState } from 'react';
import { importarXLSX } from '@/api/financeiro';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function FinanceiroUploadXLSX(){
  useEffect(()=>{ document.title = 'Financeiro - Importar XLSX | Winnet'; },[]);
  const [file, setFile] = useState<File|null>(null);
  const [sheet, setSheet] = useState('');
  const [log, setLog] = useState('');
  async function enviar(){
    if(!file) return alert('Selecione um .xlsx');
    setLog('Importando...');
    try{ const r = await importarXLSX(file, sheet || undefined); setLog(JSON.stringify(r?.totals||r, null, 2)); }
    catch(e:any){ setLog('Erro: '+e.message); }
  }
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Importar Planilha (.xlsx)</h1>
      <div className="grid sm:grid-cols-3 gap-3 items-center">
        <Input type="file" accept=".xlsx" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <Input placeholder="(Opcional) Aba: FLUXO 25 / CAIXA / ..." value={sheet} onChange={e=>setSheet(e.target.value)} />
        <Button onClick={enviar}>Enviar</Button>
      </div>
      <pre className="text-sm bg-slate-50 p-3 rounded border whitespace-pre-wrap">{log}</pre>
    </div>
  );
}
