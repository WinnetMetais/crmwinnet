import { supabase } from '@/integrations/supabase/client';

// Edge function base URL (no envs allowed in Lovable)
const SUPABASE_URL = 'https://fgabadpelymhgvbtemwa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWJhZHBlbHltaGd2YnRlbXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjI5MDQsImV4cCI6MjA2MzIzODkwNH0.f80W3Pj1uS7GYpnLMRj5FAXM08ogYXd-wX1_LWlfXCM';

export async function importarXLSX(file: File, sheet?: string){
  const form = new FormData();
  form.append('file', file);
  if (sheet) form.append('sheet', sheet);
  const res = await fetch(`${SUPABASE_URL}/functions/v1/import-xlsx`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
    body: form
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { ok:true, totals }
}

export async function gerarPDF(payload:any){
  const { data, error } = await supabase.functions.invoke('quote-pdf', { body: payload });
  if (error) throw error; return data;
}

export async function enviarWhatsApp(pdfUrl:string, to:string, customerName: string = 'Cliente'){
  const { data, error } = await supabase.functions.invoke('send-whatsapp-message', { body: { phone: to, message: `Proposta Winnet: ${pdfUrl}`, customerName } });
  if (error) throw error; return data;
}
