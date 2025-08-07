-- Completar e corrigir estrutura do CRM - tabelas faltantes e relacionamentos

-- 1. Criar tabela customer_types se não existe
CREATE TABLE IF NOT EXISTS public.customer_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Criar tabela customers se não existe com estrutura completa
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  address text,
  city text,
  state text,
  zip_code text,
  notes text,
  status text DEFAULT 'active',
  lead_source text,
  website text,
  last_contact_date timestamp with time zone,
  custom_data jsonb DEFAULT '{}'::jsonb,
  lead_source_id uuid REFERENCES public.lead_sources(id),
  segment_id uuid REFERENCES public.customer_segments(id),
  customer_type_id uuid REFERENCES public.customer_types(id),
  priority_id uuid REFERENCES public.priorities(id),
  qualification_status_id uuid REFERENCES public.qualification_status(id),
  cnpj text,
  contact_person text,
  social_reason text,
  lead_score integer DEFAULT 0,
  lifecycle_stage text DEFAULT 'lead',
  source_details jsonb DEFAULT '{}'::jsonb,
  tags text[],
  owner text,
  created_by text,
  data_quality_score integer DEFAULT 0,
  last_validated_at timestamp with time zone,
  validation_errors jsonb DEFAULT '[]'::jsonb,
  data_completeness_percentage numeric DEFAULT 0.00
);

-- 3. Criar tabela opportunities se não existe
CREATE TABLE IF NOT EXISTS public.opportunities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  value numeric DEFAULT 0,
  probability integer DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  stage text DEFAULT 'prospect',
  status text DEFAULT 'active',
  assigned_to text,
  created_by text,
  notes text,
  custom_data jsonb DEFAULT '{}'::jsonb,
  data_quality_score integer DEFAULT 0,
  last_validated_at timestamp with time zone,
  validation_errors jsonb DEFAULT '[]'::jsonb
);

-- 4. Habilitar RLS em todas as tabelas
ALTER TABLE public.customer_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS para customer_types
DROP POLICY IF EXISTS "Anyone can view customer_types" ON public.customer_types;
CREATE POLICY "Anyone can view customer_types"
ON public.customer_types
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage customer_types" ON public.customer_types;
CREATE POLICY "Authenticated users can manage customer_types"
ON public.customer_types
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Criar políticas RLS para customers
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
CREATE POLICY "Authenticated users can view customers"
ON public.customers
FOR SELECT
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
CREATE POLICY "Authenticated users can insert customers"
ON public.customers
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
CREATE POLICY "Authenticated users can update customers"
ON public.customers
FOR UPDATE
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;
CREATE POLICY "Authenticated users can delete customers"
ON public.customers
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- 7. Criar políticas RLS para opportunities
DROP POLICY IF EXISTS "Authenticated users can view opportunities" ON public.opportunities;
CREATE POLICY "Authenticated users can view opportunities"
ON public.opportunities
FOR SELECT
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can insert opportunities" ON public.opportunities;
CREATE POLICY "Authenticated users can insert opportunities"
ON public.opportunities
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update opportunities" ON public.opportunities;
CREATE POLICY "Authenticated users can update opportunities"
ON public.opportunities
FOR UPDATE
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete opportunities" ON public.opportunities;
CREATE POLICY "Authenticated users can delete opportunities"
ON public.opportunities
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- 8. Triggers para atualização automática de timestamps
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Triggers para atualização automática de data quality score
DROP TRIGGER IF EXISTS update_customers_quality_score ON public.customers;
CREATE TRIGGER update_customers_quality_score
    BEFORE INSERT OR UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_customer_quality_score();

-- 10. Habilitar realtime para tabelas do CRM
ALTER TABLE public.customers REPLICA IDENTITY FULL;
ALTER TABLE public.opportunities REPLICA IDENTITY FULL;
ALTER TABLE public.customer_types REPLICA IDENTITY FULL;

-- 11. Inserir dados básicos se não existem
INSERT INTO public.customer_types (name, description) VALUES 
('Pessoa Física', 'Cliente pessoa física')
ON CONFLICT DO NOTHING;

INSERT INTO public.customer_types (name, description) VALUES 
('Pessoa Jurídica', 'Cliente pessoa jurídica')
ON CONFLICT DO NOTHING;

INSERT INTO public.customer_types (name, description) VALUES 
('Distribuidor', 'Cliente distribuidor/revendedor')
ON CONFLICT DO NOTHING;

-- 12. Inserir pipeline stages básicos se não existem
INSERT INTO public.pipeline_stages (name, description, order_position, color) VALUES 
('Prospecção', 'Identificação de potenciais clientes', 1, '#6B7280'),
('Qualificação', 'Avaliação do fit do cliente', 2, '#3B82F6'),
('Proposta', 'Elaboração e envio da proposta', 3, '#F59E0B'),
('Negociação', 'Discussão de termos e condições', 4, '#EF4444'),
('Fechamento', 'Finalização do negócio', 5, '#10B981')
ON CONFLICT DO NOTHING;

-- 13. Inserir lead sources básicos se não existem
INSERT INTO public.lead_sources (name, description) VALUES 
('Website', 'Leads vindos do site institucional'),
('Indicação', 'Leads vindos de indicações'),
('Redes Sociais', 'Leads vindos das redes sociais'),
('Eventos', 'Leads captados em eventos'),
('Telemarketing', 'Leads de campanhas de telemarketing'),
('Email Marketing', 'Leads de campanhas de email'),
('Google Ads', 'Leads vindos do Google Ads'),
('Facebook Ads', 'Leads vindos do Facebook Ads')
ON CONFLICT DO NOTHING;

-- 14. Inserir customer segments básicos se não existem
INSERT INTO public.customer_segments (name, description) VALUES 
('Enterprise', 'Grandes empresas'),
('SMB', 'Pequenas e médias empresas'),
('Startup', 'Empresas em fase inicial'),
('Governo', 'Órgãos governamentais'),
('Distribuidor', 'Canais de distribuição')
ON CONFLICT DO NOTHING;

-- 15. Inserir qualification status básicos se não existem
INSERT INTO public.qualification_status (name, description) VALUES 
('Não Qualificado', 'Lead ainda não qualificado'),
('Em Qualificação', 'Lead em processo de qualificação'),
('Qualificado', 'Lead qualificado como oportunidade'),
('Desqualificado', 'Lead que não atende aos critérios')
ON CONFLICT DO NOTHING;

-- 16. Inserir priorities básicas se não existem
INSERT INTO public.priorities (name, level, color) VALUES 
('Baixa', 1, '#6B7280'),
('Média', 2, '#F59E0B'),
('Alta', 3, '#EF4444'),
('Urgente', 4, '#DC2626')
ON CONFLICT DO NOTHING;