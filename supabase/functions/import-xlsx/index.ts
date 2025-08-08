// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const S = (v:any)=> String(v ?? '').trim();
const N = (v:any)=> Number(String(v ?? '0').replace(/\./g,'').replace(',','.')) || 0;
function toDate(v:any){
  if (v == null || v === '') return null;
  if (typeof v === 'number') {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const d = new Date(epoch.getTime() + v * 86400000);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
function ymToFirstDay(s: string){
  const m = /^\d{4}-\d{2}$/.test(s) ? new Date(s+"-01") : new Date();
  return new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth(), 1));
}
function sheetJSON(wb: XLSX.WorkBook, name: string){
  const ws = wb.Sheets[name];
  if (!ws) return [] as any[];
  return XLSX.utils.sheet_to_json(ws, { defval: null });
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const ct = req.headers.get('content-type')||'';
  if (!ct.includes('multipart/form-data')) {
    return new Response('Use multipart form-data with a file field named "file"', { status:400, headers: corsHeaders });
  }

  const form = await req.formData();
  const file = form.get('file') as File; if(!file) return new Response('file required', { status:400, headers: corsHeaders });
  const only = (form.get('sheet') as string | null)?.toUpperCase();

  const ab = await file.arrayBuffer();
  const wb = XLSX.read(new Uint8Array(ab), { type:'array' });

  let totals = { lanc:0, saldos:0, pagar:0, receber:0, metas:0 };

  async function upsertConta(nome:string){
    const { data } = await supabase.from('contas_financeiras').select('id').eq('nome', nome).maybeSingle();
    if (data?.id) return data.id as string;
    const { data: ins, error } = await supabase.from('contas_financeiras').insert({ nome }).select('id').single();
    if (error) throw error; return (ins as any).id as string;
  }

  // FLUXO 25 → lancamentos
  if (!only || only.includes('FLUXO')){
    const rows = sheetJSON(wb, 'FLUXO 25');
    if (rows.length){
      const payload = rows.map((r:any)=>({
        data_lanc: toDate(r['VENCIME'] ?? r['VENCIMENTO'] ?? r['DATA'] ?? r['MES']) ?? new Date(),
        descricao: S(r['NOME'] ?? r['DESCRIÇÃO'] ?? r['DESCRICAO'] ?? r['HISTORICO']),
        entrada: N(r['ENTRADA']),
        saida: N(r['SAIDA'] ?? r['SAÍDA']),
        forma_pagamento: S(r['PAGAMENTO'] ?? r['FORMA'] ?? r['MEIO']),
        status: S(r['STATUS']),
        origem: 'FLUXO 25'
      }));
      const { count, error } = await supabase.from('lancamentos').insert(payload, { count: 'exact' });
      if (error) throw error; totals.lanc += count ?? payload.length;
    }
  }

  // CAIXA → saldos_mensais
  if (!only || only === 'CAIXA'){
    const rows = sheetJSON(wb, 'CAIXA');
    if (rows.length){
      const header = XLSX.utils.sheet_to_json(wb.Sheets['CAIXA'], { header:1 }) as any[];
      let contaInferida = String(header?.[0]?.[0] ?? '');
      if (!contaInferida) contaInferida = 'Conta Principal';
      const cache: Record<string,string> = {};
      for (const r of rows as any[]){
        const contaNome = S(r['CONTA'] ?? contaInferida);
        if (!cache[contaNome]) cache[contaNome] = await upsertConta(contaNome);
        const { error } = await supabase.from('saldos_mensais').upsert({
          conta_fin_id: cache[contaNome],
          mes: ymToFirstDay(S(r['MES'] ?? r['MÊS'] ?? '')),
          saldo_inicio: N(r['INICIO'] ?? r['INÍCIO']),
          entradas: N(r['ENTRADA']),
          saidas: N(r['SAIDA'] ?? r['SAÍDA']),
          saldo_final: N(r['FINAL'])
        }, { onConflict: 'conta_fin_id,mes' });
        if (error) throw error; totals.saldos++;
      }
    }
  }

  // CREDITO → contas_pagar
  if (!only || only === 'CREDITO'){
    const rows = sheetJSON(wb, 'CREDITO');
    if (rows.length){
      const payload = rows.map((r:any)=>({
        fornecedor: 'Cartão de Crédito',
        fatura_ref: S(r['PARCEL'] ?? r['PARCELA']),
        emissao: toDate(r['DATA']) ?? new Date(),
        vencimento: toDate(r['DATA']) ?? new Date(),
        valor: N(r['VALOR']),
        status: 'PAGA'
      }));
      const { count, error } = await supabase.from('contas_pagar').insert(payload, { count:'exact' });
      if (error) throw error; totals.pagar += count ?? payload.length;
    }
  }

  // COMERCIAL / DIGITAL → contas_receber + lancamentos
  for (const aba of ['COMERCIAL','DIGITAL']){
    if (!only || only === aba){
      const rows = sheetJSON(wb, aba);
      if (rows.length){
        const receber = rows.map((r:any)=>({
          canal: S(r['CANAL'] ?? aba),
          pedido: S(r['PEDIDO']),
          emissao: toDate(r['DATA']) ?? new Date(),
          vencimento: toDate(r['DATA']) ?? new Date(),
          valor: N(r['VALOR']),
          meio_pagamento: S(r['PAGAMENTO']),
          status: 'PAGA'
        }));
        const { count, error } = await supabase.from('contas_receber').insert(receber, { count:'exact' });
        if (error) throw error; totals.receber += count ?? receber.length;

        const entradas = rows.map((r:any)=>({
          data_lanc: toDate(r['DATA']) ?? new Date(),
          descricao: `${S(r['CANAL'] ?? aba)} • ${S(r['NOME'])}`.trim(),
          entrada: N(r['VALOR']),
          saida: 0,
          forma_pagamento: S(r['PAGAMENTO']),
          status: 'ENTRADA-VENDAS',
          origem: aba
        }));
        const { error: e2 } = await supabase.from('lancamentos').insert(entradas);
        if (e2) throw e2; totals.lanc += entradas.length;
      }
    }
  }

  // META → metas_vendas
  if (!only || only === 'META'){
    const rows = sheetJSON(wb, 'META');
    if (rows.length){
      const payload = rows.map((r:any)=>({
        canal: S(r['CANAL']),
        mes: ymToFirstDay(S(r['MES'] ?? '')),
        meta_minima: N(r['META MINIMA'] ?? r['META MÍNIMA']),
        meta: N(r['META']),
        faturado: N(r['FATURADO']),
        vendas: Number(String(r['VENDAS'] ?? '0').replace(/\./g,'').replace(',','.')) || 0,
        ticket_medio: N(r['TICKET MEDIO'] ?? r['TICKET MÉDIO']),
        investido: N(r['INVESTIDO']),
        diferenca: N(r['DIFERENCA'] ?? r['DIFERENÇA'])
      }));
      const { error } = await supabase.from('metas_vendas').upsert(payload, { onConflict: 'canal,mes' });
      if (error) throw error; totals.metas += payload.length;
    }
  }

  return new Response(JSON.stringify({ ok:true, totals }), { headers: { 'content-type':'application/json', ...corsHeaders } });
});
