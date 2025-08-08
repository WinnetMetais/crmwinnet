// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOKEN = Deno.env.get('WHATSAPP_TOKEN')!;
const PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID')!;

async function sendDocument(to:string, pdfUrl:string, caption:string){
  const endpoint = `https://graph.facebook.com/v20.0/${PHONE_ID}/messages`;
  const body = { messaging_product: 'whatsapp', to, type: 'document', document: { link: pdfUrl, filename: 'Proposta-Winnet.pdf', caption } };
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`WA status ${res.status}: ${await res.text()}`);
  return await res.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try{
    const { to, pdfUrl, caption } = await req.json();
    if(!to || !pdfUrl) return new Response(JSON.stringify({ ok:false, error:'to/pdfUrl required' }), { status:400, headers: { 'content-type':'application/json', ...corsHeaders } });
    const r = await sendDocument(to, pdfUrl, caption ?? 'Proposta Winnet');
    return new Response(JSON.stringify({ ok:true, result:r }), { headers: { 'content-type':'application/json', ...corsHeaders } });
  }catch(e){
    return new Response(JSON.stringify({ ok:false, error:String(e) }), { status:500, headers: { 'content-type':'application/json', ...corsHeaders } });
  }
});
