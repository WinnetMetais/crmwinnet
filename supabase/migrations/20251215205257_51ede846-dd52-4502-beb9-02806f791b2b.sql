-- =====================================================
-- MIGRAÇÃO: Correção do Fluxo de Vendas Comercial
-- =====================================================

-- 1. Criar tabela lead_sources
CREATE TABLE IF NOT EXISTS public.lead_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lead_sources" ON public.lead_sources
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage lead_sources" ON public.lead_sources
  FOR ALL USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Dados iniciais
INSERT INTO public.lead_sources (name, description) VALUES
  ('Site', 'Formulário do site'),
  ('Indicação', 'Indicação de cliente'),
  ('LinkedIn', 'Rede social LinkedIn'),
  ('Google Ads', 'Campanha Google Ads'),
  ('Feira', 'Evento ou feira'),
  ('Prospecção Ativa', 'Contato direto'),
  ('WhatsApp', 'WhatsApp Business')
ON CONFLICT DO NOTHING;

-- 2. Criar tabela customer_types
CREATE TABLE IF NOT EXISTS public.customer_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.customer_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view customer_types" ON public.customer_types
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage customer_types" ON public.customer_types
  FOR ALL USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Dados iniciais
INSERT INTO public.customer_types (name, description) VALUES
  ('Indústria', 'Cliente industrial'),
  ('Comércio', 'Cliente comercial'),
  ('Condomínio', 'Condomínio residencial ou comercial'),
  ('Prefeitura', 'Órgão público municipal'),
  ('Construtora', 'Empresa de construção civil'),
  ('Revenda', 'Revendedor')
ON CONFLICT DO NOTHING;

-- 3. Criar tabela priorities
CREATE TABLE IF NOT EXISTS public.priorities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  color TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view priorities" ON public.priorities
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage priorities" ON public.priorities
  FOR ALL USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Dados iniciais
INSERT INTO public.priorities (name, level, color) VALUES
  ('Baixa', 1, '#22c55e'),
  ('Média', 2, '#f59e0b'),
  ('Alta', 3, '#ef4444'),
  ('Urgente', 4, '#dc2626')
ON CONFLICT DO NOTHING;

-- 4. Criar tabela qualification_status
CREATE TABLE IF NOT EXISTS public.qualification_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.qualification_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view qualification_status" ON public.qualification_status
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Admins can manage qualification_status" ON public.qualification_status
  FOR ALL USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Dados iniciais
INSERT INTO public.qualification_status (name, description) VALUES
  ('Não Qualificado', 'Lead ainda não qualificado'),
  ('Em Qualificação', 'Em processo de qualificação'),
  ('Qualificado', 'Lead qualificado'),
  ('Desqualificado', 'Lead desqualificado')
ON CONFLICT DO NOTHING;

-- 5. Criar tabela pipeline_history para rastrear mudanças de estágio
CREATE TABLE IF NOT EXISTS public.pipeline_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  from_stage_id UUID REFERENCES public.pipeline_stages(id),
  to_stage_id UUID REFERENCES public.pipeline_stages(id),
  reason TEXT,
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pipeline_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pipeline_history" ON public.pipeline_history
  FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert pipeline_history" ON public.pipeline_history
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- 6. Adicionar colunas faltantes em deals
ALTER TABLE public.deals 
  ADD COLUMN IF NOT EXISTS pipeline_stage_id UUID REFERENCES public.pipeline_stages(id),
  ADD COLUMN IF NOT EXISTS priority_id UUID REFERENCES public.priorities(id),
  ADD COLUMN IF NOT EXISTS qualification_status_id UUID REFERENCES public.qualification_status(id),
  ADD COLUMN IF NOT EXISTS estimated_value NUMERIC,
  ADD COLUMN IF NOT EXISTS actual_value NUMERIC,
  ADD COLUMN IF NOT EXISTS close_date DATE,
  ADD COLUMN IF NOT EXISTS proposal_sent_date DATE,
  ADD COLUMN IF NOT EXISTS proposal_value NUMERIC,
  ADD COLUMN IF NOT EXISTS presentation_sent_date DATE,
  ADD COLUMN IF NOT EXISTS follow_up_date DATE,
  ADD COLUMN IF NOT EXISTS active_follow_up BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS observations TEXT;

-- 7. Adicionar coluna unit em opportunity_items
ALTER TABLE public.opportunity_items
  ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'un';

-- 8. Adicionar colunas faltantes em customers
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS social_reason TEXT,
  ADD COLUMN IF NOT EXISTS lifecycle_stage TEXT DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS owner_id UUID,
  ADD COLUMN IF NOT EXISTS customer_type_id UUID REFERENCES public.customer_types(id);

-- 9. Adicionar colunas faltantes em pipeline_activities
ALTER TABLE public.pipeline_activities
  ADD COLUMN IF NOT EXISTS activity_type TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completed_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- 10. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_deals_pipeline_stage_id ON public.deals(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_priority_id ON public.deals(priority_id);
CREATE INDEX IF NOT EXISTS idx_deals_qualification_status_id ON public.deals(qualification_status_id);
CREATE INDEX IF NOT EXISTS idx_deals_close_date ON public.deals(close_date);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type_id ON public.customers(customer_type_id);
CREATE INDEX IF NOT EXISTS idx_customers_lifecycle_stage ON public.customers(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_pipeline_history_deal_id ON public.pipeline_history(deal_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_activities_customer_id ON public.pipeline_activities(customer_id);

-- 11. Popular pipeline_stages se vazio
INSERT INTO public.pipeline_stages (name, order_position, color, pipeline_type) 
SELECT * FROM (VALUES
  ('Qualificação', 1, '#3b82f6', 'sales'),
  ('Contato Inicial', 2, '#8b5cf6', 'sales'),
  ('Proposta', 3, '#f59e0b', 'sales'),
  ('Negociação', 4, '#ef4444', 'sales'),
  ('Fechado Ganho', 5, '#22c55e', 'sales'),
  ('Fechado Perdido', 6, '#6b7280', 'sales')
) AS t(name, order_position, color, pipeline_type)
WHERE NOT EXISTS (SELECT 1 FROM public.pipeline_stages LIMIT 1);