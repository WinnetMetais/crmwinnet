-- Verificar e criar tabela quote_items se não existir
CREATE TABLE IF NOT EXISTS public.quote_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id UUID,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'kg',
  unit_price NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view quote_items" 
ON public.quote_items 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create quote_items" 
ON public.quote_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update quote_items" 
ON public.quote_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete quote_items" 
ON public.quote_items 
FOR DELETE 
USING (true);

-- Verificar se existem produtos básicos para teste
INSERT INTO public.products (name, description, sku, cost_price, sale_price, unit, category, active)
VALUES 
  ('Chapa de Aço 1020', 'Chapa de aço carbono 1020', 'CH-1020', 15.50, 25.00, 'kg', 'Chapas', true),
  ('Tubo Redondo 1"', 'Tubo redondo de aço carbono 1 polegada', 'TR-001', 8.20, 14.50, 'kg', 'Tubos', true),
  ('Barra Redonda 3/4"', 'Barra redonda de aço carbono 3/4 polegada', 'BR-034', 12.80, 20.00, 'kg', 'Barras', true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  cost_price = EXCLUDED.cost_price,
  sale_price = EXCLUDED.sale_price,
  updated_at = now();

-- Atualizar configurações do sistema para dropdowns
INSERT INTO public.system_settings (setting_key, setting_value, description)
VALUES 
  ('opportunity_stages', '["prospecto", "qualificado", "proposta", "negociacao", "fechado_ganho", "fechado_perdido"]', 'Estágios das oportunidades'),
  ('lead_sources', '["Website", "Referência", "Google Ads", "Facebook", "LinkedIn", "Telefone", "Email", "Feira", "Outros"]', 'Fontes de leads'),
  ('units', '["kg", "ton", "m", "m2", "m3", "pc", "un", "cx", "lt"]', 'Unidades de medida')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();